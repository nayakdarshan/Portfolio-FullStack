'use strict';

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Darshan Nayak',
    },
    title: {
      type: String,
      required: true,
      default: 'Software Engineer 2',
    },
    typewriterTitles: {
      type: [String],
      default: ['Angular Developer', 'Frontend Architect', 'Full-Stack Engineer'],
    },
    bio: {
      type: String,
      required: true,
      default: '',
    },
    photoUrl: {
      type: String,
      default: '',
    },
    location: {
      lat: { type: Number, default: 12.9716 },
      lng: { type: Number, default: 77.5946 },
      city: { type: String, default: 'Bengaluru' },
      country: { type: String, default: 'India' },
    },
    resumeUrl: {
      type: String,
      default: '/api/v1/resume/download',
    },
    socials: {
      linkedin: { type: String, default: 'https://bit.ly/darshanlinkedin' },
      email: { type: String, default: 'nayakdarshan22@gmail.com' },
      phone: { type: String, default: '' },
      github: { type: String, default: '' },
    },
    stats: {
      yearsExperience: { type: Number, default: 4 },
      projectsCount: { type: Number, default: 5 },
      companiesCount: { type: Number, default: 3 },
      expertise: { type: String, default: 'Angular Expert' },
    },
    seo: {
      metaTitle: { type: String, default: 'Darshan Nayak | Software Engineer 2' },
      metaDescription: {
        type: String,
        default:
          'Portfolio of Darshan Nayak — Software Engineer 2 specializing in Angular, React, Vue.js and full-stack development with 4+ years of experience.',
      },
      keywords: {
        type: [String],
        default: [
          'Darshan Nayak',
          'Software Engineer',
          'Angular Developer',
          'Frontend Architect',
          'Full-Stack Engineer',
          'React',
          'Vue.js',
          'TypeScript',
        ],
      },
    },
    // Template/Setup wizard mode
    templateMode: {
      type: Boolean,
      default: false,
    },
    themePreset: {
      type: String,
      enum: ['midnight-blue', 'forest-green', 'crimson', 'golden-hour', 'monochrome'],
      default: 'midnight-blue',
    },
    fontPair: {
      type: String,
      enum: ['modern-sans', 'editorial-serif', 'technical-mono'],
      default: 'modern-sans',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
