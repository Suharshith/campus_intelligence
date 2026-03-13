const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const studentRoutes = require('./routes/students');
const alertRoutes = require('./routes/alerts');
const analyticsRoutes = require('./routes/analytics');
const notificationRoutes = require('./routes/notifications');

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Campus Intelligence Platform - Backend',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Campus Intelligence Backend running on port ${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health: http://localhost:${PORT}/api/health`);
});
