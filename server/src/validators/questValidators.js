const { body } = require('express-validator');

const createQuestValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Quest title is required')
    .isLength({ max: 100 })
    .withMessage('Quest title cannot exceed 100 characters'),
  body('category')
    .optional()
    .isIn(['all', 'weekly', 'daily', 'work', 'fitness', 'life'])
    .withMessage('Invalid quest book category'),
  body('xp')
    .optional()
    .isInt({ min: 0 })
    .withMessage('XP must be a positive number'),
];

module.exports = {
  createQuestValidator,
};
