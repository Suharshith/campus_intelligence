import { HiOutlineBell, HiOutlineSearch, HiOutlineMenu } from 'react-icons/hi'
import { useState } from 'react'

export default function Header({ toggleSidebar }) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header style={{
      height: '72px',
      borderBottom: '1px solid var(--glass-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      {/* Left Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <HiOutlineMenu size={22} />
        </button>

        {/* Search */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}>
          <HiOutlineSearch 
            size={18} 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              color: 'var(--text-secondary)',
              pointerEvents: 'none',
            }} 
          />
          <input
            type="text"
            placeholder="Search students, alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '320px',
              padding: '10px 16px 10px 40px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Notifications */}
        <button style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '8px',
        }}>
          <HiOutlineBell size={22} />
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--danger)',
            border: '2px solid var(--bg-primary)',
          }} />
        </button>

        {/* Date Display */}
        <div style={{
          padding: '6px 14px',
          borderRadius: '8px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          fontWeight: '500',
        }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
        </div>

        {/* Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '6px 12px 6px 6px',
          borderRadius: '10px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          cursor: 'pointer',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: '700',
            color: 'white',
          }}>
            AD
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.2' }}>
              Admin
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Dean's Office
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
