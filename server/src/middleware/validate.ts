import { Request, Response, NextFunction } from 'express';
import { param, query, validationResult, ValidationChain } from 'express-validator';

// Validation result handler
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }
  next();
};

// Match ID validation
export const validateMatchId = [
  param('id').isNumeric().withMessage('Match ID must be numeric'),
  handleValidationErrors
];

// Player ID validation
export const validatePlayerId = [
  param('playerId').isNumeric().withMessage('Player ID must be numeric'),
  handleValidationErrors
];

// Pagination validation
export const validatePagination = [
  query('page').optional().isInt({ min: 1 }).toInt().withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

// Search query validation
export const validateSearch = [
  query('q').notEmpty().withMessage('Search query "q" is required'),
  query('q').isLength({ min: 2 }).withMessage('Search query must be at least 2 characters'),
  handleValidationErrors
];