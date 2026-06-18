import React from 'react'
import Modal from './Modal'

export default function SessionWarning({ open, secondsLeft, onStay, onLogout }) {
  const mins = Math.ceil(secondsLeft / 60)

  return (
    <Modal open={open} title="Session Expiring Soon" onClose={onLogout}>
      <div className="text-gray-300">
        You will be logged out in <strong className="text-white">{mins} minutes</strong> due to inactivity.
      </div>
      <div className="mt-4 flex justify-end gap-3">
        <button onClick={onLogout} className="rounded-xl bg-red-600 px-3 py-2 text-white">Logout Now</button>
        <button onClick={onStay} className="rounded-xl bg-amber-500 px-3 py-2 text-black">Stay Logged In</button>
      </div>
    </Modal>
  )
}
