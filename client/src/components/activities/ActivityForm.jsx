import React, { useState, useEffect } from 'react'

export default function ActivityForm({ initial = null, onCreate, onUpdate, onCancel }) {
  const [name, setName] = useState('')

  useEffect(() => {
    if (initial) setName(initial.name || '')
    else setName('')
  }, [initial])

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    if (initial && initial.id) {
      onUpdate && onUpdate(initial.id, { name: name.trim() })
    } else {
      onCreate && onCreate(name.trim())
    }
  }

  return (
    <form onSubmit={submit} className="rounded-xl bg-[#111827] p-4">
      <div className="mb-3">
        <label className="block text-sm text-gray-300">Activity Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl bg-gray-900 border border-gray-700 px-3 py-2 text-white" />
      </div>
      <div className="flex gap-3">
        <button type="submit" className="rounded-xl bg-amber-500 px-3 py-2 text-black font-semibold">{initial ? 'Save' : 'Add'}</button>
        <button type="button" onClick={onCancel} className="rounded-xl border border-gray-700 px-3 py-2 text-gray-300">Cancel</button>
      </div>
    </form>
  )
}
