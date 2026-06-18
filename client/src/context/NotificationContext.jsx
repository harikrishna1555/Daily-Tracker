import React, { createContext, useContext, useState, useCallback } from 'react'

const NotificationContext = createContext(null)

export function useNotifications() {
  return useContext(NotificationContext)
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const n = { id, message, type, createdAt: new Date().toISOString(), read: false }
    setNotifications((prev) => [n, ...prev])
    return id
  }, [])

  const markAsRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllRead,
    clearNotifications,
    unreadCount,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export default NotificationProvider
