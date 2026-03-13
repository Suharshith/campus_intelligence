import { NavLink } from 'react-router-dom'
import { 
  HiOutlineHome, 
  HiOutlineUserGroup, 
  HiOutlineBell, 
  HiOutlineChartBar, 
  HiOutlineCube, 
  HiOutlineCog,
  HiOutlineChevronLeft,
  HiOutlineChevronRight
} from 'react-icons/hi'

const navItems = [
  { path: '/', icon: HiOutlineHome, label: 'Dashboard' },
  { path: '/students', icon: HiOutlineUserGroup, label: 'Students' },
  { path: '/alerts', icon: HiOutlineBell, label: 'Alerts' },
  { path: '/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
  { path: '/resources', icon: HiOutlineCube, label: 'Resources' },
  { path: '/settings', icon: HiOutlineCog, label: 'Settings' },
]

export default function Sidebar({ isOpen, toggle }) {
  return (
    <aside style={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: isOpen ? '260px' : '72px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid var(--glass-border)',
        minHeight: '72px',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--primary), var(--accent))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: '800',
          color: 'white',
          flexShrink: 0,
        }}>
          CI
        </div>
        {isOpen && (
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.2' }}>
              Campus Intel
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '500' }}>
              AI Platform
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: isOpen ? '12px 16px' : '12px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: isActive ? 'var(--primary-dark)' : 'var(--text-secondary)',
              background: isActive ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(8, 145, 178, 0.1))' : 'transparent',
              border: isActive ? '1px solid rgba(37, 99, 235, 0.3)' : '1px solid transparent',
              transition: 'all 0.2s ease',
              fontSize: '14px',
              fontWeight: isActive ? '600' : '500',
              justifyContent: isOpen ? 'flex-start' : 'center',
            })}
          >
            <item.icon size={20} style={{ flexShrink: 0 }} />
            {isOpen && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Toggle Button */}
      <button
        onClick={toggle}
        style={{
          margin: '12px',
          padding: '10px',
          borderRadius: '10px',
          border: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
        }}
      >
        {isOpen ? <HiOutlineChevronLeft size={18} /> : <HiOutlineChevronRight size={18} />}
      </button>
    </aside>
  )
}
