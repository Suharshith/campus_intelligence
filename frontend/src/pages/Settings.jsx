import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    highRiskThreshold: 70,
    mediumRiskThreshold: 40,
    attendanceThreshold: 50,
    autoAlert: true,
    openaiKey: '',
    twilioSid: '',
    twilioToken: '',
    twilioPhone: '',
    elevenLabsKey: '',
    mongoUri: '',
  })

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    toast.success('Settings saved successfully!')
  }

  const Section = ({ title, children, icon }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--bg-secondary)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid var(--glass-border)',
        marginBottom: '20px',
      }}
    >
      <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{icon}</span> {title}
      </h3>
      {children}
    </motion.div>
  )

  const Toggle = ({ label, description, checked, onChange }) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 0', borderBottom: '1px solid var(--border)',
    }}>
      <div>
        <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{label}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{description}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: '44px', height: '24px', borderRadius: '12px',
          background: checked ? 'linear-gradient(135deg, #6366f1, #06b6d4)' : 'var(--bg-tertiary)',
          border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s ease',
        }}
      >
        <span style={{
          position: 'absolute', top: '2px', left: checked ? '22px' : '2px',
          width: '20px', height: '20px', borderRadius: '50%',
          background: 'white', transition: 'left 0.3s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }} />
      </button>
    </div>
  )

  const InputField = ({ label, placeholder, value, onChange, type = 'text' }) => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%', padding: '10px 14px', borderRadius: '10px',
          border: '1px solid var(--border)', background: 'var(--bg-primary)',
          color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
        }}
      />
    </div>
  )

  const SliderField = ({ label, value, onChange, min, max, suffix }) => (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{label}</label>
        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-light)' }}>{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{ width: '100%', accentColor: '#6366f1' }}
      />
    </div>
  )

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>
          <span className="gradient-text">Platform</span> Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Configure risk thresholds, notification preferences, and API integrations
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          {/* Notifications */}
          <Section title="Notification Preferences" icon="🔔">
            <Toggle
              label="Email Notifications"
              description="Send email alerts to counselors and faculty"
              checked={settings.emailNotifications}
              onChange={(v) => handleChange('emailNotifications', v)}
            />
            <Toggle
              label="SMS Notifications"
              description="Send SMS via Twilio for critical alerts"
              checked={settings.smsNotifications}
              onChange={(v) => handleChange('smsNotifications', v)}
            />
            <Toggle
              label="Auto-Alert System"
              description="Automatically trigger alerts when thresholds are exceeded"
              checked={settings.autoAlert}
              onChange={(v) => handleChange('autoAlert', v)}
            />
          </Section>

          {/* Risk Thresholds */}
          <Section title="Risk Thresholds" icon="⚠️">
            <SliderField
              label="High Risk Threshold"
              value={settings.highRiskThreshold}
              onChange={(v) => handleChange('highRiskThreshold', v)}
              min={50} max={95} suffix="%"
            />
            <SliderField
              label="Medium Risk Threshold"
              value={settings.mediumRiskThreshold}
              onChange={(v) => handleChange('mediumRiskThreshold', v)}
              min={20} max={70} suffix="%"
            />
            <SliderField
              label="Min Attendance Threshold"
              value={settings.attendanceThreshold}
              onChange={(v) => handleChange('attendanceThreshold', v)}
              min={30} max={80} suffix="%"
            />
          </Section>
        </div>

        <div>
          {/* API Integrations */}
          <Section title="API Integrations" icon="🔑">
            <InputField
              label="OpenAI API Key"
              placeholder="sk-..."
              value={settings.openaiKey}
              onChange={(v) => handleChange('openaiKey', v)}
              type="password"
            />
            <InputField
              label="ElevenLabs API Key"
              placeholder="Enter ElevenLabs key"
              value={settings.elevenLabsKey}
              onChange={(v) => handleChange('elevenLabsKey', v)}
              type="password"
            />
            <InputField
              label="MongoDB Connection URI"
              placeholder="mongodb+srv://..."
              value={settings.mongoUri}
              onChange={(v) => handleChange('mongoUri', v)}
              type="password"
            />
          </Section>

          {/* Twilio */}
          <Section title="Twilio Configuration" icon="📱">
            <InputField
              label="Account SID"
              placeholder="ACxxxxxxxxx"
              value={settings.twilioSid}
              onChange={(v) => handleChange('twilioSid', v)}
            />
            <InputField
              label="Auth Token"
              placeholder="Enter auth token"
              value={settings.twilioToken}
              onChange={(v) => handleChange('twilioToken', v)}
              type="password"
            />
            <InputField
              label="Phone Number"
              placeholder="+1234567890"
              value={settings.twilioPhone}
              onChange={(v) => handleChange('twilioPhone', v)}
            />
          </Section>
        </div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}
      >
        <button
          onClick={handleSave}
          style={{
            padding: '12px 32px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb, #0891b2)',
            border: 'none', color: 'white', fontSize: '14px', fontWeight: '700',
            cursor: 'pointer', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.1)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          💾 Save Settings
        </button>
      </motion.div>
    </div>
  )
}
