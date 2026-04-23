'use strict';

const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const createLimiter = (max, message) =>
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message },
    skipSuccessfulRequests: false,
  });

/** General API limiter — 100 req / 15 min */
const generalLimiter = createLimiter(
  env.RATE_LIMIT_MAX_REQUESTS,
  'Too many requests. Please try again later.'
);

/** Auth routes — 10 req / 15 min */
const authLimiter = createLimiter(
  env.AUTH_RATE_LIMIT_MAX,
  'Too many login attempts. Please try again later.'
);

/** Contact form — 5 req / 15 min */
const contactLimiter = createLimiter(
  env.CONTACT_RATE_LIMIT_MAX,
  'Too many contact requests. Please try again later.'
);

module.exports = { generalLimiter, authLimiter, contactLimiter };
