import React, { useEffect, useState } from 'react'
import * as tabService from '../services/tabService'
import PageHeader from '../components/PageHeader'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { toast } from 'react-toastify'

export default function Tabs() {
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
      setTabs(res.data || [])
    } catch (e) {
      setError('Unable to load tabs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

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
        toast.success('Tab updated')
      } else {
        await tabService.createTab(form)
        toast.success('Tab created')
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
      toast.success('Tab deleted')
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

      {!loading && !error && tabs.length === 0 && <EmptyState title="No tabs found" subtitle="Create your first tab" />}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tabs.map((t) => (
          <div key={t.id} className="rounded-lg bg-[#1F2937] p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{t.name}</div>
                <div className="text-sm text-gray-300">Position: {t.position}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(t)} className="rounded-md border border-gray-700 px-2 py-1 text-sm">Edit</button>
                <button onClick={() => confirmDelete(t)} className="rounded-md bg-red-600 px-2 py-1 text-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={formOpen} title={editing ? 'Edit Tab' : 'Create Tab'} onClose={() => setFormOpen(false)}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300">Name</label>
            <input required value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} className="mt-1 w-full rounded-md bg-[#0B0F19] border border-[#1F2937] px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Icon</label>
            <input value={form.icon} onChange={(e) => setForm((s) => ({ ...s, icon: e.target.value }))} className="mt-1 w-full rounded-md bg-[#0B0F19] border border-[#1F2937] px-3 py-2 text-white" />
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
