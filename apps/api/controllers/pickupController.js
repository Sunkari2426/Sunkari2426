const Address = require('../models/Address');
const Pickup = require('../models/Pickup');
const Rate = require('../models/ScrapRate');
const {
  assertTransition,
  calculateTotal,
  canAccessPickup,
  validatePickupCreation,
} = require('../services/pickupService');

function badRequest(res, error) {
  return res.status(400).json({ error });
}

exports.create = async (req, res, next) => {
  try {
    validatePickupCreation(req.body);
    const { address, scheduledAt, items } = req.body;
    const ownedAddress = await Address.exists({ _id: address, user: req.user.id });
    if (!ownedAddress) return res.status(403).json({ error: 'Address does not belong to customer' });

    const pickup = await Pickup.create({
      customer: req.user.id,
      address,
      scheduledAt,
      items: items.map(({ category, estimatedWeightKg }) => ({ category, estimatedWeightKg })),
    });
    return res.status(201).json(pickup);
  } catch (error) {
    if (error.message.includes('required') || error.message.includes('future') || error.message.includes('category')) {
      return badRequest(res, error.message);
    }
    return next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : req.user.role === 'collector'
      ? { collector: req.user.id }
      : { customer: req.user.id };
    return res.json(await Pickup.find(query).sort({ createdAt: -1 }));
  } catch (error) { return next(error); }
};

exports.available = async (_req, res, next) => {
  try {
    return res.json(await Pickup.find({ status: 'PENDING' }).sort({ scheduledAt: 1 }));
  } catch (error) { return next(error); }
};

exports.detail = async (req, res, next) => {
  try {
    const pickup = await Pickup.findById(req.params.id).populate('address items.category');
    if (!pickup) return res.status(404).json({ error: 'Pickup not found' });
    if (!canAccessPickup(pickup, req.user)) return res.status(403).json({ error: 'Forbidden' });
    return res.json(pickup);
  } catch (error) { return next(error); }
};

exports.cancel = async (req, res, next) => {
  try {
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) return res.status(404).json({ error: 'Pickup not found' });
    if (req.user.role !== 'admin' && String(pickup.customer) !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    assertTransition(pickup.status, 'CANCELLED');
    pickup.status = 'CANCELLED';
    pickup.cancelledAt = new Date();
    await pickup.save();
    return res.json(pickup);
  } catch (error) {
    if (error.message.startsWith('Invalid pickup transition')) return badRequest(res, error.message);
    return next(error);
  }
};

exports.assign = async (req, res, next) => {
  try {
    const { collectorId } = req.body;
    if (!collectorId) return badRequest(res, 'collectorId is required');
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) return res.status(404).json({ error: 'Pickup not found' });
    assertTransition(pickup.status, 'ASSIGNED');
    pickup.collector = collectorId;
    pickup.status = 'ASSIGNED';
    await pickup.save();
    return res.json(pickup);
  } catch (error) {
    if (error.message.startsWith('Invalid pickup transition')) return badRequest(res, error.message);
    return next(error);
  }
};

exports.accept = async (req, res, next) => {
  try {
    const pickup = await Pickup.findOneAndUpdate(
      { _id: req.params.id, status: 'ASSIGNED', collector: req.user.id },
      { $set: { status: 'ACCEPTED' } },
      { new: true },
    );
    if (!pickup) return res.status(409).json({ error: 'Pickup is not assigned to this collector' });
    return res.json(pickup);
  } catch (error) { return next(error); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) return res.status(404).json({ error: 'Pickup not found' });
    if (req.user.role !== 'admin' && String(pickup.collector) !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const { status, items } = req.body;
    assertTransition(pickup.status, status);

    if (status === 'PAYMENT_PENDING') {
      if (!Array.isArray(items) || items.length !== pickup.items.length) {
        return badRequest(res, 'actual weights are required for every pickup item');
      }
      const weights = items.map((item) => item.actualWeightKg);
      const categoryIds = pickup.items.map((item) => item.category);
      const rates = await Rate.find({ category: { $in: categoryIds }, active: true }).sort({ effectiveFrom: -1 });
      const ratesByCategory = {};
      rates.forEach((rate) => {
        if (ratesByCategory[String(rate.category)] === undefined) ratesByCategory[String(rate.category)] = rate.pricePerKg;
      });

      pickup.items.forEach((item, index) => { item.actualWeightKg = weights[index]; });
      pickup.finalTotal = calculateTotal(pickup.items, ratesByCategory);
      pickup.items.forEach((item) => {
        item.ratePerKg = ratesByCategory[String(item.category)];
        item.lineTotal = Math.round((item.actualWeightKg * item.ratePerKg + Number.EPSILON) * 100) / 100;
      });
    }

    pickup.status = status;
    await pickup.save();
    return res.json(pickup);
  } catch (error) {
    if (error.message.startsWith('Invalid pickup transition') || error.message.includes('actual weight')) {
      return badRequest(res, error.message);
    }
    return next(error);
  }
};
