const { TRANSITIONS } = require('../config/constants');

function assertTransition(currentStatus, nextStatus) {
  if (!TRANSITIONS[currentStatus]?.includes(nextStatus)) {
    throw new Error(`Invalid pickup transition: ${currentStatus} -> ${nextStatus}`);
  }
}

function validatePickupCreation({ address, scheduledAt, items }) {
  if (!address || !scheduledAt || !Array.isArray(items) || items.length === 0) {
    throw new Error('address, scheduledAt, and at least one item are required');
  }

  const date = new Date(scheduledAt);
  if (Number.isNaN(date.getTime()) || date <= new Date()) {
    throw new Error('scheduledAt must be a valid future date');
  }

  if (items.some((item) => !item.category)) {
    throw new Error('every item must include a category');
  }
}

function canAccessPickup(pickup, user) {
  return user.role === 'admin'
    || String(pickup.customer) === user.id
    || String(pickup.collector) === user.id;
}

function calculateTotal(items, ratesByCategory) {
  const total = items.reduce((sum, item) => {
    const weight = Number(item.actualWeightKg);
    const rate = ratesByCategory[String(item.category)];

    if (!Number.isFinite(weight) || weight < 0 || !Number.isFinite(rate) || rate < 0) {
      throw new Error('A non-negative actual weight and active rate are required');
    }

    return sum + weight * rate;
  }, 0);

  return Math.round((total + Number.EPSILON) * 100) / 100;
}

module.exports = {
  assertTransition,
  calculateTotal,
  canAccessPickup,
  validatePickupCreation,
};
