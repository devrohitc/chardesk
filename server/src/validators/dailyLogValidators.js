const { param, body } = require('express-validator');

const updateDailyLogValidator = [
  param('date')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be formatted as YYYY-MM-DD'),
  body('journal')
    .optional()
    .isLength({ max: 20000 })
    .withMessage('Journal cannot exceed 20,000 characters'),
  body('water')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('Water glasses must be between 0 and 50'),
];

module.exports = {
  updateDailyLogValidator,
};
