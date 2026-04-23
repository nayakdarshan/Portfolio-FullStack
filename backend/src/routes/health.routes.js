'use strict';

const router = require('express').Router();
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatusMap[dbStatus] || 'unknown',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

module.exports = router;
