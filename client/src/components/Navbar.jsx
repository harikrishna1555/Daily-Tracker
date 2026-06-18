import React, { useEffect, useRef, useState } from 'react'
import { FiSearch, FiBell, FiMenu } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'

export default function Navbar({ onLogout, onMenuToggle }) {
  const { user } = useAuth()
  const { notifications, unreadCount, markAllRead, clearNotifications } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  return (
    <header className="sticky top-0 z-20 w-full bg-transparent">
      <div className="flex h-[70px] items-center justify-between gap-4 bg-transparent px-6">
        <div className="flex items-center gap-4 w-full max-w-3xl">
          <button onClick={onMenuToggle} className="mr-2 block lg:hidden p-2 text-gray-300">
            <FiMenu size={20} />
          </button>
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search activities, tabs..."
              className="w-full rounded-xl bg-[#0B0F19] border border-[#1F2937] px-10 py-3 text-white placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4" ref={ref}>
          <div className="relative">
            <button
              onClick={() => { setOpen((s) => !s); if (!open) markAllRead() }}
              className="relative p-2 text-gray-300 hover:text-white"
            >
              <FiBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-amber-500 px-1 text-xs text-black">
                  {unreadCount}
                </span>
              )}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-80 max-w-sm rounded-md bg-[#0B0F19] border border-[#1F2937] p-3 text-white shadow-lg z-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">Notifications</div>
                  <button onClick={clearNotifications} className="text-sm text-gray-400">Clear All</button>
                </div>
                <div className="max-h-64 overflow-auto space-y-2">
                  {notifications.length === 0 && <div className="text-gray-400">No notifications</div>}
                  {notifications.map((n) => (
                    <div key={n.id} className={`p-2 rounded ${n.read ? 'bg-transparent' : 'bg-[#111827]'}`}>
                      <div className="text-sm">{n.message}</div>
                      <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="text-sm text-white hidden sm:block">{user?.name || 'User'}</div>
          <div className="h-9 w-9 shrink-0 rounded-full bg-gray-600" />
          <button onClick={onLogout} className="rounded-xl bg-amber-500 px-3 py-2 text-black text-sm font-semibold">Logout</button>
        </div>
      </div>
    </header>
  )
}
