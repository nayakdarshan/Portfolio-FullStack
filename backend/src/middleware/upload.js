'use strict';

const multer = require('multer');
const path = require('path');
const env = require('../config/env');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', env.UPLOAD_DIR));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`), false);
  }
};

const maxSize = env.MAX_FILE_SIZE_MB * 1024 * 1024;

/** Image upload (jpg, png, webp, gif) */
const imageUpload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter: fileFilter(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
});

/** PDF upload (resume) */
const pdfUpload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter: fileFilter(['application/pdf']),
});

module.exports = { imageUpload, pdfUpload };
