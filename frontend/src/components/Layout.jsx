import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? '260px' : '72px',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
