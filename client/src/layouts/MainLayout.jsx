import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import ErrorBoundary from '../components/ErrorBoundary'
import { useState } from 'react'

export default function MainLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#0B0F19] text-white">
      <Sidebar onLogout={handleLogout} open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col ml-0 lg:ml-[260px]">
        <Navbar onLogout={handleLogout} onMenuToggle={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="w-full">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  )
}

