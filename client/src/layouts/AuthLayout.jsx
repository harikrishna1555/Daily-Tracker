import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="auth-root" style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-card" style={{ width: 420, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <Outlet />
      </div>
    </div>
  )
}
