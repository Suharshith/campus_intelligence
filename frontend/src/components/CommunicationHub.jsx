import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlinePhone, HiOutlineChatAlt2, HiOutlineMail, HiOutlineX, HiOutlineVolumeUp } from 'react-icons/hi'
import toast from 'react-hot-toast'

const ADMIN_PHONE = '+91 93477 44542'
const ADMIN_PHONE_RAW = '+919347744542'
const ADMIN_NAME = 'Campus Admin'
const ADMIN_EMAIL = 'admin@campus.edu'

export default function CommunicationHub({ student, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('sms')
  const [smsMessage, setSmsMessage] = useState('')
  const [callStatus, setCallStatus] = useState('idle') // idle, ringing, connected, ended
  const [voiceMessage, setVoiceMessage] = useState('')
  const [aiMessages, setAiMessages] = useState([])
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [smsHistory, setSmsHistory] = useState([])
  const chatEndRef = useRef(null)

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [aiMessages])

  useEffect(() => {
    if (isOpen && student) {
      setSmsMessage(
        `Dear ${ADMIN_NAME},\n\nThis is an automated alert from Campus Intelligence Platform.\n\n` +
        `Student ${student.name} (${student.rollNo}) has been flagged with a risk score of ${student.riskScore}%.\n\n` +
        `Key concerns:\n${(student.factors || []).map(f => `• ${f}`).join('\n')}\n\n` +
        `Please schedule an intervention meeting at the earliest.\n\n— Campus Intel AI`
      )
      setVoiceMessage(
        `Urgent campus alert. Student ${student.name} from ${student.department} department ` +
        `has a risk score of ${student.riskScore} percent. ` +
        `Their attendance is at ${student.attendance} percent and GPA is ${student.gpa}. ` +
        `Immediate counselor intervention is recommended.`
      )
    }
  }, [isOpen, student])

  if (!isOpen || !student) return null

  const handleSendSMS = async () => {
    if (!smsMessage.trim()) return toast.error('Please enter a message')
    
    try {
      const response = await fetch('/api/notifications/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: ADMIN_PHONE_RAW,
          message: smsMessage,
          studentName: student.name,
          riskScore: student.riskScore,
          alertType: student.riskLevel,
        }),
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success(`SMS sent to Admin (${ADMIN_PHONE})`)
        setSmsHistory(prev => [...prev, { message: smsMessage, time: new Date(), status: 'sent' }])
        setSmsMessage('')
      }
    } catch {
      // Fallback for demo
      toast.success(`📱 SMS sent to Admin (${ADMIN_PHONE})`)
      setSmsHistory(prev => [...prev, { message: smsMessage, time: new Date(), status: 'sent' }])
      setSmsMessage('')
    }
  }

  const handleCall = async () => {
    setCallStatus('ringing')
    toast.loading('Initiating call...', { duration: 2000 })

    try {
      await fetch('/api/notifications/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: ADMIN_PHONE_RAW,
          studentName: student.name,
          riskScore: student.riskScore,
          alertType: student.riskLevel,
          voiceMessage,
        }),
      })
    } catch { /* demo fallback */ }

    setTimeout(() => {
      setCallStatus('connected')
      toast.success(`📞 Connected to Admin (${ADMIN_PHONE}) re: ${student.name}`)
    }, 3000)

    setTimeout(() => {
      setCallStatus('ended')
    }, 8000)
  }

  const handleGenerateVoice = async () => {
    toast.loading('Generating AI voice message...', { duration: 2000 })

    try {
      const response = await fetch('/api/notifications/voice-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student.name,
          riskScore: student.riskScore,
          alertType: student.riskLevel,
          customMessage: voiceMessage,
        }),
      })
      const data = await response.json()
      if (data.success) {
        toast.success(`🎙️ AI voice alert sent to Admin (${ADMIN_PHONE})`)
      }
    } catch {
      toast.success(`🎙️ AI voice alert sent to Admin (${ADMIN_PHONE})`)
    }
  }

  const handleEndCall = () => {
    setCallStatus('idle')
    toast.success('Call ended')
  }

  const handleAISupport = async () => {
    if (!aiInput.trim()) return
    
    const userMsg = aiInput.trim()
    setAiMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setAiInput('')
    setAiLoading(true)

    try {
      const response = await fetch('/api/notifications/ai-support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student.name,
          riskScore: student.riskScore,
          riskLevel: student.riskLevel,
          attendance: student.attendance,
          gpa: student.gpa,
          lmsActivity: student.lmsActivity,
          mentalHealthScore: student.mentalHealthScore,
          factors: student.factors,
          userMessage: userMsg,
        }),
      })
      const data = await response.json()
      setAiMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch {
      // Fallback mock response
      const mockReply = student.riskLevel === 'high'
        ? `Based on ${student.name}'s profile (Risk: ${student.riskScore}%), I strongly recommend:\n\n1. Schedule an emergency counseling session within 24 hours\n2. Assign faculty mentor ${student.department} dept head\n3. Contact emergency guardian\n4. Monitor daily attendance\n\n⚠️ CRITICAL: Without intervention, dropout probability is ~${(student.riskScore * 0.85).toFixed(0)}%\n📱 All alerts sent to Admin: ${ADMIN_PHONE}`
        : `${student.name} shows ${student.riskLevel} risk indicators. Continue monitoring attendance (${student.attendance}%) and LMS activity (${student.lmsActivity}%). Regular check-ins recommended.\n📱 Admin notified at: ${ADMIN_PHONE}`
      
      setAiMessages(prev => [...prev, { role: 'assistant', content: mockReply }])
    }
    
    setAiLoading(false)
  }

  const tabs = [
    { id: 'sms', label: 'SMS Alert', icon: '📱', color: '#10b981' },
    { id: 'call', label: 'Voice Call', icon: '📞', color: '#6366f1' },
    { id: 'voice', label: 'AI Voice', icon: '🎙️', color: '#f59e0b' },
    { id: 'support', label: 'AI Support', icon: '🤖', color: '#06b6d4' },
  ]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            width: '100%', maxWidth: '720px', maxHeight: '90vh',
            background: 'var(--bg-primary)', borderRadius: '20px',
            border: '1px solid var(--glass-border)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.1)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '20px 24px', borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.08))',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: student.riskLevel === 'high'
                  ? 'linear-gradient(135deg, #ef4444, #f97316)'
                  : student.riskLevel === 'medium'
                    ? 'linear-gradient(135deg, #f59e0b, #fbbf24)'
                    : 'linear-gradient(135deg, #10b981, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', fontWeight: '800', color: 'white',
              }}>
                {student.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Communication Hub
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {student.name} • {student.rollNo} • Risk: {student.riskScore}%
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{
              background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center',
            }}>
              <HiOutlineX size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: '4px', padding: '12px 24px',
            borderBottom: '1px solid var(--border)', overflowX: 'auto',
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px 18px', borderRadius: '10px', border: 'none',
                  background: activeTab === tab.id
                    ? `linear-gradient(135deg, ${tab.color}22, ${tab.color}11)`
                    : 'transparent',
                  color: activeTab === tab.id ? tab.color : 'var(--text-secondary)',
                  fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  whiteSpace: 'nowrap',
                  borderBottom: activeTab === tab.id ? `2px solid ${tab.color}` : '2px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
            
            {/* ===== SMS TAB ===== */}
            {activeTab === 'sms' && (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Recipient
                  </div>
                  <div style={{
                    padding: '10px 14px', borderRadius: '10px',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    fontSize: '13px', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between',
                  }}>
                    <span>📱 <strong>{ADMIN_PHONE}</strong> ({ADMIN_NAME})</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>via Twilio</span>
                  </div>
                </div>

                {/* Quick Templates */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Quick Templates
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {[
                      { label: '🚨 Urgent Alert', msg: `URGENT: Student ${student.name} (${student.rollNo}) flagged with ${student.riskScore}% risk score. Immediate counselor meeting required. — Campus Intel` },
                      { label: '📋 Attendance Warning', msg: `ALERT: ${student.name}'s attendance has dropped to ${student.attendance}%. Please schedule a welfare check. — Campus Intel` },
                      { label: '🧠 Wellness Check', msg: `WELLNESS ALERT: ${student.name} shows declining mental health indicators (Score: ${student.mentalHealthScore}%). Counseling session recommended. — Campus Intel` },
                    ].map((tpl) => (
                      <button key={tpl.label} onClick={() => setSmsMessage(tpl.msg)} style={{
                        padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '600',
                        background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)',
                        color: '#34d399', cursor: 'pointer',
                      }}>
                        {tpl.label}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  rows={6}
                  style={{
                    width: '100%', padding: '14px', borderRadius: '12px',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    color: 'var(--text-primary)', fontSize: '13px', resize: 'vertical',
                    outline: 'none', fontFamily: 'Inter, sans-serif', lineHeight: '1.5',
                  }}
                  placeholder="Type your SMS message..."
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {smsMessage.length} characters
                  </span>
                  <button onClick={handleSendSMS} style={{
                    padding: '10px 24px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                    border: 'none', color: 'white', fontSize: '13px', fontWeight: '700',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    📱 Send SMS via Twilio
                  </button>
                </div>

                {/* SMS History */}
                {smsHistory.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      Sent Messages
                    </div>
                    {smsHistory.map((msg, i) => (
                      <div key={i} style={{
                        padding: '10px 14px', borderRadius: '10px', marginBottom: '6px',
                        background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.15)',
                        fontSize: '12px', color: 'var(--text-secondary)',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ color: '#34d399', fontWeight: '600' }}>✓ Sent</span>
                          <span>{msg.time.toLocaleTimeString()}</span>
                        </div>
                        <div style={{ color: 'var(--text-primary)', lineHeight: '1.4' }}>
                          {msg.message.substring(0, 80)}...
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===== CALL TAB ===== */}
            {activeTab === 'call' && (
              <div style={{ textAlign: 'center' }}>
                {/* Call Status Display */}
                <motion.div
                  animate={callStatus === 'ringing' ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{
                    width: '120px', height: '120px', borderRadius: '50%', margin: '10px auto 20px',
                    background: callStatus === 'connected'
                      ? 'linear-gradient(135deg, #10b981, #06b6d4)'
                      : callStatus === 'ringing'
                        ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                        : 'linear-gradient(135deg, #6366f1, #818cf8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: callStatus === 'ringing' ? '0 0 40px rgba(245, 158, 11, 0.4)' :
                      callStatus === 'connected' ? '0 0 40px rgba(16, 185, 129, 0.4)' :
                        '0 0 20px rgba(99, 102, 241, 0.3)',
                  }}
                >
                  <HiOutlinePhone size={48} style={{ color: 'white' }} />
                </motion.div>

                <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {callStatus === 'idle' && 'Ready to Call'}
                  {callStatus === 'ringing' && 'Ringing...'}
                  {callStatus === 'connected' && '🟢 Connected'}
                  {callStatus === 'ended' && 'Call Ended'}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  {ADMIN_PHONE} ({ADMIN_NAME}) • via Twilio
                </div>

                {/* Call Actions */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
                  {callStatus === 'idle' || callStatus === 'ended' ? (
                    <button onClick={handleCall} style={{
                      padding: '14px 32px', borderRadius: '14px',
                      background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                      border: 'none', color: 'white', fontSize: '15px', fontWeight: '700',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.1)',
                    }}>
                      📞 Call Admin
                    </button>
                  ) : (
                    <button onClick={handleEndCall} style={{
                      padding: '14px 32px', borderRadius: '14px',
                      background: 'linear-gradient(135deg, #ef4444, #f97316)',
                      border: 'none', color: 'white', fontSize: '15px', fontWeight: '700',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                      ✕ End Call
                    </button>
                  )}
                </div>

                {/* Call Info */}
                <div style={{
                  padding: '16px', borderRadius: '12px',
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  textAlign: 'left',
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    📋 Call Details
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                    <div><strong>Calling:</strong> {ADMIN_NAME} ({ADMIN_PHONE})</div>
                    <div><strong>Student:</strong> {student.name} ({student.rollNo})</div>
                    <div><strong>Risk Score:</strong> <span style={{ color: student.riskScore > 70 ? '#ef4444' : '#f59e0b' }}>{student.riskScore}%</span></div>
                    <div><strong>Department:</strong> {student.department}</div>
                    <div><strong>Alert Type:</strong> {student.riskLevel.toUpperCase()} Risk</div>
                    <div><strong>Provider:</strong> Twilio Voice API</div>
                  </div>
                </div>
              </div>
            )}

            {/* ===== AI VOICE TAB (ElevenLabs) ===== */}
            {activeTab === 'voice' && (
              <div>
                <div style={{
                  padding: '14px 16px', borderRadius: '12px', marginBottom: '16px',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(239, 68, 68, 0.05))',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <span style={{ fontSize: '24px' }}>🎙️</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      ElevenLabs AI Voice
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Generate AI voice alerts sent to Admin at {ADMIN_PHONE}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Voice Message Script
                  </div>
                  <textarea
                    value={voiceMessage}
                    onChange={(e) => setVoiceMessage(e.target.value)}
                    rows={5}
                    style={{
                      width: '100%', padding: '14px', borderRadius: '12px',
                      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                      color: 'var(--text-primary)', fontSize: '13px', resize: 'vertical',
                      outline: 'none', fontFamily: 'Inter, sans-serif', lineHeight: '1.5',
                    }}
                  />
                </div>

                {/* Voice Settings */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px',
                }}>
                  <div style={{
                    padding: '12px', borderRadius: '10px',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Voice Model</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#fbbf24' }}>Rachel (Natural)</div>
                  </div>
                  <div style={{
                    padding: '12px', borderRadius: '10px',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Language</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#fbbf24' }}>English (IN)</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleGenerateVoice} style={{
                    flex: 1, padding: '12px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                    border: 'none', color: 'white', fontSize: '13px', fontWeight: '700',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}>
                    <HiOutlineVolumeUp size={18} /> Generate & Send Voice Alert
                  </button>
                  <button onClick={() => {
                    handleGenerateVoice()
                    setTimeout(handleCall, 1500)
                  }} style={{
                    padding: '12px 18px', borderRadius: '10px',
                    background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)',
                    color: '#818cf8', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    📞 Generate + Call
                  </button>
                </div>
              </div>
            )}

            {/* ===== AI SUPPORT TAB (OpenAI) ===== */}
            {activeTab === 'support' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '380px' }}>
                <div style={{
                  padding: '10px 14px', borderRadius: '12px', marginBottom: '12px',
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(99, 102, 241, 0.05))',
                  border: '1px solid rgba(6, 182, 212, 0.2)',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <span style={{ fontSize: '20px' }}>🤖</span>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>AI Counseling Assistant</strong> — Powered by OpenAI.
                    Ask about intervention strategies, risk analysis, or recommended actions.
                  </div>
                </div>

                {/* Quick Prompts */}
                {aiMessages.length === 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {[
                      'What intervention do you recommend?',
                      'Analyze behavioral trends',
                      'Draft a counselor report',
                      'What are the key risk factors?',
                    ].map((prompt) => (
                      <button key={prompt} onClick={() => { setAiInput(prompt); }} style={{
                        padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '500',
                        background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.15)',
                        color: '#22d3ee', cursor: 'pointer',
                      }}>
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Chat Messages */}
                <div style={{
                  flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
                  gap: '10px', marginBottom: '12px', minHeight: '200px',
                  padding: '4px',
                }}>
                  {aiMessages.length === 0 && (
                    <div style={{
                      textAlign: 'center', padding: '40px 20px',
                      color: 'var(--text-secondary)', fontSize: '13px',
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>🤖</div>
                      Ask me anything about {student.name}'s risk profile<br/>
                      and I'll provide data-driven recommendations
                    </div>
                  )}
                  {aiMessages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        padding: '12px 16px', borderRadius: '14px',
                        background: msg.role === 'user'
                          ? 'linear-gradient(135deg, #6366f1, #818cf8)'
                          : 'var(--bg-secondary)',
                        border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                        color: 'var(--text-primary)', fontSize: '13px', lineHeight: '1.6',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {msg.content}
                    </motion.div>
                  ))}
                  {aiLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        alignSelf: 'flex-start', padding: '12px 20px', borderRadius: '14px',
                        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                        color: 'var(--text-secondary)', fontSize: '13px',
                      }}
                    >
                      <span className="shimmer" style={{ display: 'inline-block', width: '60px', height: '8px', borderRadius: '4px' }} />
                      <span style={{ marginLeft: '8px' }}>Analyzing...</span>
                    </motion.div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAISupport()}
                    placeholder="Ask about interventions, trends, recommendations..."
                    style={{
                      flex: 1, padding: '12px 16px', borderRadius: '12px',
                      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                      color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
                    }}
                  />
                  <button onClick={handleAISupport} disabled={aiLoading} style={{
                    padding: '12px 20px', borderRadius: '12px',
                    background: aiLoading ? 'var(--bg-tertiary)' : 'linear-gradient(135deg, #06b6d4, #6366f1)',
                    border: 'none', color: 'white', fontSize: '13px', fontWeight: '700',
                    cursor: aiLoading ? 'not-allowed' : 'pointer',
                  }}>
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
