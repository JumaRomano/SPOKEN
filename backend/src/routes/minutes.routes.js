const express = require('express');
const router = express.Router();
const minutesController = require('../controllers/minutesController');
const authenticate = require('../middleware/auth');
const rbac = require('../middleware/rbac');

router.use(authenticate);

router.get('/', rbac('minutes', 'read'), minutesController.getAll);
router.get('/:id', rbac('minutes', 'read'), minutesController.getById);
router.post('/', rbac('minutes', 'create'), minutesController.create);
router.put('/:id', rbac('minutes', 'update'), minutesController.update);
router.delete('/:id', rbac('minutes', 'delete'), minutesController.delete);

module.exports = router;
