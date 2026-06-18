import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FiHome, FiGrid, FiList, FiCalendar, FiBarChart2, FiTool, FiLogOut, FiMenu } from 'react-icons/fi'

const menu = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/tabs', label: 'Tabs', icon: FiGrid },
  { to: '/activities', label: 'Activities', icon: FiList },
  { to: '/daily-tracker', label: 'Daily Tracker', icon: FiCalendar },
  { to: '/reports', label: 'Reports', icon: FiBarChart2 },
  { to: '/admin', label: 'Admin', icon: FiTool },
]

export default function Sidebar({ onLogout }) {
  const [open, setOpen] = useState(false)

  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-64 transform bg-[#111827] p-4 text-white transition-transform duration-200 lg:translate-x-0" aria-label="Sidebar">
      <div className="flex items-center justify-between lg:block">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-[#F59E0B] flex items-center justify-center font-bold text-black">DT</div>
          <div className="text-lg font-semibold">Daily Tracker</div>
        </div>
        <button className="lg:hidden p-2" onClick={() => setOpen(v => !v)} aria-label="Toggle sidebar">
          <FiMenu size={20} />
        </button>
      </div>

      <nav className={`mt-6 ${open ? 'block' : 'hidden'} lg:block`}>
        <ul className="space-y-1">
          {menu.map((m) => {
            const Icon = m.icon
            return (
              <li key={m.to}>
                <NavLink
                  to={m.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-[#111827]/60 ` +
                    (isActive ? 'bg-[#1F2937] text-white ring-1 ring-[#F59E0B]/40' : 'text-gray-200')
                  }
                >
                  <Icon className="text-[#F59E0B]" />
                  <span>{m.label}</span>
                </NavLink>
              </li>
            )
          })}
          <li>
            <button onClick={onLogout} className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-[#111827]/60">
              <FiLogOut className="text-[#F59E0B]" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
