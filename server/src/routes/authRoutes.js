const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { registerValidator, loginValidator } = require('../validators/authValidators');

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.get('/me', authMiddleware, authController.getMe);
router.get('/users', authController.listUsers);

module.exports = router;
