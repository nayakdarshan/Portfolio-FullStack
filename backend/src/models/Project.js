'use strict';

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
    },
    company: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    longDescription: {
      type: String,
      default: '',
    },
    techStack: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    links: {
      live: { type: String, default: '' },
      github: { type: String, default: '' },
      demo: { type: String, default: '' },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      default: 'Web Application',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

projectSchema.index({ order: 1 });
projectSchema.index({ featured: -1 });

module.exports = mongoose.model('Project', projectSchema);
