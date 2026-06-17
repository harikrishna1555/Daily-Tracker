import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { resetPassword } from '../services/authService'
import { useNavigate } from 'react-router-dom'

export default function ResetPassword() {
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) return toast.error('Passwords do not match')
    setLoading(true)
    try {
      await resetPassword(token, password)
      toast.success('Password reset successful')
      navigate('/login')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Reset failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reset Password</h2>
      <div>
        <label>Token</label>
        <input value={token} onChange={(e) => setToken(e.target.value)} required />
      </div>
      <div>
        <label>New Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
      </div>
      <div>
        <label>Confirm Password</label>
        <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" required />
      </div>
      <div>
        <button type="submit" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
      </div>
    </form>
  )
}
