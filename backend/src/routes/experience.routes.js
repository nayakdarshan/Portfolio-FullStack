'use strict';

const router = require('express').Router();
const {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperience,
} = require('../controllers/experience.controller');
const { authenticate } = require('../middleware/auth');

router.get('/', getExperience);
router.post('/', authenticate, createExperience);
router.put('/reorder', authenticate, reorderExperience);
router.put('/:id', authenticate, updateExperience);
router.delete('/:id', authenticate, deleteExperience);

module.exports = router;
