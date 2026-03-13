import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineArrowLeft, HiOutlineMail, HiOutlinePhone, HiOutlineBell, HiOutlineChatAlt2, HiOutlineVolumeUp } from 'react-icons/hi'
import {
  LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import RiskBadge from '../components/RiskBadge'
import CommunicationHub from '../components/CommunicationHub'
import { mockStudents, mockAlerts } from '../data/mockData'
import toast from 'react-hot-toast'

export default function StudentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const student = mockStudents.find(s => s._id === id)
  const [commHubOpen, setCommHubOpen] = useState(false)
  const [commHubTab, setCommHubTab] = useState('sms')

  if (!student) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Student Not Found</h2>
        <p style={{ color: 'var(--text-secondary)' }}>The student you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/students')} style={{
          marginTop: '20px', padding: '10px 24px', borderRadius: '10px',
          background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '600',
        }}>← Back to Students</button>
      </div>
    )
  }

  const studentAlerts = mockAlerts.filter(a => a.studentId === id)
  const trendData = student.trends.map((v, i) => ({
    week: `W${i + 1}`,
    riskScore: v,
  }))

  const radarData = [
    { subject: 'Attendance', value: student.attendance, fullMark: 100 },
    { subject: 'Academics', value: student.gpa * 10, fullMark: 100 },
    { subject: 'LMS Activity', value: student.lmsActivity, fullMark: 100 },
    { subject: 'Mental Health', value: student.mentalHealthScore, fullMark: 100 },
    { subject: 'Engagement', value: Math.max(20, 100 - student.riskScore), fullMark: 100 },
  ]

  const openCommHub = (tab = 'sms') => {
    setCommHubTab(tab)
    setCommHubOpen(true)
  }

  return (
    <div>
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/students')}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'none', border: 'none', color: 'var(--text-secondary)',
          fontSize: '14px', cursor: 'pointer', marginBottom: '20px', fontWeight: '500',
        }}
      >
        <HiOutlineArrowLeft size={18} /> Back to Students
      </motion.button>

      {/* Student Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--bg-secondary)',
          borderRadius: '16px',
          padding: '28px',
          border: '1px solid var(--glass-border)',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '16px',
              background: student.riskLevel === 'high'
                ? 'linear-gradient(135deg, #ef4444, #f97316)'
                : student.riskLevel === 'medium'
                  ? 'linear-gradient(135deg, #f59e0b, #fbbf24)'
                  : 'linear-gradient(135deg, #10b981, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', fontWeight: '800', color: 'white',
            }}>
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {student.name}
              </h1>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {student.rollNo} • {student.department} • Year {student.year}
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <RiskBadge level={student.riskLevel} score={student.riskScore} />
                {student.alerts > 0 && (
                  <span style={{
                    padding: '4px 10px', borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.12)', color: '#f87171',
                    fontSize: '12px', fontWeight: '600',
                  }}>
                    {student.alerts} active alert{student.alerts > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => openCommHub('sms')} style={{
              padding: '10px 18px', borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.1))',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              📱 SMS Alert
            </button>
            <button onClick={() => openCommHub('call')} style={{
              padding: '10px 18px', borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(129, 140, 248, 0.1))',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#818cf8', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              📞 Call
            </button>
            <button onClick={() => openCommHub('voice')} style={{
              padding: '10px 18px', borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(239, 68, 68, 0.08))',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#fbbf24', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              🎙️ AI Voice
            </button>
            <button onClick={() => openCommHub('support')} style={{
              padding: '10px 18px', borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(99, 102, 241, 0.08))',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              color: '#22d3ee', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              🤖 AI Support
            </button>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Risk Score', value: `${student.riskScore}%`, color: student.riskScore > 70 ? '#ef4444' : student.riskScore > 40 ? '#f59e0b' : '#10b981' },
          { label: 'Attendance', value: `${student.attendance}%`, color: student.attendance < 50 ? '#ef4444' : student.attendance < 75 ? '#f59e0b' : '#10b981' },
          { label: 'GPA', value: student.gpa.toFixed(1), color: student.gpa < 5 ? '#ef4444' : student.gpa < 7 ? '#f59e0b' : '#10b981' },
          { label: 'LMS Activity', value: `${student.lmsActivity}%`, color: student.lmsActivity < 30 ? '#ef4444' : student.lmsActivity < 60 ? '#f59e0b' : '#10b981' },
          { label: 'Mental Health', value: `${student.mentalHealthScore}%`, color: student.mentalHealthScore < 40 ? '#ef4444' : student.mentalHealthScore < 60 ? '#f59e0b' : '#10b981' },
        ].map((metric) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'var(--bg-secondary)',
              borderRadius: '12px',
              padding: '18px',
              border: '1px solid var(--border)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '500' }}>{metric.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: metric.color }}>{metric.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Risk Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'var(--bg-secondary)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid var(--glass-border)',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Risk Score Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="riskScore" stroke="#ef4444" fill="url(#riskGrad)" strokeWidth={2.5} dot={{ fill: '#ef4444', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radar Chart */}
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
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Student Profile Analysis
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
              <Radar name="Score" dataKey="value" stroke="#6366f1" fill="rgba(99, 102, 241, 0.25)" strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Risk Factors & Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Risk Factors */}
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
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
            ⚠️ Identified Risk Factors
          </h3>
          {student.factors.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {student.factors.map((factor, i) => (
                <div key={i} style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.06)',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <span style={{ color: '#f87171', fontSize: '16px' }}>●</span>
                  {factor}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
              ✅ No significant risk factors identified
            </div>
          )}
        </motion.div>

        {/* Student Alerts */}
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
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
            🔔 Alert History
          </h3>
          {studentAlerts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {studentAlerts.map((alert) => (
                <div key={alert._id} style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <RiskBadge level={alert.severity} />
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {new Date(alert.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.4' }}>{alert.message}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
              No alerts for this student
            </div>
          )}
        </motion.div>
      </div>

      {/* Communication Hub Modal */}
      <CommunicationHub
        student={student}
        isOpen={commHubOpen}
        onClose={() => setCommHubOpen(false)}
      />
    </div>
  )
}
