import React from 'react'
import { FiSearch } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ onLogout }) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-20 w-full bg-transparent">
      <div className="flex items-center justify-between gap-4 bg-transparent py-3 pr-4 pl-72">
        <div className="flex items-center gap-3 w-full max-w-md">
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search activities, tabs..."
              className="w-full rounded-md bg-[#0B0F19] border border-[#1F2937] px-10 py-2 text-white placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-white">{user?.name || 'User'}</div>
          <div className="h-8 w-8 rounded-full bg-gray-600" />
          <button onClick={onLogout} className="rounded-md bg-[#F59E0B] px-3 py-1 text-black text-sm font-semibold">Logout</button>
        </div>
      </div>
    </header>
  )
}
