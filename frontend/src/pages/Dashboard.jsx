import { motion } from 'framer-motion'
import {
  HiOutlineUserGroup,
  HiOutlineExclamation,
  HiOutlineBell,
  HiOutlineAcademicCap,
  HiOutlineTrendingUp,
  HiOutlineHeart,
} from 'react-icons/hi'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar,
} from 'recharts'
import StatCard from '../components/StatCard'
import RiskBadge from '../components/RiskBadge'
import { mockDashboardStats, mockStudents, mockDepartmentData, mockMonthlyTrends, mockAlerts } from '../data/mockData'
import { useNavigate } from 'react-router-dom'

const RISK_COLORS = ['#ef4444', '#f59e0b', '#10b981']

const pieData = [
  { name: 'High Risk', value: mockDashboardStats.highRiskStudents, color: '#ef4444' },
  { name: 'Medium Risk', value: mockDashboardStats.mediumRiskStudents, color: '#f59e0b' },
  { name: 'Low Risk', value: mockDashboardStats.lowRiskStudents, color: '#10b981' },
]

const radialData = [
  { name: 'Attendance', value: 78.5, fill: '#6366f1' },
  { name: 'LMS Activity', value: 67, fill: '#06b6d4' },
  { name: 'Mental Health', value: 62, fill: '#10b981' },
  { name: 'Engagement', value: 71, fill: '#f59e0b' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    }}>
      <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: '12px', color: p.color, display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span style={{ fontWeight: '600' }}>{p.value}{p.name.includes('Risk') ? '%' : ''}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const highRiskStudents = mockStudents.filter(s => s.riskLevel === 'high').sort((a, b) => b.riskScore - a.riskScore)
  const recentAlerts = mockAlerts.slice(0, 4)

  return (
    <div>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '28px' }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>
          <span className="gradient-text">Campus Intelligence</span> Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Real-time overview of student wellbeing, risk analytics, and campus resources
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard
          icon={HiOutlineUserGroup}
          title="Total Students"
          value={mockDashboardStats.totalStudents.toLocaleString()}
          subtitle="Active enrollment"
          color="primary"
          delay={0}
        />
        <StatCard
          icon={HiOutlineExclamation}
          title="High Risk Students"
          value={mockDashboardStats.highRiskStudents}
          subtitle="+12 from last month"
          color="danger"
          trend={1}
          delay={0.1}
        />
        <StatCard
          icon={HiOutlineBell}
          title="Active Alerts"
          value={mockDashboardStats.activeAlerts}
          subtitle="8 unresolved"
          color="warning"
          delay={0.2}
        />
        <StatCard
          icon={HiOutlineAcademicCap}
          title="Avg Attendance"
          value={`${mockDashboardStats.avgAttendance}%`}
          subtitle="-2.3% from last month"
          color="accent"
          trend={-1}
          delay={0.3}
        />
        <StatCard
          icon={HiOutlineTrendingUp}
          title="Dropout Prediction"
          value={`${mockDashboardStats.dropoutPrediction}%`}
          subtitle="5.2% at-risk"
          color="danger"
          delay={0.4}
        />
        <StatCard
          icon={HiOutlineHeart}
          title="Counseling Sessions"
          value={mockDashboardStats.counselingSessions}
          subtitle="This semester"
          color="success"
          delay={0.5}
        />
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'var(--bg-secondary)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid var(--glass-border)',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: 'var(--text-primary)' }}>
            Monthly Trends Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockMonthlyTrends}>
              <defs>
                <linearGradient id="gradAttendance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradMentalHealth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradLMS" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="avgAttendance" name="Attendance" stroke="#6366f1" fill="url(#gradAttendance)" strokeWidth={2} />
              <Area type="monotone" dataKey="mentalHealth" name="Mental Health" stroke="#10b981" fill="url(#gradMentalHealth)" strokeWidth={2} />
              <Area type="monotone" dataKey="lmsActivity" name="LMS Activity" stroke="#06b6d4" fill="url(#gradLMS)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Risk Distribution Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: 'var(--bg-secondary)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid var(--glass-border)',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: 'var(--text-primary)' }}>
            Risk Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {pieData.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Department Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: 'var(--bg-secondary)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid var(--glass-border)',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: 'var(--text-primary)' }}>
            Department Risk Heatmap
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockDepartmentData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} width={105} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="highRisk" name="High Risk" fill="#ef4444" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="mediumRisk" name="Medium Risk" fill="#f59e0b" stackId="a" />
              <Bar dataKey="lowRisk" name="Low Risk" fill="#10b981" stackId="a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Campus Metrics Radial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            background: 'var(--bg-secondary)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid var(--glass-border)',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: 'var(--text-primary)' }}>
            Campus Health Metrics
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="25%" outerRadius="90%" data={radialData} startAngle={180} endAngle={0}>
              <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={8} />
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {radialData.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.fill }} />
                <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Section: High Risk Students + Recent Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* High Risk Students */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{
            background: 'var(--bg-secondary)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid var(--glass-border)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
              🚨 High Risk Students
            </h3>
            <button
              onClick={() => navigate('/students')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-light)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              View All →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {highRiskStudents.map((student) => (
              <div
                key={student._id}
                onClick={() => navigate(`/students/${student._id}`)}
                className="card-hover"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(245, 158, 11, 0.2))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#f87171',
                  }}>
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{student.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{student.department} • {student.rollNo}</div>
                  </div>
                </div>
                <RiskBadge level={student.riskLevel} score={student.riskScore} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            background: 'var(--bg-secondary)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid var(--glass-border)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
              🔔 Recent Alerts
            </h3>
            <button
              onClick={() => navigate('/alerts')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-light)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              View All →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentAlerts.map((alert) => (
              <div
                key={alert._id}
                className={`card-hover ${alert.severity === 'critical' ? 'pulse-danger' : ''}`}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  background: 'var(--bg-primary)',
                  border: `1px solid ${alert.severity === 'critical' ? 'rgba(239, 68, 68, 0.3)' : 'var(--border)'}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      background: alert.type === 'dropout_risk' ? 'rgba(239, 68, 68, 0.15)' :
                        alert.type === 'mental_health' ? 'rgba(139, 92, 246, 0.15)' :
                          alert.type === 'attendance' ? 'rgba(245, 158, 11, 0.15)' :
                            'rgba(6, 182, 212, 0.15)',
                      color: alert.type === 'dropout_risk' ? '#f87171' :
                        alert.type === 'mental_health' ? '#a78bfa' :
                          alert.type === 'attendance' ? '#fbbf24' :
                            '#22d3ee',
                    }}>
                      {alert.type.replace('_', ' ')}
                    </span>
                    <RiskBadge level={alert.severity} />
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {new Date(alert.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {alert.studentName}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {alert.message}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
