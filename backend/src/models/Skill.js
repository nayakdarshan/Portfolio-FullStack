'use strict';

const mongoose = require('mongoose');

const skillItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  proficiency: { type: Number, min: 0, max: 100, default: 80 },
  icon: { type: String, default: '' },
});

const skillGroupSchema = new mongoose.Schema(
  {
    group: {
      type: String,
      required: true,
      enum: ['Frontend', 'Backend', 'Testing', 'Tools', 'Cloud'],
    },
    icon: {
      type: String,
      default: '',
    },
    skills: [skillItemSchema],
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

skillGroupSchema.index({ group: 1 }, { unique: true });

module.exports = mongoose.model('Skill', skillGroupSchema);
