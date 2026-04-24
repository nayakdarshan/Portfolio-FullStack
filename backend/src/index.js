'use strict';

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');
const env = require('./config/env');

// Route imports
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const skillsRoutes = require('./routes/skills.routes');
const experienceRoutes = require('./routes/experience.routes');
const projectsRoutes = require('./routes/projects.routes');
const educationRoutes = require('./routes/education.routes');
const contactRoutes = require('./routes/contact.routes');
const resumeRoutes = require('./routes/resume.routes');

const app = express();

// ── Security Headers ──────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
);

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  env.FRONTEND_URL,
  'http://localhost:4200',
  'http://localhost:3000',
  // Explicit production frontend (fallback if FRONTEND_URL not set)
  'https://portfolio-frontend-a69k.onrender.com',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, mobile apps, etc.)
      if (!origin) return callback(null, true);
      // Allow any localhost port (Angular dev server uses random ports)
      if (origin.startsWith('http://localhost:')) return callback(null, true);
      // Allow any onrender.com subdomain (covers all Render-hosted frontends)
      if (origin.endsWith('.onrender.com')) return callback(null, true);
      // Allow explicitly whitelisted origins
      if (allowedOrigins.includes(origin)) return callback(null, true);

      callback(new Error(`CORS policy violation: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Request Logging ───────────────────────────────────────────────────────────
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Static File Serving (uploads) ─────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', env.UPLOAD_DIR)));

// ── API Routes ────────────────────────────────────────────────────────────────
const API_V1 = '/api/v1';

app.use(`${API_V1}/health`, healthRoutes);
app.use(`${API_V1}/auth`, authRoutes);
app.use(`${API_V1}/profile`, profileRoutes);
app.use(`${API_V1}/skills`, skillsRoutes);
app.use(`${API_V1}/experience`, experienceRoutes);
app.use(`${API_V1}/projects`, projectsRoutes);
app.use(`${API_V1}/education`, educationRoutes);
app.use(`${API_V1}/contact`, contactRoutes);
app.use(`${API_V1}/resume`, resumeRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack || err.message);

  const status = err.status || err.statusCode || 500;
  const message =
    env.NODE_ENV === 'production' && status === 500
      ? 'Internal server error'
      : err.message || 'Internal server error';

  res.status(status).json({ success: false, message });
});

// ── Bootstrap ─────────────────────────────────────────────────────────────────
const start = async () => {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`\n🚀 Portfolio API running on http://localhost:${env.PORT}${API_V1}`);
      console.log(`   Environment : ${env.NODE_ENV}`);
      console.log(`   Health check: http://localhost:${env.PORT}${API_V1}/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

start();

module.exports = app;
