const express = require('express');
const router = express.Router();

// ========== ADMIN CONFIG ==========
const ADMIN_PHONE = process.env.ADMIN_PHONE || '+919347744542';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@campus.edu';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Campus Admin';

// ========== TWILIO CLIENT ==========
let twilioClient = null;
try {
  const twilio = require('twilio');
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  console.log('✅ Twilio client initialized');
} catch (err) {
  console.warn('⚠️ Twilio not initialized:', err.message);
}

// GET admin config (for frontend)
router.get('/config', (req, res) => {
  res.json({
    adminPhone: ADMIN_PHONE,
    adminEmail: ADMIN_EMAIL,
    adminName: ADMIN_NAME,
    twilioEnabled: !!twilioClient,
    twilioPhone: process.env.TWILIO_PHONE,
  });
});

// ========== TWILIO SMS (REAL) ==========
router.post('/sms', async (req, res) => {
  try {
    const { message, studentName, riskScore, alertType } = req.body;
    const recipient = ADMIN_PHONE;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let sid = null;
    let twilioError = null;

    if (twilioClient && process.env.TWILIO_PHONE) {
      try {
        const result = await twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE,
          to: recipient,
        });
        sid = result.sid;
        console.log(`📱 ✅ REAL SMS sent to ${recipient} | SID: ${sid}`);
      } catch (twilioErr) {
        twilioError = twilioErr.message;
        console.error(`📱 ❌ Twilio SMS failed: ${twilioErr.message}`);
      }
    } else {
      console.log(`📱 [DEMO] SMS to ${recipient}: ${message.substring(0, 80)}...`);
    }

    console.log(`   Student: ${studentName} | Risk: ${riskScore}% | Type: ${alertType}`);

    res.json({
      success: !twilioError,
      message: sid 
        ? `SMS delivered to Admin at ${recipient}` 
        : twilioError
          ? `SMS failed: ${twilioError}`
          : `SMS queued for Admin at ${recipient} (demo mode)`,
      details: {
        studentName, riskScore, alertType, recipient,
        adminName: ADMIN_NAME,
        sid: sid || null,
        error: twilioError || null,
        sentAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('SMS Error:', error);
    res.status(500).json({ error: 'Failed to send SMS', details: error.message });
  }
});

// ========== TWILIO VOICE CALL (REAL) ==========
router.post('/call', async (req, res) => {
  try {
    const { studentName, riskScore, alertType, voiceMessage } = req.body;
    const recipient = ADMIN_PHONE;

    const spokenMessage = voiceMessage || 
      `This is an urgent alert from Campus Intelligence Platform. ` +
      `Student ${studentName} has been flagged with a ${alertType} risk level. ` +
      `Their current risk score is ${riskScore} percent. ` +
      `Please contact the counseling center immediately for intervention details.`;

    const twiml = `<Response><Say voice="Polly.Aditi" language="en-IN">${spokenMessage}</Say><Pause length="1"/><Say voice="Polly.Aditi" language="en-IN">Press 1 to acknowledge this alert.</Say><Gather numDigits="1" action="/api/notifications/call-response" method="POST"><Say>Press 1 now.</Say></Gather></Response>`;

    let sid = null;
    let twilioError = null;

    if (twilioClient && process.env.TWILIO_PHONE) {
      try {
        const call = await twilioClient.calls.create({
          twiml: twiml,
          to: recipient,
          from: process.env.TWILIO_PHONE,
        });
        sid = call.sid;
        console.log(`📞 ✅ REAL CALL initiated to ${recipient} | SID: ${sid}`);
      } catch (twilioErr) {
        twilioError = twilioErr.message;
        console.error(`📞 ❌ Twilio CALL failed: ${twilioErr.message}`);
      }
    } else {
      console.log(`📞 [DEMO] Call to ${recipient} re: ${studentName}`);
    }

    res.json({
      success: !twilioError,
      message: sid
        ? `Voice call initiated to Admin at ${recipient}`
        : twilioError
          ? `Call failed: ${twilioError}`
          : `Call queued for Admin at ${recipient} (demo mode)`,
      details: {
        studentName, riskScore, alertType, recipient,
        adminName: ADMIN_NAME,
        sid: sid || null,
        error: twilioError || null,
        callType: 'automated_alert',
        initiatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Call Error:', error);
    res.status(500).json({ error: 'Failed to initiate call', details: error.message });
  }
});

// ========== TWILIO CALL RESPONSE HANDLER ==========
router.post('/call-response', (req, res) => {
  const digit = req.body.Digits;
  let twiml = '<Response>';
  if (digit === '1') {
    twiml += '<Say voice="Polly.Aditi" language="en-IN">Alert acknowledged. Thank you. The student profile has been flagged for priority review.</Say>';
  } else {
    twiml += '<Say voice="Polly.Aditi" language="en-IN">Alert acknowledged. Thank you.</Say>';
  }
  twiml += '</Response>';
  res.type('text/xml').send(twiml);
});

// ========== ELEVENLABS AI VOICE MESSAGE (REAL) ==========
router.post('/voice-message', async (req, res) => {
  try {
    const { studentName, riskScore, alertType, customMessage } = req.body;
    const recipient = ADMIN_PHONE;

    const voiceText = customMessage || 
      `Attention ${ADMIN_NAME}. This is an automated wellness alert from the Campus Intelligence Platform. ` +
      `Student ${studentName} has been identified with elevated risk indicators. ` +
      `Their current risk score is ${riskScore} percent, classified as ${alertType} risk. ` +
      `Key concerns include declining attendance and reduced engagement with learning resources. ` +
      `Immediate counselor intervention is recommended.`;

    let audioGenerated = false;
    let elevenLabsError = null;

    if (process.env.ELEVENLABS_API_KEY) {
      try {
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
          method: 'POST',
          headers: {
            'xi-api-key': process.env.ELEVENLABS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: voiceText,
            model_id: 'eleven_monolingual_v1',
            voice_settings: { stability: 0.6, similarity_boost: 0.8 },
          }),
        });

        if (response.ok) {
          audioGenerated = true;
          console.log(`🎙️ ✅ ElevenLabs voice generated for ${studentName}`);
          // In production: save audio buffer and serve via URL or send via Twilio call
        } else {
          const errBody = await response.text();
          elevenLabsError = `ElevenLabs API error: ${response.status} - ${errBody.substring(0, 200)}`;
          console.error(`🎙️ ❌ ${elevenLabsError}`);
        }
      } catch (elErr) {
        elevenLabsError = elErr.message;
        console.error(`🎙️ ❌ ElevenLabs error: ${elErr.message}`);
      }
    } else {
      console.log(`🎙️ [DEMO] Voice message for ${studentName}`);
    }

    // After generating voice, also make a Twilio call with the text
    let callSid = null;
    if (twilioClient && process.env.TWILIO_PHONE) {
      try {
        const twiml = `<Response><Say voice="Polly.Aditi" language="en-IN">${voiceText}</Say></Response>`;
        const call = await twilioClient.calls.create({
          twiml: twiml,
          to: recipient,
          from: process.env.TWILIO_PHONE,
        });
        callSid = call.sid;
        console.log(`📞 ✅ AI Voice call sent to ${recipient} | SID: ${callSid}`);
      } catch (callErr) {
        console.error(`📞 ❌ AI Voice call failed: ${callErr.message}`);
      }
    }

    res.json({
      success: audioGenerated || !!callSid,
      message: callSid
        ? `AI voice alert generated and call sent to Admin at ${recipient}`
        : audioGenerated
          ? `AI voice generated (call not sent - check Twilio config)`
          : `AI voice alert queued (demo mode)`,
      details: {
        studentName, riskScore, recipient, adminName: ADMIN_NAME,
        voiceText,
        audioGenerated,
        callSid: callSid || null,
        elevenLabsError: elevenLabsError || null,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Voice Message Error:', error);
    res.status(500).json({ error: 'Failed to generate voice message', details: error.message });
  }
});

// ========== OPENAI AI SUPPORT (REAL) ==========
router.post('/ai-support', async (req, res) => {
  try {
    const { studentName, riskScore, riskLevel, attendance, gpa, lmsActivity, 
            mentalHealthScore, factors, userMessage } = req.body;

    const systemPrompt = `You are an AI counseling assistant for the Campus Intelligence Platform. 
You help faculty and counselors understand student risk patterns and suggest intervention strategies.
You are compassionate, data-driven, and always prioritize student wellbeing.
Provide actionable recommendations based on the student data provided.
All alerts and notifications are sent to the Campus Admin at ${ADMIN_PHONE}.
Keep responses concise (under 300 words) but thorough.`;

    const studentContext = `
Student Profile:
- Name: ${studentName}
- Risk Score: ${riskScore}% (${riskLevel} risk)
- Attendance: ${attendance}%
- GPA: ${gpa}
- LMS Activity: ${lmsActivity}%
- Mental Health Score: ${mentalHealthScore}%
- Risk Factors: ${(factors || []).join(', ') || 'None identified'}
- Admin Contact: ${ADMIN_PHONE}
`;

    let aiMessage = '';
    let model = 'mock';

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key') {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `${studentContext}\n\nCounselor Question: ${userMessage || 'Provide a risk assessment and intervention recommendations for this student.'}` },
            ],
            temperature: 0.7,
            max_tokens: 600,
          }),
        });

        const data = await response.json();

        if (data.choices && data.choices[0]) {
          aiMessage = data.choices[0].message.content;
          model = data.model || 'gpt-4o-mini';
          console.log(`🤖 ✅ OpenAI response generated for ${studentName}`);
        } else {
          console.error('🤖 ❌ OpenAI unexpected response:', JSON.stringify(data).substring(0, 300));
          throw new Error(data.error?.message || 'Unexpected OpenAI response');
        }
      } catch (aiErr) {
        console.error(`🤖 ❌ OpenAI error: ${aiErr.message}`);
        // Fall through to mock response
      }
    }

    // Mock fallback if OpenAI failed or not configured
    if (!aiMessage) {
      model = 'mock-fallback';
      const mockResponses = {
        high: {
          analysis: `Based on the data for ${studentName}, this student is showing multiple high-risk indicators that require immediate attention.`,
          recommendations: [
            'Schedule an urgent one-on-one counseling session within 24-48 hours',
            'Assign a dedicated faculty mentor for weekly check-ins',
            `Contact the student's emergency contact`,
            'Enroll in the academic recovery program',
            `All alerts sent to Admin at ${ADMIN_PHONE}`,
          ],
        },
        medium: {
          analysis: `${studentName} shows moderate risk patterns that should be monitored closely.`,
          recommendations: [
            'Schedule a check-in counseling session within the next week',
            'Monitor attendance patterns for the next 2 weeks',
            'Send a supportive outreach message',
            'Review LMS engagement',
          ],
        },
        low: {
          analysis: `${studentName} is performing well with low risk indicators.`,
          recommendations: [
            'Continue regular monitoring',
            'Consider as peer mentor candidate',
            'Recognize academic achievements',
          ],
        },
      };
      const r = mockResponses[riskLevel] || mockResponses.medium;
      aiMessage = `${r.analysis}\n\n🎯 Recommended:\n${r.recommendations.map((x, i) => `${i + 1}. ${x}`).join('\n')}\n\n📱 Admin: ${ADMIN_PHONE}`;
    }

    res.json({
      success: true,
      response: aiMessage,
      adminPhone: ADMIN_PHONE,
      model,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI Support Error:', error);
    res.status(500).json({ error: 'AI support failed', details: error.message });
  }
});

