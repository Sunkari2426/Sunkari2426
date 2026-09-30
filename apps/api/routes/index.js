const router = require('express').Router();
const auth = require('../controllers/authController');
const address = require('../controllers/addressController');
const category = require('../controllers/categoryController');
const pickup = require('../controllers/pickupController');
const { authenticate, allowRoles } = require('../middleware/auth');

router.post('/auth/request-otp', auth.requestOtp);
router.post('/auth/verify-otp', auth.verifyOtp);

router.use(authenticate);
router.get('/addresses', address.list);
router.post('/addresses', allowRoles('customer'), address.create);
router.get('/categories', category.list);
router.post('/categories', allowRoles('admin'), category.create);
router.post('/categories/:categoryId/rates', allowRoles('admin'), category.setRate);

router.get('/pickups/available', allowRoles('collector'), pickup.available);
router.post('/pickups', allowRoles('customer'), pickup.create);
router.get('/pickups', pickup.list);
router.get('/pickups/:id', pickup.detail);
router.post('/pickups/:id/cancel', allowRoles('customer', 'admin'), pickup.cancel);
router.post('/pickups/:id/assign', allowRoles('admin'), pickup.assign);
router.post('/pickups/:id/accept', allowRoles('collector'), pickup.accept);
router.patch('/pickups/:id/status', allowRoles('collector', 'admin'), pickup.updateStatus);

module.exports = router;
