import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as activityService from '../services/activityService'
import * as dailyLogService from '../services/dailyLogService'
import { extractArray } from '../utils/apiHelpers'
import PageHeader from '../components/PageHeader'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ActivityList from '../components/activities/ActivityList'
import ActivityForm from '../components/activities/ActivityForm'
import { toast } from 'react-toastify'
import { useNotifications } from '../context/NotificationContext'

export default function TabDetails() {
  const { addNotification } = useNotifications()
  const { tabId } = useParams()
  const navigate = useNavigate()
  const [activities, setActivities] = useState([])
  const [logs, setLogs] = useState([])
  const [tab, setTab] = useState(null)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)

  const today = new Date().toISOString().slice(0, 10)

  const loadActivities = async () => {
    setLoading(true)
    try {
      const aRes = await activityService.getActivitiesByTab(tabId)
      setActivities(extractArray(aRes))
    } catch (e) {
      console.error('Failed to load activities', e)
      setActivities([])
      toast.error('Unable to load activities')
    } finally {
      setLoading(false)
    }
  }

  const loadLogs = async () => {
    try {
      const lRes = await dailyLogService.getTodayLogs()
      setLogs(extractArray(lRes))
    } catch (e) {
      console.error('Failed to load logs', e)
      setLogs([])
    }
  }

  useEffect(() => {
    loadActivities()
    loadLogs()
    // fetch tab info for header
    ;(async () => {
      try {
        const tRes = await (await import('../services/tabService')).getTab(tabId)
        setTab(tRes.data?.data || tRes.data || null)
      } catch (err) {
        console.error('Failed to fetch tab info', err)
      }
    })()
  }, [tabId])

  // merge activities with today's logs so each activity reflects persisted completion
  const mergedActivities = (Array.isArray(activities) ? activities : []).map((a) => {
    const log = (Array.isArray(logs) ? logs : []).find((l) => l.activity_id === a.id)
    return {
      ...a,
      is_completed: log ? !!log.is_completed : false,
      log_id: log ? log.id : null,
    }
  })

  const toggle = async (activity) => {
    try {
      console.log('Activity Before Toggle:', activity)
      // send snake_case payload expected by controller: activity_id and is_completed
      const payload = { activity_id: activity.id, is_completed: !activity.is_completed }
      console.log('Sending Payload:', payload)
      await dailyLogService.createLog(payload)
      // add notification instead of toast
      addNotification(payload.is_completed ? 'Daily log completed' : 'Daily log unchecked', 'success')
      // update local activities state to reflect new completion
      setActivities((prev) =>
        prev.map((item) =>
          item.id === activity.id
            ? { ...item, is_completed: !activity.is_completed }
            : item
        )
      )
      // refresh logs to ensure log ids and server state are current
      await loadLogs()
    } catch (e) {
      console.error('Toggle failed', e)
      toast.error('Update failed')
    }
  }

  const handleCreate = async (name) => {
    try {
      const payload = { tabId: Number(tabId), name }
      console.log('Create Activity payload (frontend):', payload)
      await activityService.createActivity(payload)
      addNotification('Activity created', 'success')
      setFormOpen(false)
      await loadActivities()
    } catch (e) {
      console.error('Create failed', e)
      toast.error('Create failed')
    }
  }

  const handleUpdate = async (id, data) => {
    try {
      await activityService.updateActivity(id, data)
      addNotification('Activity updated', 'success')
      setEditing(null)
      await loadActivities()
    } catch (e) {
      console.error('Update failed', e)
      toast.error('Update failed')
    }
  }

  const handleDelete = async (id) => {
    try {
      await activityService.deleteActivity(id)
      addNotification('Activity deleted', 'success')
      await loadActivities()
    } catch (e) {
      console.error('Delete failed', e)
      toast.error('Delete failed')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
          <button onClick={() => navigate('/tabs')} className="rounded-md px-3 py-2 bg-transparent text-amber-400 hover:text-amber-300">← Back</button>
          <div>
            <div className="text-3xl font-bold">{tab?.name || `Tab ${tabId}`}</div>
            <div className="text-sm text-gray-400">Activities {` `}{/* optional summary */}{(() => {
              const total = mergedActivities.length
              const completed = mergedActivities.filter((m) => m.is_completed).length
              return total > 0 ? <span className="text-gray-400 text-sm">{completed} / {total} Completed</span> : <span className="text-gray-400 text-sm">No activities yet</span>
            })()}</div>
          </div>
        </div>
        <div>
          <button onClick={() => setFormOpen(true)} className="rounded-xl bg-amber-500 px-3 py-2 text-black font-semibold">Add Activity</button>
        </div>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && (
        <div className="mt-4 rounded-lg bg-[#1F2937] p-4 text-white">
          <ActivityList activities={activities} logs={logs} onToggle={toggle} onEdit={(a) => { setEditing(a); setFormOpen(true) }} onDelete={handleDelete} />
        </div>
      )}

      {formOpen && (
        <div className="mt-4">
          <ActivityForm
            initial={editing}
            onCancel={() => { setFormOpen(false); setEditing(null) }}
            onCreate={(name) => handleCreate(name)}
            onUpdate={(id, data) => handleUpdate(id, data)}
          />
        </div>
      )}
    </div>
  )
}
