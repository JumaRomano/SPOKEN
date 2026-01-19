const express = require('express');
const router = express.Router();
const sermonController = require('../controllers/sermonController');
const authenticate = require('../middleware/auth');

// Public route
router.get('/', sermonController.getAll);

// Protected routes
router.use(authenticate);

router.post('/', sermonController.create);
router.delete('/:id', sermonController.delete);

module.exports = router;
