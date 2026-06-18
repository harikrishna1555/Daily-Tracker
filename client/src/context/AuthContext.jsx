import React, { createContext, useContext, useEffect, useState } from 'react'
import * as authService from '../services/authService'
import useInactivityLogout from '../hooks/useInactivityLogout'
import SessionWarning from '../components/SessionWarning'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

const STORAGE_KEY = 'auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load existing session from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setUser(parsed.user || null)
        setAccessToken(parsed.token || null)
        setRefreshToken(parsed.refreshToken || null)
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  // Persist session whenever tokens or user change
  useEffect(() => {
    if (accessToken) {
      const payload = { user, token: accessToken, refreshToken }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user, accessToken, refreshToken])

  const login = async (credentials) => {
    const res = await authService.login(credentials)
    const data = res.data || {}
    // Expecting { user, token, refreshToken }
    setUser(data.user || null)
    setAccessToken(data.token || data.accessToken || null)
    setRefreshToken(data.refreshToken || null)
    return res
  }

  const register = async (payload) => {
    return authService.register(payload)
  }

  const logout = async () => {
    try {
      await authService.logout(refreshToken)
    } catch (e) {
      // ignore network errors
    }
    setUser(null)
    setAccessToken(null)
    setRefreshToken(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  // inactivity logout hook: only active when authenticated
  const { showWarning, timeLeftMs, stayLoggedIn, logoutNow } = useInactivityLogout({
    isActive: Boolean(accessToken),
    onLogout: logout,
    warningMs: 5 * 60 * 1000,
    inactivityLimitMs: 2 * 60 * 60 * 1000,
  })

  const value = {
    user,
    accessToken,
    refreshToken,
    login,
    logout,
    register,
    isAuthenticated: Boolean(accessToken),
    loading,
  }

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
      <SessionWarning open={showWarning} secondsLeft={Math.floor(timeLeftMs / 1000)} onStay={stayLoggedIn} onLogout={logoutNow} />
    </>
  )
}

export default AuthContext
