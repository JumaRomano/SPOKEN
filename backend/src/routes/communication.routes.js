const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');
const authenticate = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const auditLog = require('../middleware/auditLog');

router.use(authenticate);

// Announcements
router.get('/announcements', rbac('announcements', 'read'), communicationController.getAnnouncements);
router.get('/announcements/:id', rbac('announcements', 'read'), communicationController.getById);
router.post('/announcements', rbac('announcements', 'create'), auditLog('create', 'announcements'), communicationController.create);
router.put('/announcements/:id', rbac('announcements', 'update'), auditLog('update', 'announcements'), communicationController.update);
router.delete('/announcements/:id', rbac('announcements', 'delete'), auditLog('delete', 'announcements'), communicationController.delete);

// Publishing and broadcasting
router.post('/announcements/:id/publish', rbac('announcements', 'create'), auditLog('update', 'announcements'), communicationController.publish);
router.post('/announcements/:id/broadcast', rbac('announcements', 'create'), auditLog('create', 'communication_logs'), communicationController.sendBroadcast);

// Logs
router.get('/logs', rbac('announcements', 'read'), communicationController.getLogs);

module.exports = router;
