import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineSearch, HiOutlineFilter, HiOutlineDownload } from 'react-icons/hi'
import RiskBadge from '../components/RiskBadge'
import { mockStudents } from '../data/mockData'

export default function Students() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterRisk, setFilterRisk] = useState('all')
  const [filterDept, setFilterDept] = useState('all')
  const [sortBy, setSortBy] = useState('riskScore')

  const departments = [...new Set(mockStudents.map(s => s.department))]

  const filtered = mockStudents
    .filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(search.toLowerCase())
      const matchRisk = filterRisk === 'all' || s.riskLevel === filterRisk
      const matchDept = filterDept === 'all' || s.department === filterDept
      return matchSearch && matchRisk && matchDept
    })
    .sort((a, b) => {
      if (sortBy === 'riskScore') return b.riskScore - a.riskScore
      if (sortBy === 'attendance') return a.attendance - b.attendance
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'gpa') return a.gpa - b.gpa
      return 0
    })

  return (
    <div>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>
          <span className="gradient-text">Student</span> Management
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Monitor and manage student risk profiles across all departments
        </p>
      </motion.div>

      {/* Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
          <HiOutlineSearch size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 40px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>

        {/* Risk Filter */}
        <select
          value={filterRisk}
          onChange={(e) => setFilterRisk(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '13px',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Risk Levels</option>
          <option value="high">High Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="low">Low Risk</option>
        </select>

        {/* Department Filter */}
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '13px',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '13px',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="riskScore">Sort by Risk Score</option>
          <option value="attendance">Sort by Attendance</option>
          <option value="gpa">Sort by GPA</option>
          <option value="name">Sort by Name</option>
        </select>

        <button style={{
          padding: '10px 16px',
          borderRadius: '10px',
          border: '1px solid var(--primary)',
          background: 'rgba(99, 102, 241, 0.1)',
          color: 'var(--primary-light)',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <HiOutlineDownload size={16} />
          Export
        </button>
      </motion.div>

      {/* Results Count */}
      <div style={{ marginBottom: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
        Showing <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{filtered.length}</span> students
      </div>

      {/* Students Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          background: 'var(--bg-secondary)',
          borderRadius: '16px',
          border: '1px solid var(--glass-border)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Student', 'Department', 'Risk Score', 'Attendance', 'GPA', 'LMS Activity', 'Mental Health', 'Alerts'].map((h) => (
                  <th key={h} style={{
                    padding: '14px 16px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, index) => (
                <tr
                  key={student._id}
                  onClick={() => navigate(`/students/${student._id}`)}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: student.riskLevel === 'high'
                          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(245, 158, 11, 0.2))'
                          : student.riskLevel === 'medium'
                            ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(251, 191, 36, 0.2))'
                            : 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: student.riskLevel === 'high' ? '#f87171' : student.riskLevel === 'medium' ? '#fbbf24' : '#34d399',
                      }}>
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{student.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{student.rollNo}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{student.department}</td>
                  <td style={{ padding: '14px 16px' }}><RiskBadge level={student.riskLevel} score={student.riskScore} /></td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '60px',
                        height: '6px',
                        borderRadius: '3px',
                        background: 'var(--bg-primary)',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${student.attendance}%`,
                          borderRadius: '3px',
                          background: student.attendance < 50 ? '#ef4444' : student.attendance < 75 ? '#f59e0b' : '#10b981',
                        }} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{student.attendance}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: student.gpa < 5 ? '#f87171' : student.gpa < 7 ? '#fbbf24' : '#34d399' }}>{student.gpa}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-primary)' }}>{student.lmsActivity}%</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px' }}>
                    <div style={{
                      width: '40px',
                      height: '6px',
                      borderRadius: '3px',
                      background: 'var(--bg-primary)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${student.mentalHealthScore}%`,
                        borderRadius: '3px',
                        background: student.mentalHealthScore < 40 ? '#ef4444' : student.mentalHealthScore < 60 ? '#f59e0b' : '#10b981',
                      }} />
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {student.alerts > 0 && (
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'rgba(239, 68, 68, 0.15)',
                        color: '#f87171',
                        fontSize: '12px',
                        fontWeight: '700',
                      }}>
                        {student.alerts}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
