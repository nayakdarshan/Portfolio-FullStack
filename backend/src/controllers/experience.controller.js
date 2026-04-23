'use strict';

const Experience = require('../models/Experience');

/** GET /api/v1/experience */
const getExperience = async (req, res, next) => {
  try {
    const experience = await Experience.find().sort({ order: 1 });
    res.json({ success: true, data: experience });
  } catch (error) {
    next(error);
  }
};

/** POST /api/v1/experience  [PROTECTED] */
const createExperience = async (req, res, next) => {
  try {
    const exp = await Experience.create(req.body);
    res.status(201).json({ success: true, message: 'Experience entry created', data: exp });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/v1/experience/:id  [PROTECTED] */
const updateExperience = async (req, res, next) => {
  try {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!exp) return res.status(404).json({ success: false, message: 'Experience not found' });
    res.json({ success: true, message: 'Experience updated', data: exp });
  } catch (error) {
    next(error);
  }
};

/** DELETE /api/v1/experience/:id  [PROTECTED] */
const deleteExperience = async (req, res, next) => {
  try {
    const exp = await Experience.findByIdAndDelete(req.params.id);
    if (!exp) return res.status(404).json({ success: false, message: 'Experience not found' });
    res.json({ success: true, message: 'Experience deleted' });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/v1/experience/reorder  [PROTECTED] */
const reorderExperience = async (req, res, next) => {
  try {
    const { order } = req.body;
    const ops = order.map(({ id, order: ord }) =>
      Experience.findByIdAndUpdate(id, { order: ord })
    );
    await Promise.all(ops);
    res.json({ success: true, message: 'Experience reordered' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getExperience, createExperience, updateExperience, deleteExperience, reorderExperience };
