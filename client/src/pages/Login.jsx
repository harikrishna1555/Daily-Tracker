import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { addNotification } = useNotifications()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login({ email, password })
      addNotification('Logged in', 'success')
      navigate('/dashboard')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Hero */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=0f2f3a9a6a1a2f1b3c4d5e6f7a8b9c0')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(20,20,40,0.6)] to-[rgba(10,10,20,0.8)] rounded-none" />

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

      {/* Right Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl bg-[#1F2937] p-12 shadow-lg">
            <h3 className="mb-1 text-2xl font-semibold text-white">Welcome Back</h3>
            <p className="mb-6 text-sm text-gray-400">Sign in to continue using Daily Tracker</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm">
                <div className="mb-2 flex items-center gap-2 text-gray-300"> <FiMail className="text-gray-300" /> Email</div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-[#111827] border border-[#374151] px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500 transition-colors duration-300"
                />
              </label>

              <label className="block text-sm">
                <div className="mb-2 flex items-center gap-2 text-gray-300"> <FiLock className="text-gray-300" /> Password</div>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl bg-[#111827] border border-[#374151] px-4 py-3 pr-12 text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500 transition-colors duration-300"
                  />
                  <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {show ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between">
                <Link to="/forgot-password" className="text-sm text-gray-300 hover:text-white">Forgot password?</Link>
              </div>

              <div>
                <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-3 text-black font-semibold shadow hover:brightness-95 transition-all duration-300">
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-300">
              Don't have an account?{' '}
              <Link to="/register" className="text-amber-500 font-medium hover:underline">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
