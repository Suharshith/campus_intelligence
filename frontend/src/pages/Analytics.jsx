import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ComposedChart,
} from 'recharts'
import { mockMonthlyTrends, mockDepartmentData, mockStudents } from '../data/mockData'

const attendanceVsRisk = mockStudents.map(s => ({
  name: s.name.split(' ')[0],
  attendance: s.attendance,
  riskScore: s.riskScore,
  gpa: s.gpa,
  lms: s.lmsActivity,
}))

const weeklyData = [
  { day: 'Mon', logins: 2100, submissions: 340, queries: 180 },
  { day: 'Tue', logins: 2350, submissions: 420, queries: 210 },
  { day: 'Wed', logins: 2200, submissions: 380, queries: 195 },
  { day: 'Thu', logins: 2050, submissions: 350, queries: 170 },
  { day: 'Fri', logins: 1800, submissions: 280, queries: 150 },
  { day: 'Sat', logins: 900, submissions: 120, queries: 85 },
  { day: 'Sun', logins: 650, submissions: 80, queries: 60 },
]

const interventionData = [
  { month: 'Aug', counseling: 12, sms: 45, email: 80, resolved: 10 },
  { month: 'Sep', counseling: 18, sms: 52, email: 95, resolved: 15 },
  { month: 'Oct', counseling: 22, sms: 60, email: 110, resolved: 20 },
  { month: 'Nov', counseling: 28, sms: 72, email: 125, resolved: 25 },
  { month: 'Dec', counseling: 25, sms: 65, email: 115, resolved: 22 },
  { month: 'Jan', counseling: 30, sms: 78, email: 140, resolved: 28 },
  { month: 'Feb', counseling: 35, sms: 85, email: 155, resolved: 32 },
  { month: 'Mar', counseling: 38, sms: 90, email: 160, resolved: 35 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null
  return (
    <div style={{
      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
      borderRadius: '10px', padding: '12px 16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    }}>
      <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: '12px', color: p.color, display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span style={{ fontWeight: '600' }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function Analytics() {
  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>
          <span className="gradient-text">Behavioral</span> Analytics
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Deep insights into student behavior patterns and institutional performance metrics
        </p>
      </motion.div>

      {/* AI Insights Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1))',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div style={{ fontSize: '32px' }}>🤖</div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
            AI-Powered Insight
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Analysis indicates a <span style={{ color: '#f87171', fontWeight: '600' }}>15% increase</span> in dropout risk among 2nd-year students in the Engineering departments.
            LMS engagement drops significantly after midterm examinations. Recommended: Increase counselor availability during weeks 8-12.
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Dropout Risk Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'var(--bg-secondary)', borderRadius: '16px', padding: '24px',
            border: '1px solid var(--glass-border)',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Dropout Risk vs Attendance Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={mockMonthlyTrends}>
              <defs>
                <linearGradient id="gradRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="dropoutRisk" name="Dropout Risk %" stroke="#ef4444" fill="url(#gradRisk)" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="avgAttendance" name="Avg Attendance %" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weekly LMS Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'var(--bg-secondary)', borderRadius: '16px', padding: '24px',
            border: '1px solid var(--glass-border)',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Weekly LMS Activity Pattern
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="logins" name="Logins" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="submissions" name="Submissions" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="queries" name="Queries" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Attendance vs Risk Scatter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'var(--bg-secondary)', borderRadius: '16px', padding: '24px',
            border: '1px solid var(--glass-border)',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Attendance vs Risk Score Correlation
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="attendance" name="Attendance" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} label={{ value: 'Attendance %', position: 'insideBottom', offset: -5, style: { fill: 'var(--text-secondary)', fontSize: 11 } }} />
              <YAxis dataKey="riskScore" name="Risk Score" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} label={{ value: 'Risk Score', angle: -90, position: 'insideLeft', style: { fill: 'var(--text-secondary)', fontSize: 11 } }} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter name="Students" data={attendanceVsRisk} fill="#6366f1">
                {attendanceVsRisk.map((entry, index) => (
                  <circle key={index} r={6} fill={entry.riskScore > 70 ? '#ef4444' : entry.riskScore > 40 ? '#f59e0b' : '#10b981'} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Intervention Effectiveness */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: 'var(--bg-secondary)', borderRadius: '16px', padding: '24px',
            border: '1px solid var(--glass-border)',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Intervention Activity & Resolution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={interventionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="counseling" name="Counseling" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="sms" name="SMS Alerts" fill="#06b6d4" radius={[2, 2, 0, 0]} />
              <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Department Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          background: 'var(--bg-secondary)', borderRadius: '16px', padding: '24px',
          border: '1px solid var(--glass-border)',
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
          Department-wise Risk Distribution
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={mockDepartmentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="highRisk" name="High Risk" fill="#ef4444" radius={[0, 0, 0, 0]} stackId="a" />
            <Bar dataKey="mediumRisk" name="Medium Risk" fill="#f59e0b" stackId="a" />
            <Bar dataKey="lowRisk" name="Low Risk" fill="#10b981" stackId="a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
