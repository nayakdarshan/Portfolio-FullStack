'use strict';

const path = require('path');
const fs = require('fs');
const env = require('../config/env');

/**
 * GET /api/v1/resume/download
 * Streams the resume PDF file to the client.
 */
const downloadResume = (req, res, next) => {
  try {
    const resumePath = path.join(__dirname, '..', '..', env.UPLOAD_DIR, 'resume.pdf');

    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found. Please upload a resume PDF via the admin panel.',
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Darshan_Nayak_Resume.pdf"');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    const fileStream = fs.createReadStream(resumePath);
    fileStream.pipe(res);
    fileStream.on('error', (err) => next(err));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/resume/upload  [PROTECTED]
 * Handles resume PDF upload (replaces existing).
 */
const uploadResume = (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Rename uploaded file to resume.pdf
    const uploadDir = path.join(__dirname, '..', '..', env.UPLOAD_DIR);
    const targetPath = path.join(uploadDir, 'resume.pdf');
    const uploadedPath = req.file.path;

    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }
    fs.renameSync(uploadedPath, targetPath);

    res.json({ success: true, message: 'Resume uploaded successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { downloadResume, uploadResume };
