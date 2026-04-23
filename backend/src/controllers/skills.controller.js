'use strict';

const Skill = require('../models/Skill');

/** GET /api/v1/skills */
const getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ order: 1 });
    res.json({ success: true, data: skills });
  } catch (error) {
    next(error);
  }
};

/** POST /api/v1/skills  [PROTECTED] */
const createSkillGroup = async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({ success: true, message: 'Skill group created', data: skill });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/v1/skills/:id  [PROTECTED] */
const updateSkillGroup = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!skill) return res.status(404).json({ success: false, message: 'Skill group not found' });
    res.json({ success: true, message: 'Skill group updated', data: skill });
  } catch (error) {
    next(error);
  }
};

/** DELETE /api/v1/skills/:id  [PROTECTED] */
const deleteSkillGroup = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill group not found' });
    res.json({ success: true, message: 'Skill group deleted' });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/v1/skills/reorder  [PROTECTED] — bulk update order */
const reorderSkills = async (req, res, next) => {
  try {
    const { order } = req.body; // [{ id, order }]
    const ops = order.map(({ id, order: ord }) =>
      Skill.findByIdAndUpdate(id, { order: ord })
    );
    await Promise.all(ops);
    res.json({ success: true, message: 'Skills reordered' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSkills, createSkillGroup, updateSkillGroup, deleteSkillGroup, reorderSkills };
