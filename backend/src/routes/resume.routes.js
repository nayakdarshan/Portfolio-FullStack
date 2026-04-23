'use strict';

const router = require('express').Router();
const { downloadResume, uploadResume } = require('../controllers/resume.controller');
const { authenticate } = require('../middleware/auth');
const { pdfUpload } = require('../middleware/upload');

router.get('/download', downloadResume);
router.post('/upload', authenticate, pdfUpload.single('resume'), uploadResume);

module.exports = router;
