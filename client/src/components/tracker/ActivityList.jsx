import React from 'react'
import ActivityItem from './ActivityItem'

export default function ActivityList({ activities = [], logs = [], onToggle }) {
  const safeActivities = Array.isArray(activities) ? activities : []
  const safeLogs = Array.isArray(logs) ? logs : []

  const getLogFor = (activityId) => safeLogs.find((l) => l.activity_id === activityId)

  return (
    <div>
      {safeActivities.length === 0 ? (
        <div className="rounded-xl bg-[#111827] p-6 text-gray-400">No activities for this tab</div>
      ) : (
        <ul className="space-y-2">
          {safeActivities.map((a) => (
            <ActivityItem key={a.id} activity={a} log={getLogFor(a.id)} onToggle={onToggle} />
          ))}
        </ul>
      )}
    </div>
  )
}
