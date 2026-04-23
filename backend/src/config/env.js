'use strict';

/**
 * Validated environment configuration loader.
 * Throws on startup if a required variable is missing.
 */

const required = (key) => {
  const val = process.env[key];
  if (!val) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return val;
};

const optional = (key, defaultValue = '') => process.env[key] || defaultValue;

module.exports = {
  NODE_ENV: optional('NODE_ENV', 'development'),
  PORT: parseInt(optional('PORT', '3000'), 10),

  // MongoDB
  MONGODB_URI: optional('MONGODB_URI', 'mongodb://localhost:27017/portfolio'),

  // JWT
  JWT_SECRET: optional('JWT_SECRET', 'dev_secret_please_change_in_production'),
  JWT_EXPIRES_IN: optional('JWT_EXPIRES_IN', '7d'),
  JWT_REFRESH_EXPIRES_IN: optional('JWT_REFRESH_EXPIRES_IN', '30d'),

  // CORS
  FRONTEND_URL: optional('FRONTEND_URL', 'http://localhost:4200'),

  // Admin defaults
  ADMIN_EMAIL: optional('ADMIN_EMAIL', 'admin@portfolio.com'),
  ADMIN_PASSWORD: optional('ADMIN_PASSWORD', 'Admin@123'),

  // Nodemailer
  SMTP_HOST: optional('SMTP_HOST', ''),
  SMTP_PORT: parseInt(optional('SMTP_PORT', '587'), 10),
  SMTP_USER: optional('SMTP_USER', ''),
  SMTP_PASS: optional('SMTP_PASS', ''),
  CONTACT_EMAIL_TO: optional('CONTACT_EMAIL_TO', 'nayakdarshan22@gmail.com'),

  // File upload
  MAX_FILE_SIZE_MB: parseInt(optional('MAX_FILE_SIZE_MB', '10'), 10),
  UPLOAD_DIR: optional('UPLOAD_DIR', 'uploads'),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(optional('RATE_LIMIT_WINDOW_MS', '900000'), 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(optional('RATE_LIMIT_MAX_REQUESTS', '100'), 10),
  AUTH_RATE_LIMIT_MAX: parseInt(optional('AUTH_RATE_LIMIT_MAX', '10'), 10),
  CONTACT_RATE_LIMIT_MAX: parseInt(optional('CONTACT_RATE_LIMIT_MAX', '5'), 10),
};
