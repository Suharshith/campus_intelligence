# 🚀 Campus Intelligence Platform

## AI-Powered Student Wellbeing & Risk Analytics System

An intelligent platform that integrates institutional data to identify students at risk of dropout or mental health concerns, enabling early intervention through data-driven insights.

---

## 🏗️ Architecture

```
campus-intelligence-platform/
├── frontend/          # React + Tailwind CSS + Recharts Dashboard
├── backend/           # Node.js + Express.js API Server
├── ai-service/        # Python FastAPI + ML Risk Prediction
└── README.md
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Tailwind CSS, Recharts, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (ready) |
| **AI/ML** | Python, FastAPI, Scikit-learn, NumPy, Pandas |
| **AI Services** | OpenAI API, ElevenLabs (voice) |
| **Notifications** | Twilio SMS, Nodemailer Email |

## 🚀 Quick Start

### 1. Frontend (React Dashboard)
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:3000
```

### 2. Backend (Node.js API)
```bash
cd backend
npm install
npm run dev
# Runs at http://localhost:5000
```

### 3. AI Service (Python FastAPI)
```bash
cd ai-service
pip install -r requirements.txt
python main.py
# Runs at http://localhost:8000
```

## 📊 Major Modules

1. **Student Risk Prediction** - ML models predict dropout risk using attendance, GPA, LMS data
2. **Behavioral Analytics** - Visual analysis of student behavior patterns
3. **Early Intervention Alerts** - Automated alerts via SMS/Email when risk thresholds exceeded
4. **Campus Resource Management** - Track counseling, academic support utilization
5. **Admin Analytics Dashboard** - Real-time charts, heatmaps, and trend visualizations
6. **Notification System** - Twilio SMS + Email alerts to counselors and faculty

## 🔑 Environment Variables

Copy `.env.example` to `.env` in the backend directory and configure:

```env
MONGODB_URI=mongodb://localhost:27017/campus-intelligence
OPENAI_API_KEY=your-key
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
ELEVENLABS_API_KEY=your-key
```

## 📱 API Endpoints

### Backend (Express.js)
- `GET /api/students` - List all students with filtering
- `GET /api/students/:id` - Get student details
- `GET /api/alerts` - List alerts
- `POST /api/notifications/sms` - Send SMS alert
- `POST /api/notifications/email` - Send email alert

### AI Service (FastAPI)
- `POST /ml/predict` - Single student risk prediction
- `POST /ml/predict/bulk` - Bulk student predictions
- `POST /ml/analyze` - AI-powered data analysis
- `GET /ml/model/info` - Model information

---

Built with ❤️ for campus wellbeing
