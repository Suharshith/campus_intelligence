import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import StudentDetail from './pages/StudentDetail'
import Alerts from './pages/Alerts'
import Analytics from './pages/Analytics'
import Resources from './pages/Resources'
import Settings from './pages/Settings'
import './App.css'

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="students/:id" element={<StudentDetail />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="resources" element={<Resources />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
