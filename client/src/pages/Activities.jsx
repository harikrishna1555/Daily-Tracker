import React, { useEffect, useState } from 'react'
import * as activityService from '../services/activityService'
import * as tabService from '../services/tabService'
import { extractArray } from '../utils/apiHelpers'
import PageHeader from '../components/PageHeader'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { toast } from 'react-toastify'
import { useNotifications } from '../context/NotificationContext'

export default function Activities() {
  const { addNotification } = useNotifications()
  const [activities, setActivities] = useState([])
  const [tabs, setTabs] = useState([])
  const [loading, setLoading] = useState(false)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', tab_id: '', position: 0 })

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const [aRes, tRes] = await Promise.all([activityService.getActivities(), tabService.getTabs()])
      console.log('Activities API Response:', aRes?.data ?? aRes)
      console.log('Tabs API Response:', tRes?.data ?? tRes)
      setActivities(extractArray(aRes))
      setTabs(extractArray(tRes))
    } catch (e) {
      toast.error('Unable to load activities')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', tab_id: tabs[0]?.id || '', position: 0 })
    setFormOpen(true)
  }

  const openEdit = (a) => {
    setEditing(a)
    setForm({ name: a.name, tab_id: a.tab_id, position: a.position || 0 })
    setFormOpen(true)
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await activityService.updateActivity(editing.id, form)
        addNotification('Activity updated', 'success')
      } else {
        await activityService.createActivity(form)
        addNotification('Activity created', 'success')
      }
      setFormOpen(false)
      load()
    } catch (err) {
      toast.error('Operation failed')
    }
  }

  const confirmDelete = (a) => {
    setDeleting(a)
    setConfirmOpen(true)
  }

  const doDelete = async () => {
    if (!deleting) return
    try {
      await activityService.deleteActivity(deleting.id)
      addNotification('Activity deleted', 'success')
      setConfirmOpen(false)
      setDeleting(null)
      load()
    } catch (e) {
      toast.error('Delete failed')
    }
  }

  // Defensive safe arrays
  const safeTabs = Array.isArray(tabs) ? tabs : []
  const safeActivities = Array.isArray(activities) ? activities : []

  // Group activities by tab
  const grouped = safeTabs.map((t) => ({ tab: t, activities: safeActivities.filter((a) => a.tab_id === t.id) }))

  return (
    <div>
      <PageHeader title="Activities">
        <div>
          <button onClick={openCreate} className="rounded-md bg-[#F59E0B] px-3 py-2 text-black font-semibold">New Activity</button>
        </div>
      </PageHeader>

      {loading && <LoadingSpinner />}

      {!loading && activities.length === 0 && <EmptyState title="No activities" subtitle="Create your first activity" />}

      <div className="mt-4 space-y-6">
        {grouped.map((g) => (
          <div key={g.tab.id} className="rounded-lg bg-[#1F2937] p-4 text-white">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-lg font-semibold">{g.tab.name}</div>
              <div className="text-sm text-gray-300">{g.activities.length} activities</div>
            </div>
            <ul className="space-y-2">
              {g.activities.map((a) => (
                <li key={a.id} className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-[#111827]/40">
                  <div>{a.name}</div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(a)} className="rounded-md border border-gray-700 px-2 py-1 text-sm">Edit</button>
                    <button onClick={() => confirmDelete(a)} className="rounded-md bg-red-600 px-2 py-1 text-sm">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Modal open={formOpen} title={editing ? 'Edit Activity' : 'Create Activity'} onClose={() => setFormOpen(false)}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300">Name</label>
            <input required value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} className="mt-1 w-full rounded-md bg-[#0B0F19] border border-[#1F2937] px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Tab</label>
            <select required value={form.tab_id} onChange={(e) => setForm((s) => ({ ...s, tab_id: e.target.value }))} className="mt-1 w-full rounded-md bg-[#0B0F19] border border-[#1F2937] px-3 py-2 text-white">
              <option value="">Select tab</option>
              {safeTabs.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300">Position</label>
            <input type="number" value={form.position} onChange={(e) => setForm((s) => ({ ...s, position: Number(e.target.value) }))} className="mt-1 w-full rounded-md bg-[#0B0F19] border border-[#1F2937] px-3 py-2 text-white" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setFormOpen(false)} className="rounded-md px-3 py-2 text-sm text-gray-300 border border-gray-700">Cancel</button>
            <button type="submit" className="rounded-md bg-[#F59E0B] px-3 py-2 text-sm font-semibold text-black">{editing ? 'Save' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmModal open={confirmOpen} title="Delete Activity" message={`Delete activity "${deleting?.name}"?`} onConfirm={doDelete} onClose={() => setConfirmOpen(false)} />
    </div>
  )
}
