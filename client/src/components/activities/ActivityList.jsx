import React from 'react'
import ActivityItem from './ActivityItem'

export default function ActivityList({ activities = [], logs = [], onToggle, onEdit, onDelete }) {
  const safeActivities = Array.isArray(activities) ? activities : []
  const safeLogs = Array.isArray(logs) ? logs : []

  const logMap = safeLogs.reduce((acc, l) => { acc[l.activity_id] = l; return acc }, {})

  if (safeActivities.length === 0) return <div className="p-6 text-gray-400">No activities in this tab</div>

  return (
    <div className="space-y-2">
      {safeActivities.map((a) => (
        <ActivityItem key={a.id} activity={a} log={logMap[a.id]} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
