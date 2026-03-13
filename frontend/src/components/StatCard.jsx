import { motion } from 'framer-motion'

export default function StatCard({ icon: Icon, title, value, subtitle, color, trend, delay = 0 }) {
  const colorMap = {
    primary: { bg: 'rgba(99, 102, 241, 0.12)', border: 'rgba(99, 102, 241, 0.3)', text: '#818cf8', gradient: 'linear-gradient(135deg, #6366f1, #818cf8)' },
    danger: { bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.3)', text: '#f87171', gradient: 'linear-gradient(135deg, #ef4444, #f97316)' },
    warning: { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)', text: '#fbbf24', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
    success: { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)', text: '#34d399', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)' },
    accent: { bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.3)', text: '#22d3ee', gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)' },
  }

  const c = colorMap[color] || colorMap.primary

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="card-hover"
      style={{
        background: 'var(--bg-secondary)',
        borderRadius: '16px',
        padding: '24px',
        border: `1px solid ${c.border}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gradient Accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: c.gradient,
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '8px' }}>
            {title}
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1' }}>
            {value}
          </div>
          {subtitle && (
            <div style={{ fontSize: '12px', color: c.text, fontWeight: '600', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {trend && (
                <span style={{ fontSize: '14px' }}>{trend > 0 ? '↑' : '↓'}</span>
              )}
              {subtitle}
            </div>
          )}
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: c.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {Icon && <Icon size={24} style={{ color: c.text }} />}
        </div>
      </div>
    </motion.div>
  )
}
