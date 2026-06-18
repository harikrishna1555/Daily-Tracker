import React from 'react'

export default function ActivityItem({ activity, log, onToggle, onEdit, onDelete }) {
  // prefer merged property activity.is_completed when available
  const done = typeof activity?.is_completed !== 'undefined' ? !!activity.is_completed : !!(log && log.is_completed)

  const merged = { ...activity, is_completed: done }

  return (
    <div className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-[#111827]/40">
      <input type="checkbox" checked={done} onChange={() => onToggle && onToggle(merged)} className="h-5 w-5" />
      <div className={`flex-1 ${done ? 'line-through text-gray-400' : 'text-white'}`}>{activity.name}</div>
      <div className="flex items-center gap-2">
        <button onClick={() => onEdit && onEdit(activity)} className="rounded-md border border-gray-700 px-2 py-1 text-sm">Edit</button>
        <button onClick={() => onDelete && onDelete(activity.id)} className="rounded-md bg-red-600 px-2 py-1 text-sm">Delete</button>
      </div>
    </div>
  )
}
