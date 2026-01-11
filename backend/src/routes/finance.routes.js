const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const authenticate = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const auditLog = require('../middleware/auditLog');

router.use(authenticate);

// Funds
router.get('/funds', rbac('funds', 'read'), financeController.getFunds);
router.post('/funds', rbac('funds', 'create'), auditLog('create', 'funds'), financeController.createFund);

// Contributions
router.get('/contributions', rbac('contributions', 'read'), financeController.getContributions);
router.post('/contributions', rbac('contributions', 'create'), auditLog('create', 'contributions'), financeController.recordContribution);
router.get('/contributions/statistics', rbac('contributions', 'read'), financeController.getStatistics);

// Pledges
router.post('/pledges', rbac('pledges', 'create'), auditLog('create', 'pledges'), financeController.createPledge);
router.get('/pledges/member/:memberId', rbac('pledges', 'read'), financeController.getMemberPledges);

// Levies
router.post('/levies', rbac('group_finances', 'create'), auditLog('create', 'levies'), financeController.createLevy);
router.post('/levies/:levyId/payments', rbac('group_finances', 'create'), auditLog('create', 'levy_payments'), financeController.recordLevyPayment);
router.get('/levies/:levyId/payments', rbac('group_finances', 'read'), financeController.getLevyPayments);

// Reports
router.get('/reports/giving', rbac('reports', 'read'), financeController.generateGivingReport);

module.exports = router;
