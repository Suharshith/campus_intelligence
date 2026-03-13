const express = require('express');
const router = express.Router();

// GET department analytics
router.get('/departments', (req, res) => {
  res.json({
    departments: [
      { name: 'Computer Science', highRisk: 28, mediumRisk: 45, lowRisk: 312, total: 385 },
      { name: 'Electronics', highRisk: 22, mediumRisk: 38, lowRisk: 280, total: 340 },
      { name: 'Mechanical', highRisk: 18, mediumRisk: 42, lowRisk: 290, total: 350 },
      { name: 'Civil', highRisk: 25, mediumRisk: 35, lowRisk: 265, total: 325 },
      { name: 'IT', highRisk: 15, mediumRisk: 30, lowRisk: 305, total: 350 },
      { name: 'Biotechnology', highRisk: 12, mediumRisk: 28, lowRisk: 210, total: 250 },
      { name: 'Chemical', highRisk: 10, mediumRisk: 35, lowRisk: 205, total: 250 },
      { name: 'Electrical', highRisk: 15, mediumRisk: 67, lowRisk: 118, total: 200 },
    ],
  });
});

// GET monthly trends
router.get('/trends', (req, res) => {
  res.json({
    trends: [
      { month: 'Aug', dropoutRisk: 3.2, avgAttendance: 88, mentalHealth: 75, lmsActivity: 82 },
      { month: 'Sep', dropoutRisk: 3.5, avgAttendance: 85, mentalHealth: 73, lmsActivity: 78 },
      { month: 'Oct', dropoutRisk: 3.8, avgAttendance: 82, mentalHealth: 70, lmsActivity: 75 },
      { month: 'Nov', dropoutRisk: 4.1, avgAttendance: 80, mentalHealth: 68, lmsActivity: 70 },
      { month: 'Dec', dropoutRisk: 4.5, avgAttendance: 76, mentalHealth: 65, lmsActivity: 65 },
      { month: 'Jan', dropoutRisk: 4.8, avgAttendance: 78, mentalHealth: 66, lmsActivity: 68 },
      { month: 'Feb', dropoutRisk: 5.0, avgAttendance: 79, mentalHealth: 64, lmsActivity: 70 },
      { month: 'Mar', dropoutRisk: 5.2, avgAttendance: 78, mentalHealth: 62, lmsActivity: 67 },
    ],
  });
});

// GET resource utilization
router.get('/resources', (req, res) => {
  res.json({
    resources: [
      { id: 'r1', name: 'Counseling Center', type: 'Mental Health', capacity: 10, utilization: 85 },
      { id: 'r2', name: 'Academic Support Lab', type: 'Academic', capacity: 30, utilization: 60 },
      { id: 'r3', name: 'Wellness Center', type: 'Health', capacity: 15, utilization: 45 },
      { id: 'r4', name: 'Peer Tutoring', type: 'Academic', capacity: 20, utilization: 70 },
      { id: 'r5', name: 'Sports Complex', type: 'Recreation', capacity: 100, utilization: 55 },
    ],
  });
});

// GET AI insights
router.get('/insights', (req, res) => {
  res.json({
    insights: [
      {
        type: 'warning',
        title: '2nd Year Engineering Alert',
        message: '15% increase in dropout risk among 2nd-year students. LMS engagement drops significantly after midterms.',
        recommendation: 'Increase counselor availability during weeks 8-12.',
      },
      {
        type: 'info',
        title: 'Positive Trend',
        message: 'Students who attended counseling sessions showed a 25% reduction in risk scores within 4 weeks.',
        recommendation: 'Expand counseling program capacity.',
      },
      {
        type: 'critical',
        title: 'Hostel Attendance',
        message: '8 students showing irregular hostel presence patterns correlating with high dropout risk.',
        recommendation: 'Schedule welfare checks and mentor assignments.',
      },
    ],
  });
});

module.exports = router;
