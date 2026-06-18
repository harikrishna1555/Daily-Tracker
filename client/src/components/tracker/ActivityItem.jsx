import React from 'react'

export default function ActivityItem({ activity, log, onToggle }) {
  const done = !!log && log.completed

  return (
    <li className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#111827]/40">
      <input
        type="checkbox"
        checked={done}
        onChange={() => onToggle && onToggle(activity, log)}
        className="h-5 w-5"
      />
      <div className={`flex-1 ${done ? 'line-through text-gray-400' : 'text-white'}`}>{activity.name}</div>
      <div className="text-sm text-gray-400">{activity.frequency ?? ''}</div>
    </li>
  )
}
