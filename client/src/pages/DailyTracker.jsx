import React, { useEffect, useState } from 'react'
import * as dailyLogService from '../services/dailyLogService'
import * as activityService from '../services/activityService'
import * as tabService from '../services/tabService'
import { extractArray } from '../utils/apiHelpers'
import PageHeader from '../components/PageHeader'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import TabList from '../components/tracker/TabList'
import ActivityList from '../components/tracker/ActivityList'
import { toast } from 'react-toastify'
import { useNotifications } from '../context/NotificationContext'

export default function DailyTracker() {
  const { addNotification } = useNotifications()
  const [tabs, setTabs] = useState([])
  const [selectedTab, setSelectedTab] = useState(null)
  const [activities, setActivities] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().slice(0, 10)

  const loadTabs = async () => {
    try {
      const res = await tabService.getTabs()
      const data = extractArray(res)
      setTabs(data)
      if (!selectedTab && Array.isArray(data) && data.length > 0) setSelectedTab(data[0])
    } catch (e) {
      console.error('Failed to load tabs', e)
      toast.error('Unable to load tabs')
    }
  }

  const loadActivitiesFor = async (tabId) => {
    setLoading(true)
    try {
      const aRes = await activityService.getActivitiesByTab(tabId)
      const activitiesData = extractArray(aRes)
      setActivities(activitiesData)
    } catch (e) {
      console.error('Failed to load activities for tab', e)
      setActivities([])
      toast.error('Unable to load activities')
    } finally {
      setLoading(false)
    }
  }

  const loadLogs = async () => {
    try {
      const lRes = await dailyLogService.getLogs()
      setLogs(extractArray(lRes))
    } catch (e) {
      console.error('Failed to load logs', e)
      setLogs([])
    }
  }

  useEffect(() => {
    // initial load
    loadTabs()
    loadLogs()
  }, [])

  useEffect(() => {
    if (selectedTab && selectedTab.id) loadActivitiesFor(selectedTab.id)
  }, [selectedTab])

  const safeActivities = Array.isArray(activities) ? activities : []
  const safeLogs = Array.isArray(logs) ? logs : []

  const todaysLogs = safeLogs.filter((l) => l.date?.startsWith ? l.date.startsWith(today) : String(l.date).startsWith(today))

  const getLogForActivity = (activityId) => todaysLogs.find((l) => l.activity_id === activityId)

  const toggle = async (activity, existingLog) => {
    try {
      if (existingLog) {
        await dailyLogService.updateLog(existingLog.id, { ...existingLog, completed: !existingLog.completed })
        addNotification('Daily log updated', 'success')
      } else {
        await dailyLogService.createLog({ activity_id: activity.id, date: today, completed: true })
        addNotification('Daily log completed', 'success')
      }
      await loadLogs()
      // refresh activities in case any counts or derived fields change
      if (selectedTab) await loadActivitiesFor(selectedTab.id)
    } catch (e) {
      console.error('Toggle failed', e)
      toast.error('Update failed')
    }
  }

  const total = safeActivities.length
  const completedCount = todaysLogs.filter((l) => l.completed).length
  const pendingCount = total - completedCount
  const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100)

  return (
    <div>
      <PageHeader title="Daily Tracker" />

      {loading && <LoadingSpinner />}

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 rounded-lg bg-[#1F2937] p-4 text-white">
          <h2 className="mb-3 text-lg font-semibold">Tabs</h2>
          <TabList tabs={tabs} selectedTabId={selectedTab?.id} onSelect={(t) => setSelectedTab(t)} />
        </div>

        <div className="col-span-2 rounded-lg bg-[#1F2937] p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">{selectedTab ? `${selectedTab.name} Activities` : "Select a tab"}</h2>
            <div className="text-sm text-gray-300">Completion: <strong>{percent}%</strong></div>
          </div>

          {!selectedTab && <EmptyState title="No tab selected" subtitle="Select a tab to view activities" />}

          {selectedTab && (
            <>
              <ActivityList activities={safeActivities} logs={todaysLogs} onToggle={toggle} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
