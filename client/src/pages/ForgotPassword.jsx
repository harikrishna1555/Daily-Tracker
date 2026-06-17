import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { forgotPassword } from '../services/authService'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await forgotPassword(email)
      toast.success('If that email exists, a reset link was sent')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Request failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Forgot Password</h2>
      <div>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
      </div>
      <div>
        <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</button>
      </div>
    </form>
  )
}
