import { motion } from 'framer-motion'
import { mockResources } from '../data/mockData'

export default function Resources() {
  const getStatusColor = (status) => {
    switch (status) {
      case 'high': return { bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.3)', text: '#f87171', label: 'High Usage' }
      case 'medium': return { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)', text: '#fbbf24', label: 'Moderate' }
      case 'low': return { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)', text: '#34d399', label: 'Available' }
      default: return { bg: 'var(--bg-tertiary)', border: 'var(--border)', text: 'var(--text-secondary)', label: 'Unknown' }
    }
  }

  const typeIcons = {
    'Mental Health': '🧠',
    'Academic': '📚',
    'Health': '🏥',
    'Recreation': '⚽',
    'Career': '🎯',
  }

  const totalCapacity = mockResources.reduce((a, b) => a + b.capacity, 0)
  const totalAvailable = mockResources.reduce((a, b) => a + b.available, 0)
  const avgUtilization = Math.round(mockResources.reduce((a, b) => a + b.utilization, 0) / mockResources.length)

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>
          <span className="gradient-text">Campus</span> Resources
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Monitor and optimize campus resource allocation and utilization
        </p>
      </motion.div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'var(--bg-secondary)', borderRadius: '12px', padding: '20px',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Total Capacity</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#818cf8' }}>{totalCapacity}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Across {mockResources.length} facilities</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'var(--bg-secondary)', borderRadius: '12px', padding: '20px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Available Slots</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#34d399' }}>{totalAvailable}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Open for booking</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'var(--bg-secondary)', borderRadius: '12px', padding: '20px',
            border: '1px solid rgba(245, 158, 11, 0.2)',
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Avg Utilization</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#fbbf24' }}>{avgUtilization}%</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Campus-wide average</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'var(--bg-secondary)', borderRadius: '12px', padding: '20px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Near Capacity</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#f87171' }}>
            {mockResources.filter(r => r.utilization > 80).length}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Facilities above 80%</div>
        </motion.div>
      </div>

      {/* Resources Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
        {mockResources.map((resource, index) => {
          const sc = getStatusColor(resource.status)
          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card-hover"
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '24px',
                border: `1px solid ${sc.border}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: sc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px',
                  }}>
                    {typeIcons[resource.type] || '📌'}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{resource.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{resource.type}</div>
                  </div>
                </div>
                <span style={{
                  padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600',
                  background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
                }}>
                  {sc.label}
                </span>
              </div>

              {/* Utilization Bar */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Utilization</span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: sc.text }}>{resource.utilization}%</span>
                </div>
                <div style={{
                  width: '100%', height: '8px', borderRadius: '4px',
                  background: 'var(--bg-primary)', overflow: 'hidden',
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${resource.utilization}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    style={{
                      height: '100%', borderRadius: '4px',
                      background: resource.utilization > 80
                        ? 'linear-gradient(90deg, #ef4444, #f97316)'
                        : resource.utilization > 60
                          ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                          : 'linear-gradient(90deg, #10b981, #06b6d4)',
                    }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Capacity</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>{resource.capacity}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Available</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#34d399' }}>{resource.available}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>In Use</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#818cf8' }}>{resource.capacity - resource.available}</div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
