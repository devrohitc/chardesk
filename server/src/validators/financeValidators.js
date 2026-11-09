const { body } = require('express-validator');

const createTransactionValidator = [
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('date')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be formatted as YYYY-MM-DD'),
  body('kind')
    .optional()
    .isIn(['expense', 'income'])
    .withMessage('Kind must be expense or income'),
];

const createBillValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Bill name is required'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('dueDay')
    .isInt({ min: 1, max: 31 })
    .withMessage('Due day must be between 1 and 31'),
];

module.exports = {
  createTransactionValidator,
  createBillValidator,
};
