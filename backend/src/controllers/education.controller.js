'use strict';

const Education = require('../models/Education');

/** GET /api/v1/education */
const getEducation = async (req, res, next) => {
  try {
    const education = await Education.find().sort({ order: 1 });
    res.json({ success: true, data: education });
  } catch (error) {
    next(error);
  }
};

/** POST /api/v1/education  [PROTECTED] */
const createEducation = async (req, res, next) => {
  try {
    const edu = await Education.create(req.body);
    res.status(201).json({ success: true, message: 'Education entry created', data: edu });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/v1/education/:id  [PROTECTED] */
const updateEducation = async (req, res, next) => {
  try {
    const edu = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!edu) return res.status(404).json({ success: false, message: 'Education entry not found' });
    res.json({ success: true, message: 'Education updated', data: edu });
  } catch (error) {
    next(error);
  }
};

/** DELETE /api/v1/education/:id  [PROTECTED] */
const deleteEducation = async (req, res, next) => {
  try {
    const edu = await Education.findByIdAndDelete(req.params.id);
    if (!edu) return res.status(404).json({ success: false, message: 'Education entry not found' });
    res.json({ success: true, message: 'Education deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getEducation, createEducation, updateEducation, deleteEducation };
