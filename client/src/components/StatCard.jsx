import React from 'react'

export default function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="rounded-xl bg-[#1F2937] p-5 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-400">{title}</div>
          <div className="mt-2 text-2xl font-bold">{value}</div>
        </div>
        {icon && <div className="text-amber-500">{icon}</div>}
      </div>
      {subtitle && <div className="mt-4 text-sm text-gray-400">{subtitle}</div>}
    </div>
  )
}
