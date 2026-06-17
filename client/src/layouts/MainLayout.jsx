import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function MainLayout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="app-root">
      <aside className="sidebar">
        <nav>
          <ul>
            <li>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/tabs">Tabs</NavLink>
            </li>
            <li>
              <NavLink to="/activities">Activities</NavLink>
            </li>
            <li>
              <NavLink to="/daily-tracker">Daily Tracker</NavLink>
            </li>
            <li>
              <NavLink to="/reports">Reports</NavLink>
            </li>
            <li>
              <NavLink to="/admin">Admin</NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="main">
        <header className="navbar">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>Daily Tracker</div>
            <div>
              {user?.name && <span style={{ marginRight: 12 }}>Hello, {user.name}</span>}
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
