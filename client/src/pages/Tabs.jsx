import React, { useEffect, useState } from 'react'
import * as tabService from '../services/tabService'
import { extractArray } from '../utils/apiHelpers'
import PageHeader from '../components/PageHeader'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { toast } from 'react-toastify'
import { useNotifications } from '../context/NotificationContext'
import IconMap from '../utils/iconMap'
import { useNavigate } from 'react-router-dom'

export default function Tabs() {
  const { addNotification } = useNotifications()
  const [tabs, setTabs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', icon: '', position: 0 })

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await tabService.getTabs()
      // Debug: log original API response shape
      console.log('Tabs API Response:', res?.data ?? res)
      const data = extractArray(res)
      setTabs(data)
    } catch (e) {
      console.error('Failed to load tabs:', e)
      setError('Unable to load tabs')
      setTabs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const navigate = useNavigate()

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', icon: '', position: 0 })
    setFormOpen(true)
  }

  const openEdit = (t) => {
    setEditing(t)
    setForm({ name: t.name, icon: t.icon || '', position: t.position || 0 })
    setFormOpen(true)
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await tabService.updateTab(editing.id, form)
        addNotification('Tab updated', 'success')
      } else {
        await tabService.createTab(form)
        addNotification('Tab created', 'success')
      }
      setFormOpen(false)
      load()
    } catch (err) {
      toast.error('Operation failed')
    }
  }

  const confirmDelete = (t) => {
    setDeleting(t)
    setConfirmOpen(true)
  }

  const doDelete = async () => {
    if (!deleting) return
    try {
      await tabService.deleteTab(deleting.id)
      addNotification('Tab deleted', 'success')
      setConfirmOpen(false)
      setDeleting(null)
      load()
    } catch (e) {
      toast.error('Delete failed')
    }
  }

  return (
    <div>
      <PageHeader title="Tabs">
        <div>
          <button onClick={openCreate} className="rounded-md bg-[#F59E0B] px-3 py-2 text-black font-semibold">New Tab</button>
        </div>
      </PageHeader>

      {loading && <LoadingSpinner />}

      {error && <div className="text-red-400">{error}</div>}

      {!loading && !error && (
        <>
          {(!Array.isArray(tabs) || tabs.length === 0) ? (
            <EmptyState title="No tabs found" subtitle="Create your first tab" />
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.isArray(tabs) ? tabs.map((t) => (
                <div
                  key={t.id}
                  onClick={() => navigate(`/tabs/${t.id}`)}
                  className="cursor-pointer transform rounded-lg bg-[#1F2937] p-4 text-white hover:scale-105 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{IconMap[t.icon] || IconMap.Folder}</div>
                      <div>
                        <div className="text-lg font-semibold">{t.name}</div>
                        <div className="text-sm text-gray-300">Position: {t.position}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); openEdit(t) }} className="rounded-md border border-gray-700 px-2 py-1 text-sm">Edit</button>
                      <button onClick={(e) => { e.stopPropagation(); confirmDelete(t) }} className="rounded-md bg-red-600 px-2 py-1 text-sm">Delete</button>
                    </div>
                  </div>
                </div>
              )) : null}
            </div>
          )}
        </>
      )}

      <Modal open={formOpen} title={editing ? 'Edit Tab' : 'Create Tab'} onClose={() => setFormOpen(false)}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300">Name</label>
            <input required value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} className="mt-1 w-full rounded-md bg-[#0B0F19] border border-[#1F2937] px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Icon</label>
            <select value={form.icon} onChange={(e) => setForm((s) => ({ ...s, icon: e.target.value }))} className="mt-1 w-full rounded-md bg-[#0B0F19] border border-[#1F2937] px-3 py-2 text-white">
              <option value="">Select icon</option>
              <option value="BookOpen">BookOpen (Study)</option>
              <option value="Book">Book (Reading)</option>
              <option value="Dumbbell">Dumbbell (Gym)</option>
              <option value="Footprints">Footprints (Walking)</option>
              <option value="Briefcase">Briefcase (Work)</option>
              <option value="Laptop">Laptop (Coding)</option>
              <option value="Brain">Brain (Meditation)</option>
              <option value="GlassWater">GlassWater (Water Intake)</option>
              <option value="Bed">Bed (Sleep)</option>
              <option value="Apple">Apple (Diet)</option>
              <option value="ChefHat">ChefHat (Cooking)</option>
              <option value="Wallet">Wallet (Finance)</option>
              <option value="ShoppingCart">ShoppingCart (Shopping)</option>
              <option value="Plane">Plane (Travel)</option>
              <option value="Home">Home (Home Tasks)</option>
              <option value="Activity">Activity (Health)</option>
              <option value="Star">Star (Custom)</option>
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

      <ConfirmModal open={confirmOpen} title="Delete Tab" message={`Delete tab "${deleting?.name}"?`} onConfirm={doDelete} onClose={() => setConfirmOpen(false)} />
    </div>
  )
}
