import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineBell, HiOutlineCheck, HiOutlineExclamation } from 'react-icons/hi'
import RiskBadge from '../components/RiskBadge'
import CommunicationHub from '../components/CommunicationHub'
import { mockAlerts, mockStudents } from '../data/mockData'
import toast from 'react-hot-toast'

export default function Alerts() {
  const [alerts, setAlerts] = useState(mockAlerts)
  const [filter, setFilter] = useState('all')
  const [commHubOpen, setCommHubOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)

  const openCommHub = (studentId, tab = 'sms') => {
    const student = mockStudents.find(s => s._id === studentId)
    if (student) {
      setSelectedStudent(student)
      setCommHubOpen(true)
    } else {
      toast.error('Student data not found')
    }
  }

  const filtered = alerts.filter(a => {
    if (filter === 'all') return true
    if (filter === 'unread') return a.status === 'unread'
    if (filter === 'critical') return a.severity === 'critical'
    if (filter === 'high') return a.severity === 'high'
    if (filter === 'pending') return !a.actionTaken
    return true
  })

  const handleMarkRead = (id) => {
    setAlerts(prev => prev.map(a => a._id === id ? { ...a, status: 'read' } : a))
    toast.success('Alert marked as read')
  }

  const handleTakeAction = (id) => {
    setAlerts(prev => prev.map(a => a._id === id ? { ...a, actionTaken: true } : a))
    toast.success('Intervention initiated - Counselor has been notified')
  }

  const unreadCount = alerts.filter(a => a.status === 'unread').length
  const criticalCount = alerts.filter(a => a.severity === 'critical').length

  const typeIcons = {
    dropout_risk: '🚨',
    mental_health: '🧠',
    attendance: '📋',
    academic: '📚',
    lms_activity: '💻',
    hostel: '🏠',
  }

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>
          <span className="gradient-text">Alerts</span> & Interventions
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Monitor early warning signals and manage intervention workflows
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'var(--bg-secondary)', borderRadius: '12px', padding: '18px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Critical Alerts</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#ef4444' }}>{criticalCount}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'var(--bg-secondary)', borderRadius: '12px', padding: '18px',
            border: '1px solid rgba(245, 158, 11, 0.2)',
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Unread</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#f59e0b' }}>{unreadCount}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'var(--bg-secondary)', borderRadius: '12px', padding: '18px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Actions Taken</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#10b981' }}>{alerts.filter(a => a.actionTaken).length}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'var(--bg-secondary)', borderRadius: '12px', padding: '18px',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Total Alerts</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#818cf8' }}>{alerts.length}</div>
        </motion.div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: 'Unread' },
          { key: 'critical', label: 'Critical' },
          { key: 'high', label: 'High Severity' },
          { key: 'pending', label: 'Pending Action' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: `1px solid ${filter === f.key ? 'var(--primary)' : 'var(--border)'}`,
              background: filter === f.key ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-secondary)',
              color: filter === f.key ? 'var(--primary-light)' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map((alert, index) => (
          <motion.div
            key={alert._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={alert.severity === 'critical' && alert.status === 'unread' ? 'pulse-danger' : ''}
            style={{
              background: 'var(--bg-secondary)',
              borderRadius: '14px',
              padding: '20px',
              border: `1px solid ${alert.status === 'unread' ? 'rgba(99, 102, 241, 0.3)' : 'var(--border)'}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Unread Indicator */}
            {alert.status === 'unread' && (
              <div style={{
                position: 'absolute', top: 0, left: 0, bottom: 0, width: '3px',
                background: 'linear-gradient(180deg, #6366f1, #06b6d4)',
              }} />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '20px' }}>{typeIcons[alert.type] || '📌'}</span>
                  <span style={{
                    padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700',
                    textTransform: 'uppercase',
                    background: alert.type === 'dropout_risk' ? 'rgba(239, 68, 68, 0.12)' :
                      alert.type === 'mental_health' ? 'rgba(139, 92, 246, 0.12)' :
                        alert.type === 'attendance' ? 'rgba(245, 158, 11, 0.12)' :
                          'rgba(6, 182, 212, 0.12)',
                    color: alert.type === 'dropout_risk' ? '#f87171' :
                      alert.type === 'mental_health' ? '#a78bfa' :
                        alert.type === 'attendance' ? '#fbbf24' :
                          '#22d3ee',
                  }}>
                    {alert.type.replace(/_/g, ' ')}
                  </span>
                  <RiskBadge level={alert.severity} />
                  {alert.actionTaken && (
                    <span style={{
                      padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
                      background: 'rgba(16, 185, 129, 0.12)', color: '#34d399',
                    }}>
                      ✓ Action Taken
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {alert.studentName}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {alert.message}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  {new Date(alert.timestamp).toLocaleDateString('en-IN', {
                    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {alert.status === 'unread' && (
                  <button
                    onClick={() => handleMarkRead(alert._id)}
                    style={{
                      padding: '8px 14px', borderRadius: '8px',
                      background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)',
                      color: '#818cf8', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}
                  >
                    <HiOutlineCheck size={14} /> Read
                  </button>
                )}
                <button
                  onClick={() => openCommHub(alert.studentId, 'sms')}
                  style={{
                    padding: '8px 12px', borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)',
                    color: '#34d399', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}
                >
                  📱 SMS
                </button>
                <button
                  onClick={() => openCommHub(alert.studentId, 'call')}
                  style={{
                    padding: '8px 12px', borderRadius: '8px',
                    background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)',
                    color: '#818cf8', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}
                >
                  📞 Call
                </button>
                <button
                  onClick={() => openCommHub(alert.studentId, 'support')}
                  style={{
                    padding: '8px 12px', borderRadius: '8px',
                    background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.25)',
                    color: '#22d3ee', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}
                >
                  🤖 AI Support
                </button>
                {!alert.actionTaken && (
                  <button
                    onClick={() => handleTakeAction(alert._id)}
                    style={{
                      padding: '8px 14px', borderRadius: '8px',
                      background: 'linear-gradient(135deg, #6366f1, #06b6d4)', border: 'none',
                      color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}
                  >
                    <HiOutlineExclamation size={14} /> Intervene
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Communication Hub Modal */}
      <CommunicationHub
        student={selectedStudent}
        isOpen={commHubOpen}
        onClose={() => setCommHubOpen(false)}
      />
    </div>
  )
}
