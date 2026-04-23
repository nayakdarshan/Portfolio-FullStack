'use strict';

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const env = require('../config/env');

const signToken = (payload, expiresIn) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn });

/**
 * POST /api/v1/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find admin with passwordHash field (select: false by default)
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isValid = await admin.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    const payload = { id: admin._id, email: admin.email };
    const token = signToken(payload, env.JWT_EXPIRES_IN);
    const refreshToken = signToken({ ...payload, type: 'refresh' }, env.JWT_REFRESH_EXPIRES_IN);

    res.json({
      success: true,
      data: {
        token,
        refreshToken,
        expiresIn: env.JWT_EXPIRES_IN,
        admin: { id: admin._id, email: admin.email, name: admin.name },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/refresh
 */
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    const decoded = jwt.verify(refreshToken, env.JWT_SECRET);
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Admin not found' });
    }

    const payload = { id: admin._id, email: admin.email };
    const token = signToken(payload, env.JWT_EXPIRES_IN);

    res.json({ success: true, data: { token, expiresIn: env.JWT_EXPIRES_IN } });
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }
    next(error);
  }
};

/**
 * PUT /api/v1/auth/change-password  [PROTECTED]
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin.id).select('+passwordHash');

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    const isValid = await admin.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    admin.passwordHash = newPassword;
    await admin.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/auth/me  [PROTECTED]
 */
const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    res.json({ success: true, data: admin });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, refresh, changePassword, getMe };
