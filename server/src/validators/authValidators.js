const { body } = require('express-validator');

const registerValidator = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Trainer ID is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Trainer ID must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Trainer ID can only contain letters, numbers, hyphens, and underscores'),
  body('displayName')
    .optional()
    .trim()
    .isLength({ max: 40 })
    .withMessage('Display name cannot exceed 40 characters'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const loginValidator = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Trainer ID is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

module.exports = {
  registerValidator,
  loginValidator,
};
