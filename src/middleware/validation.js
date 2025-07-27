const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name is required and must be less than 100 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name is required and must be less than 100 characters'),
  body('totalIncome')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Total income must be a positive number'),
  body('needsPercentage')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Needs percentage must be between 0 and 100'),
  body('wantsPercentage')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Wants percentage must be between 0 and 100'),
  body('savingsPercentage')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Savings percentage must be between 0 and 100'),
  handleValidationErrors
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

const budgetEntryValidation = [
  body('item')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Item name is required and must be less than 255 characters'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  handleValidationErrors
];

const profileUpdateValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name is required and must be less than 100 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name is required and must be less than 100 characters'),
  body('totalIncome')
    .isFloat({ min: 0 })
    .withMessage('Total income must be a positive number'),
  body('needsPercentage')
    .isInt({ min: 0, max: 100 })
    .withMessage('Needs percentage must be between 0 and 100'),
  body('wantsPercentage')
    .isInt({ min: 0, max: 100 })
    .withMessage('Wants percentage must be between 0 and 100'),
  body('savingsPercentage')
    .isInt({ min: 0, max: 100 })
    .withMessage('Savings percentage must be between 0 and 100'),
  (req, res, next) => {
    const { needsPercentage, wantsPercentage, savingsPercentage } = req.body;
    if (needsPercentage + wantsPercentage + savingsPercentage !== 100) {
      return res.status(400).json({
        error: 'Percentages must add up to 100'
      });
    }
    next();
  },
  handleValidationErrors
];

module.exports = {
  registerValidation,
  loginValidation,
  budgetEntryValidation,
  profileUpdateValidation,
  handleValidationErrors
};