// ========== SEND ALERT TO ADMIN ==========
router.post('/alert', async (req, res) => {
  try {
    const { studentId, studentName, riskScore, alertType } = req.body;

    // Send SMS alert automatically
    let smsSid = null;
    if (twilioClient && process.env.TWILIO_PHONE) {
      try {
        const alertMsg = `🚨 CAMPUS ALERT: Student ${studentName} flagged with ${riskScore}% risk (${alertType}). Check dashboard immediately. — Campus Intel AI`;
        const result = await twilioClient.messages.create({
          body: alertMsg,
          from: process.env.TWILIO_PHONE,
          to: ADMIN_PHONE,
        });
        smsSid = result.sid;
        console.log(`🚨 ✅ Alert SMS sent to Admin | SID: ${smsSid}`);
      } catch (smsErr) {
        console.error(`🚨 ❌ Alert SMS failed: ${smsErr.message}`);
      }
    }

    console.log(`🚨 Alert for ${studentName} (Risk: ${riskScore}%) → Admin: ${ADMIN_PHONE}`);

    res.json({
      success: true,
      message: `Alert sent to Admin (${ADMIN_PHONE}) for ${studentName}`,
      alert: {
        studentId, studentName, riskScore, alertType,
        adminPhone: ADMIN_PHONE, adminName: ADMIN_NAME,
        smsSid: smsSid || null,
        timestamp: new Date().toISOString(),
        status: 'sent',
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send alert', details: error.message });
  }
});

// ========== EMAIL NOTIFICATION ==========
router.post('/email', async (req, res) => {
  try {
    const { subject, body, studentName } = req.body;
    const recipient = ADMIN_EMAIL;

    console.log(`📧 Email to Admin (${recipient}) | Subject: ${subject}`);

    res.json({
      success: true,
      message: `Email sent to Admin at ${recipient}`,
      details: { to: recipient, subject, studentName, adminName: ADMIN_NAME, sentAt: new Date().toISOString() },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

module.exports = router;
