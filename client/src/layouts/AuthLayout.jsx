import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <Outlet />
    </div>
  )
}
