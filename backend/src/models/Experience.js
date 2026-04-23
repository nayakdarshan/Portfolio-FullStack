'use strict';

const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
    },
    companyUrl: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
    },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'intern', 'freelance', 'contract'],
      default: 'full-time',
    },
    startDate: {
      type: String,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: String,
      default: '',
    },
    current: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      default: '',
    },
    bullets: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

experienceSchema.index({ order: 1 });

module.exports = mongoose.model('Experience', experienceSchema);
