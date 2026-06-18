import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { forgotPassword } from '../services/authService'
import { useNotifications } from '../context/NotificationContext'
import { FiMail } from 'react-icons/fi'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { addNotification } = useNotifications()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return toast.error('Email is required')
    setLoading(true)
    try {
      await forgotPassword(email.trim())
      addNotification('If that email exists, a reset link was sent', 'success')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Request failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=0f2f3a9a6a1a2f1b3c4d5e6f7a8b9c0')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(20,20,40,0.6)] to-[rgba(10,10,20,0.8)]" />
        <div className="relative z-10 max-w-md px-12 text-white">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-12 w-12 rounded-md bg-amber-500 flex items-center justify-center font-bold text-black">DT</div>
            <div className="text-xl font-semibold">Daily Tracker</div>
          </div>
          <h2 className="mb-4 text-4xl font-extrabold leading-tight">Track Better.<br />Build Better Habits.</h2>
          <p className="mb-6 text-gray-300">Stay consistent. Measure progress. Achieve goals.</p>
          <div className="mt-16 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-gray-500/60" />
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <div className="h-2 w-2 rounded-full bg-gray-500/60" />
          </div>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <div className="rounded-3xl bg-[#1F2937] p-10 shadow-2xl">
            <h3 className="mb-1 text-2xl font-semibold text-white">Forgot Password</h3>
            <p className="mb-6 text-sm text-gray-400">Enter your email and we'll send a reset link.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm">
                <div className="mb-2 flex items-center gap-2 text-gray-300"> <FiMail className="text-gray-300" /> Email</div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors duration-300"
                />
              </label>

              <div>
                <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-3 text-black font-semibold shadow hover:brightness-95 transition-all duration-300">
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-300">
              Remembered your password?{' '}
              <Link to="/login" className="text-amber-500 font-medium hover:underline">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
