export default function RiskBadge({ level, score }) {
  const config = {
    high: { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'rgba(239, 68, 68, 0.3)', label: 'High Risk' },
    medium: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)', label: 'Medium Risk' },
    low: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)', label: 'Low Risk' },
    critical: { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.4)', label: 'Critical' },
  }

  const c = config[level] || config.low

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 12px',
      borderRadius: '20px',
      background: c.bg,
      border: `1px solid ${c.border}`,
      fontSize: '12px',
      fontWeight: '600',
      color: c.color,
    }}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: c.color,
      }} />
      {score !== undefined ? `${score}%` : c.label}
    </span>
  )
}
