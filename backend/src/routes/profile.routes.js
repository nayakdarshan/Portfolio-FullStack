'use strict';

const router = require('express').Router();
const { getProfile, updateProfile, uploadPhoto } = require('../controllers/profile.controller');
const { authenticate } = require('../middleware/auth');
const { imageUpload } = require('../middleware/upload');

router.get('/', getProfile);
router.put('/', authenticate, updateProfile);
router.post('/upload-photo', authenticate, imageUpload.single('photo'), uploadPhoto);

module.exports = router;
