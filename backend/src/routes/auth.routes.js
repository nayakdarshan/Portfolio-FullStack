'use strict';

const router = require('express').Router();
const { body } = require('express-validator');
const { login, refresh, changePassword, getMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  validate,
  login
);

router.post(
  '/refresh',
  authLimiter,
  [body('refreshToken').notEmpty().withMessage('Refresh token required')],
  validate,
  refresh
);

router.put(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters')
      .matches(/^(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter and one number'),
  ],
  validate,
  changePassword
);

router.get('/me', authenticate, getMe);

module.exports = router;
