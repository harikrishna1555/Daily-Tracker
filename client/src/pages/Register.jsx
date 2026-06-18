import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { register } = useAuth()
  const navigate = useNavigate()
  const { addNotification } = useNotifications()

  const validate = () => {
    const e = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!email.trim()) e.email = 'Email is required'
    else if (!/^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(email)) e.email = 'Invalid email address'
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters'
    if (!confirm) e.confirm = 'Please confirm your password'
    else if (password !== confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await register({ name: name.trim(), email: email.trim(), password })
      addNotification('Registration successful. Please login.', 'success')
      navigate('/login')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Hero */}
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

      {/* Right Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <div className="rounded-3xl bg-[#1F2937] p-10 shadow-2xl transition-opacity duration-300">
            <h3 className="mb-1 text-2xl font-semibold text-white">Create Account</h3>
            <p className="mb-6 text-sm text-gray-400">Start tracking your habits and goals today.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm">
                <div className="mb-2 flex items-center gap-2 text-gray-300"> <FiUser className="text-gray-300" /> Full name</div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors duration-300"
                />
                {errors.name && <div className="mt-1 text-sm text-red-400">{errors.name}</div>}
              </label>

              <label className="block text-sm">
                <div className="mb-2 flex items-center gap-2 text-gray-300"> <FiMail className="text-gray-300" /> Email</div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors duration-300"
                />
                {errors.email && <div className="mt-1 text-sm text-red-400">{errors.email}</div>}
              </label>

              <label className="block text-sm">
                <div className="mb-2 flex items-center gap-2 text-gray-300"> <FiLock className="text-gray-300" /> Password</div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 pr-12 text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors duration-300"
                  />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && <div className="mt-1 text-sm text-red-400">{errors.password}</div>}
              </label>

              <label className="block text-sm">
                <div className="mb-2 flex items-center gap-2 text-gray-300"> <FiLock className="text-gray-300" /> Confirm Password</div>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 pr-12 text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors duration-300"
                  />
                  <button type="button" onClick={() => setShowConfirm((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.confirm && <div className="mt-1 text-sm text-red-400">{errors.confirm}</div>}
              </label>

              <div>
                <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-3 text-black font-semibold shadow hover:brightness-95 transition-all duration-300">
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-500 font-medium hover:underline">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
