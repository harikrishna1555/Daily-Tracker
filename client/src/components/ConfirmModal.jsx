import React from 'react'
import Modal from './Modal'

export default function ConfirmModal({ open, title, message, onConfirm, onClose, loading }) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-gray-300">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-md px-3 py-2 text-sm text-gray-300 border border-gray-700">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="rounded-md bg-[#F59E0B] px-3 py-2 text-sm font-semibold text-black">{loading ? 'Working...' : 'Confirm'}</button>
        </div>
      </div>
    </Modal>
  )
}
