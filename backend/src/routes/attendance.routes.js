const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authenticate = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const auditLog = require('../middleware/auditLog');
const validate = require('../middleware/validation');
const { serviceSchemas } = require('../validators/schemas');

router.use(authenticate);

// Service management
router.get('/services', rbac('attendance', 'read'), attendanceController.getServices);
router.get('/services/:id', rbac('attendance', 'read'), attendanceController.getServiceById);
router.post('/services', rbac('attendance', 'create'), auditLog('create', 'services'), validate(serviceSchemas.create), attendanceController.createService);
router.put('/services/:id', rbac('attendance', 'update'), auditLog('update', 'services'), validate(serviceSchemas.create), attendanceController.updateService);
router.delete('/services/:id', rbac('attendance', 'delete'), auditLog('delete', 'services'), attendanceController.deleteService);

// Attendance recording
router.post('/services/:id/records', rbac('attendance', 'create'), auditLog('create', 'attendance_records'), attendanceController.recordAttendance);
router.post('/services/:id/records/bulk', rbac('attendance', 'create'), auditLog('create', 'attendance_records'), attendanceController.bulkRecordAttendance);
router.get('/services/:id/records', rbac('attendance', 'read'), attendanceController.getServiceAttendance);

// Statistics
router.get('/statistics', rbac('attendance', 'read'), attendanceController.getStatistics);

// Group attendance
router.post('/groups/:groupId/attendance', rbac('attendance', 'create'), auditLog('create', 'group_attendance'), attendanceController.recordGroupAttendance);

module.exports = router;
