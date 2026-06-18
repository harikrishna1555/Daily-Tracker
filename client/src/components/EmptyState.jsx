import React from 'react'

export default function EmptyState({ title = 'No items', subtitle }) {
  return (
    <div className="rounded-lg bg-[#1F2937] p-6 text-center text-white">
      <div className="text-lg font-semibold">{title}</div>
      {subtitle && <div className="mt-2 text-sm text-gray-300">{subtitle}</div>}
    </div>
  )
}
