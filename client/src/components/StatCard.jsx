import React from 'react'

export default function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="rounded-lg bg-[#1F2937] p-4 text-white shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-300">{title}</div>
          <div className="mt-1 text-2xl font-bold">{value}</div>
        </div>
        {icon && <div className="text-[#F59E0B]">{icon}</div>}
      </div>
      {subtitle && <div className="mt-3 text-sm text-gray-400">{subtitle}</div>}
    </div>
  )
}
