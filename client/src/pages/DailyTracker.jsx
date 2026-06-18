import React, { useEffect, useState } from 'react'
import * as dailyLogService from '../services/dailyLogService'
import * as activityService from '../services/activityService'
import PageHeader from '../components/PageHeader'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { toast } from 'react-toastify'

export default function DailyTracker() {
  const [activities, setActivities] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const [aRes, lRes] = await Promise.all([activityService.getActivities(), dailyLogService.getLogs()])
      setActivities(aRes.data || [])
      setLogs(lRes.data || [])
    } catch (e) {
      toast.error('Unable to load daily logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const today = new Date().toISOString().slice(0, 10)

  const todaysLogs = logs.filter((l) => l.date?.startsWith ? l.date.startsWith(today) : String(l.date).startsWith(today))

  const getLogForActivity = (activityId) => todaysLogs.find((l) => l.activity_id === activityId)

  const toggle = async (activity) => {
    try {
      const existing = getLogForActivity(activity.id)
      if (existing) {
        await dailyLogService.updateLog(existing.id, { ...existing, completed: !existing.completed })
        toast.success('Updated')
      } else {
        await dailyLogService.createLog({ activity_id: activity.id, date: today, completed: true })
        toast.success('Logged')
      }
      load()
    } catch (e) {
      toast.error('Update failed')
    }
  }

  const total = activities.length
  const completedCount = todaysLogs.filter((l) => l.completed).length
  const pendingCount = total - completedCount
  const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100)

  return (
    <div>
      <PageHeader title="Daily Tracker" />

      {loading && <LoadingSpinner />}

      {!loading && activities.length === 0 && <EmptyState title="No activities" subtitle="Add activities to start tracking" />}

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2 rounded-lg bg-[#1F2937] p-4 text-white">
          <h2 className="mb-3 text-lg font-semibold">Today's Activities</h2>
          <ul className="space-y-2">
            {activities.map((a) => {
              const log = getLogForActivity(a.id)
              const done = !!log && log.completed
              return (
                <li key={a.id} className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-[#111827]/40">
                  <input type="checkbox" checked={done} onChange={() => toggle(a)} className="h-5 w-5" />
                  <div className={`flex-1 ${done ? 'line-through text-gray-400' : ''}`}>{a.name}</div>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="rounded-lg bg-[#1F2937] p-4 text-white">
          <h2 className="mb-3 text-lg font-semibold">Summary</h2>
          <div className="space-y-2">
            <div>Completion: <strong>{percent}%</strong></div>
            <div>Completed: <strong>{completedCount}</strong></div>
            <div>Pending: <strong>{pendingCount}</strong></div>
          </div>
        </div>
      </div>
    </div>
  )
}
