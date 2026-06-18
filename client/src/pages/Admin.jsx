import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/PageHeader'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorState from '../components/ErrorState'
import * as adminService from '../services/adminService'
import { extractArray } from '../utils/apiHelpers'

export default function Admin() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])
  const [logs, setLogs] = useState([])

  useEffect(() => {
    if (!user || user.role !== 'admin') return
    const load = async () => {
      setLoading(true)
      try {
        const [sRes, uRes, lRes] = await Promise.all([adminService.getStats(), adminService.getUsers(), adminService.getAuditLogs()])
        console.log('Admin stats response:', sRes?.data ?? sRes)
        console.log('Admin users response:', uRes?.data ?? uRes)
        console.log('Admin audit logs response:', lRes?.data ?? lRes)
        setStats(sRes.data || {})
        setUsers(extractArray(uRes))
        setLogs(extractArray(lRes))
      } catch (e) {
        setError('Unable to load admin data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  if (!user || user.role !== 'admin') return <ErrorState message={'Access denied'} />

  return (
    <div>
      <PageHeader title="Admin" />
      {loading && <LoadingSpinner />}
      {error && <ErrorState message={error} />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg bg-[#1F2937] p-4 text-white">
          <div className="text-sm text-gray-300">Users</div>
          <div className="mt-2 text-2xl font-bold">{users.length}</div>
        </div>
        <div className="rounded-lg bg-[#1F2937] p-4 text-white">
          <div className="text-sm text-gray-300">Activities</div>
          <div className="mt-2 text-2xl font-bold">{stats.activityCount ?? '-'}</div>
        </div>
        <div className="rounded-lg bg-[#1F2937] p-4 text-white">
          <div className="text-sm text-gray-300">Audit Logs</div>
          <div className="mt-2 text-2xl font-bold">{Array.isArray(logs) ? logs.length : 0}</div>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-[#1F2937] p-4 text-white">
        <h3 className="mb-3 font-semibold">Recent Audit Logs</h3>
        <div className="overflow-auto">
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="text-left text-gray-300">
                <th className="px-2 py-2">Time</th>
                <th className="px-2 py-2">User</th>
                <th className="px-2 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(logs) ? logs : []).map((l) => (
                <tr key={l.id} className="border-t border-[#111827]">
                  <td className="px-2 py-2 text-gray-300">{l.time || l.created_at}</td>
                  <td className="px-2 py-2">{l.user_name || l.user}</td>
                  <td className="px-2 py-2">{l.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
