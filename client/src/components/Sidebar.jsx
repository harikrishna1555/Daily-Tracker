import React from 'react'
import { NavLink } from 'react-router-dom'
import { FiHome, FiGrid, FiList, FiCalendar, FiBarChart2, FiTool, FiLogOut, FiMenu } from 'react-icons/fi'

const menu = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/tabs', label: 'Tabs', icon: FiGrid },
  { to: '/daily-tracker', label: 'Daily Tracker', icon: FiCalendar },
  { to: '/reports', label: 'Reports', icon: FiBarChart2 },
  { to: '/admin', label: 'Admin', icon: FiTool },
]

export default function Sidebar({ onLogout, open, setOpen }) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[260px] transform bg-[#111827] p-6 text-white transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-amber-500 flex items-center justify-center font-bold text-black">DT</div>
            <div className="text-lg font-semibold">Daily Tracker</div>
          </div>
          <button className="lg:hidden p-2" onClick={() => setOpen(false)} aria-label="Close sidebar">
            <FiMenu size={20} />
          </button>
        </div>

        <nav className="mt-8">
          <ul className="space-y-2">
            {menu.map((m) => {
              const Icon = m.icon
              return (
                <li key={m.to}>
                  <NavLink
                    to={m.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-2 text-sm transition-colors duration-150 ` +
                      (isActive ? 'bg-amber-500 text-white shadow-lg' : 'text-gray-300 hover:bg-[#0b1220]')
                    }
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="text-amber-500" />
                    <span className="font-medium">{m.label}</span>
                  </NavLink>
                </li>
              )
            })}

            <li className="mt-4">
              <button onClick={() => { setOpen(false); onLogout() }} className="w-full flex items-center gap-3 rounded-xl px-4 py-2 text-sm text-gray-300 hover:bg-[#0b1220]">
                <FiLogOut className="text-amber-500" />
                <span className="font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* overlay for mobile */}
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}
    </>
  )
}
