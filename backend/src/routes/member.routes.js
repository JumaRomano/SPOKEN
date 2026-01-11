const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const authenticate = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const auditLog = require('../middleware/auditLog');

// All routes require authentication
router.use(authenticate);

// GET routes
router.get('/', rbac('members', 'read'), memberController.getAll);
router.get('/:id', rbac('members', 'read'), memberController.getById);
router.get('/:id/family', rbac('members', 'read'), memberController.getFamily);
router.get('/:id/groups', rbac('members', 'read'), memberController.getGroups);
router.get('/:id/attendance', rbac('members', 'read'), memberController.getAttendance);
router.get('/:id/contributions', rbac('contributions', 'read'), memberController.getContributions);
router.get('/:id/events', rbac('members', 'read'), memberController.getEvents);

// POST routes
router.post('/', rbac('members', 'create'), auditLog('create', 'members'), memberController.create);

// PUT routes
router.put('/:id', rbac('members', 'update'), auditLog('update', 'members'), memberController.update);

// DELETE routes
router.delete('/:id', rbac('members', 'delete'), auditLog('delete', 'members'), memberController.delete);

module.exports = router;
