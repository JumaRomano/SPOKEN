const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authenticate = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const auditLog = require('../middleware/auditLog');
const validate = require('../middleware/validation');
const { eventSchemas } = require('../validators/schemas');

// Public routes
router.get('/public', eventController.getAll);

router.use(authenticate);

// Event CRUD
router.get('/', rbac('events', 'read'), eventController.getAll);
router.get('/:id', rbac('events', 'read'), eventController.getById);
router.post('/', rbac('events', 'create'), auditLog('create', 'events'), validate(eventSchemas.create), eventController.create);
router.put('/:id', rbac('events', 'update'), auditLog('update', 'events'), validate(eventSchemas.create), eventController.update);
router.delete('/:id', rbac('events', 'delete'), auditLog('delete', 'events'), eventController.delete);

// Event registration
router.post('/:id/register', rbac('events', 'create'), auditLog('create', 'event_registrations'), eventController.register);
router.delete('/:id/register/:memberId', rbac('events', 'create'), auditLog('delete', 'event_registrations'), eventController.cancelRegistration);
router.get('/:id/registrations', rbac('events', 'read'), eventController.getRegistrations);

// Volunteer management
router.get('/:id/volunteers', rbac('events', 'read'), eventController.getVolunteerRoles);
router.post('/:id/volunteers', rbac('events', 'create'), auditLog('create', 'volunteer_roles'), eventController.createVolunteerRole);
router.post('/volunteers/:roleId/signup', rbac('events', 'create'), auditLog('create', 'volunteer_signups'), eventController.volunteerSignup);

module.exports = router;
