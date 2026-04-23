'use strict';

const router = require('express').Router();
const {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} = require('../controllers/education.controller');
const { authenticate } = require('../middleware/auth');

router.get('/', getEducation);
router.post('/', authenticate, createEducation);
router.put('/:id', authenticate, updateEducation);
router.delete('/:id', authenticate, deleteEducation);

module.exports = router;
