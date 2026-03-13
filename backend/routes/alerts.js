const express = require('express');
const router = express.Router();

const alerts = [
  {
    _id: 'a1', studentId: '1', studentName: 'Aarav Sharma', type: 'dropout_risk',
    severity: 'critical', message: 'Risk score exceeded 80%. Immediate counselor intervention recommended.',
    timestamp: new Date('2026-03-13T05:30:00Z'), status: 'unread', actionTaken: false,
  },
  {
    _id: 'a2', studentId: '9', studentName: 'Arjun Kumar', type: 'mental_health',
    severity: 'critical', message: 'Mental health score dropped below 35. Student shows signs of severe stress.',
    timestamp: new Date('2026-03-12T14:00:00Z'), status: 'read', actionTaken: false,
  },
  {
    _id: 'a3', studentId: '5', studentName: 'Vikram Singh', type: 'attendance',
    severity: 'high', message: 'Attendance dropped below 50% threshold.',
    timestamp: new Date('2026-03-12T09:00:00Z'), status: 'read', actionTaken: true,
  },
  {
    _id: 'a4', studentId: '2', studentName: 'Priya Patel', type: 'academic',
    severity: 'high', message: 'GPA declined by 2 points in the last semester.',
    timestamp: new Date('2026-03-11T16:30:00Z'), status: 'read', actionTaken: true,
  },
];

// GET all alerts
router.get('/', (req, res) => {
  const { severity, status, type } = req.query;
  let result = [...alerts];
  if (severity) result = result.filter(a => a.severity === severity);
  if (status) result = result.filter(a => a.status === status);
  if (type) result = result.filter(a => a.type === type);
  result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json({ alerts: result, total: result.length, unread: result.filter(a => a.status === 'unread').length });
});

// GET alerts by student
router.get('/student/:studentId', (req, res) => {
  const studentAlerts = alerts.filter(a => a.studentId === req.params.studentId);
  res.json({ alerts: studentAlerts });
});

// PATCH mark alert as read
router.patch('/:id/read', (req, res) => {
  const alert = alerts.find(a => a._id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  alert.status = 'read';
  res.json({ message: 'Alert marked as read', alert });
});

// PATCH take action on alert
router.patch('/:id/action', (req, res) => {
  const alert = alerts.find(a => a._id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  alert.actionTaken = true;
  res.json({ message: 'Action taken on alert', alert });
});

module.exports = router;
