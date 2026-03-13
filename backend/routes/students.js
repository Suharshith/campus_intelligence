const express = require('express');
const router = express.Router();

// Mock student data (replace with MongoDB queries in production)
const students = [
  {
    _id: '1', name: 'Aarav Sharma', rollNo: 'CS2024001', department: 'Computer Science',
    year: 2, email: 'aarav.sharma@campus.edu', phone: '+91-9876543210',
    riskScore: 85, riskLevel: 'high', attendance: 42, gpa: 4.8,
    lmsActivity: 15, hostelLog: 'Frequently absent at night', mentalHealthScore: 35,
    lastCounseling: '2026-01-15', alerts: 3,
    trends: [65, 70, 75, 78, 82, 85],
    factors: ['Low attendance', 'Declining grades', 'Reduced LMS activity', 'Irregular hostel presence'],
  },
  {
    _id: '2', name: 'Priya Patel', rollNo: 'EC2024015', department: 'Electronics',
    year: 3, email: 'priya.patel@campus.edu', phone: '+91-9876543211',
    riskScore: 72, riskLevel: 'high', attendance: 55, gpa: 5.5,
    lmsActivity: 28, hostelLog: 'Regular', mentalHealthScore: 42,
    lastCounseling: '2026-02-01', alerts: 2,
    trends: [40, 45, 55, 60, 68, 72],
    factors: ['Declining GPA', 'Low LMS engagement', 'Missed assignments'],
  },
  {
    _id: '3', name: 'Rahul Verma', rollNo: 'ME2024022', department: 'Mechanical',
    year: 1, email: 'rahul.verma@campus.edu', phone: '+91-9876543212',
    riskScore: 45, riskLevel: 'medium', attendance: 72, gpa: 6.8,
    lmsActivity: 55, hostelLog: 'Regular', mentalHealthScore: 60,
    lastCounseling: null, alerts: 1,
    trends: [30, 35, 38, 40, 42, 45],
    factors: ['Moderate attendance decline', 'Some missed deadlines'],
  },
  {
    _id: '4', name: 'Sneha Gupta', rollNo: 'CS2024008', department: 'Computer Science',
    year: 4, email: 'sneha.gupta@campus.edu', phone: '+91-9876543213',
    riskScore: 22, riskLevel: 'low', attendance: 92, gpa: 8.9,
    lmsActivity: 88, hostelLog: 'Regular', mentalHealthScore: 85,
    lastCounseling: null, alerts: 0,
    trends: [20, 22, 21, 23, 22, 22], factors: [],
  },
  {
    _id: '5', name: 'Vikram Singh', rollNo: 'CE2024003', department: 'Civil',
    year: 2, email: 'vikram.singh@campus.edu', phone: '+91-9876543214',
    riskScore: 68, riskLevel: 'high', attendance: 48, gpa: 5.2,
    lmsActivity: 20, hostelLog: 'Frequently late', mentalHealthScore: 38,
    lastCounseling: '2026-02-20', alerts: 2,
    trends: [45, 50, 55, 58, 63, 68],
    factors: ['Very low attendance', 'Low LMS activity', 'Late hostel returns'],
  },
];

// GET all students
router.get('/', (req, res) => {
  const { department, riskLevel, search, sortBy } = req.query;
  let result = [...students];

  if (department) result = result.filter(s => s.department === department);
  if (riskLevel) result = result.filter(s => s.riskLevel === riskLevel);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(s => s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q));
  }
  if (sortBy === 'risk') result.sort((a, b) => b.riskScore - a.riskScore);
  if (sortBy === 'attendance') result.sort((a, b) => a.attendance - b.attendance);
  if (sortBy === 'gpa') result.sort((a, b) => a.gpa - b.gpa);

  res.json({ students: result, total: result.length });
});

// GET student by ID
router.get('/:id', (req, res) => {
  const student = students.find(s => s._id === req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});

// GET high risk students
router.get('/risk/high', (req, res) => {
  const highRisk = students.filter(s => s.riskLevel === 'high').sort((a, b) => b.riskScore - a.riskScore);
  res.json({ students: highRisk, count: highRisk.length });
});

// GET dashboard stats
router.get('/stats/overview', (req, res) => {
  res.json({
    totalStudents: 2450,
    highRiskStudents: students.filter(s => s.riskLevel === 'high').length,
    mediumRiskStudents: students.filter(s => s.riskLevel === 'medium').length,
    lowRiskStudents: students.filter(s => s.riskLevel === 'low').length,
    avgAttendance: (students.reduce((a, b) => a + b.attendance, 0) / students.length).toFixed(1),
    avgGPA: (students.reduce((a, b) => a + b.gpa, 0) / students.length).toFixed(1),
  });
});

module.exports = router;
