'use strict';

const path = require('path');
const Profile = require('../models/Profile');
const fs = require('fs');

/**
 * GET /api/v1/profile
 */
const getProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/profile  [PROTECTED]
 */
const updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile();
    }

    const allowedFields = [
      'name', 'title', 'typewriterTitles', 'bio', 'photoUrl', 'resumeUrl',
      'socials', 'stats', 'seo', 'templateMode', 'themePreset', 'fontPair', 'location',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    await profile.save();
    res.json({ success: true, message: 'Profile updated', data: profile });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/profile/upload-photo  [PROTECTED]
 * Multer handles the file — req.file is populated by upload middleware
 */
const uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const photoUrl = `/uploads/${req.file.filename}`;

    let profile = await Profile.findOne();
    if (!profile) profile = new Profile();
    profile.photoUrl = photoUrl;
    await profile.save();

    res.json({
      success: true,
      message: 'Photo uploaded successfully',
      data: { photoUrl },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, uploadPhoto };
