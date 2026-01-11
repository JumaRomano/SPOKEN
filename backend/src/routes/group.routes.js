const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authenticate = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const auditLog = require('../middleware/auditLog');

router.use(authenticate);

// Group CRUD
router.get('/', rbac('groups', 'read'), groupController.getAll);
router.get('/:id', rbac('groups', 'read'), groupController.getById);
router.post('/', rbac('groups', 'create'), auditLog('create', 'groups'), groupController.create);
router.put('/:id', rbac('groups', 'update'), auditLog('update', 'groups'), groupController.update);
router.delete('/:id', rbac('groups', 'delete'), auditLog('delete', 'groups'), groupController.delete);

// Group members
router.get('/:id/members', rbac('groups', 'read'), groupController.getMembers);
router.post('/:id/members', rbac('groups', 'update'), auditLog('create', 'group_members'), groupController.addMember);
router.delete('/:id/members/:memberId', rbac('groups', 'update'), auditLog('delete', 'group_members'), groupController.removeMember);

// Group finances
router.get('/:id/finances', rbac('group_finances', 'read'), groupController.getFinances);
router.post('/:id/finances', rbac('group_finances', 'create'), auditLog('create', 'group_finances'), groupController.recordTransaction);

// Group attendance
router.get('/:id/attendance', rbac('groups', 'read'), groupController.getAttendance);

module.exports = router;
