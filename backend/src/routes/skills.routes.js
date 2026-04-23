'use strict';

const router = require('express').Router();
const {
  getSkills,
  createSkillGroup,
  updateSkillGroup,
  deleteSkillGroup,
  reorderSkills,
} = require('../controllers/skills.controller');
const { authenticate } = require('../middleware/auth');

router.get('/', getSkills);
router.post('/', authenticate, createSkillGroup);
router.put('/reorder', authenticate, reorderSkills);
router.put('/:id', authenticate, updateSkillGroup);
router.delete('/:id', authenticate, deleteSkillGroup);

module.exports = router;
