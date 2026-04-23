'use strict';

const router = require('express').Router();
const { body } = require('express-validator');
const {
  submitContact,
  getMessages,
  markAsRead,
  deleteMessage,
  getUnreadCount,
} = require('../controllers/contact.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { contactLimiter } = require('../middleware/rateLimiter');

// Public: submit contact form
router.post(
  '/',
  contactLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 200 }),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ max: 2000 })
      .withMessage('Message cannot exceed 2000 characters'),
  ],
  validate,
  submitContact
);

// Protected: admin message management
router.get('/messages', authenticate, getMessages);
router.get('/messages/unread-count', authenticate, getUnreadCount);
router.put('/messages/:id/read', authenticate, markAsRead);
router.delete('/messages/:id', authenticate, deleteMessage);

module.exports = router;
