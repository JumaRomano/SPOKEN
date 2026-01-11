const express = require('express');
const router = express.Router();
const reportingController = require('../controllers/reportingController');
const authenticate = require('../middleware/auth');
const rbac = require('../middleware/rbac');

router.use(authenticate);

// Dashboard and analytics
router.get('/dashboard', reportingController.getDashboardStats);
router.get('/attendance/trends', rbac('reports', 'read'), reportingController.getAttendanceTrends);
router.get('/giving/trends', rbac('reports', 'read'), reportingController.getGivingTrends);
router.get('/membership/growth', rbac('reports', 'read'), reportingController.getMembershipGrowth);
router.get('/groups/health', rbac('reports', 'read'), reportingController.getGroupHealth);
router.get('/engagement', rbac('reports', 'read'), reportingController.getMemberEngagement);
router.post('/custom', rbac('reports', 'read'), reportingController.generateCustomReport);

module.exports = router;
