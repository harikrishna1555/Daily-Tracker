import React from 'react'
import PageHeader from '../components/PageHeader'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'

const weekly = [
  { day: 'Mon', percent: 60 },
  { day: 'Tue', percent: 70 },
  { day: 'Wed', percent: 50 },
  { day: 'Thu', percent: 80 },
  { day: 'Fri', percent: 90 },
  { day: 'Sat', percent: 75 },
  { day: 'Sun', percent: 65 },
]

const monthly = Array.from({ length: 12 }).map((_, i) => ({ month: `M${i + 1}`, percent: Math.round(50 + Math.random() * 50) }))

const activityPerf = [
  { name: 'Hydration', completed: 120 },
  { name: 'Exercise', completed: 90 },
  { name: 'Reading', completed: 60 },
]

export default function Reports() {
  return (
    <div>
      <PageHeader title="Reports" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-[#1F2937] p-4 text-white">
          <h3 className="mb-3 font-semibold">Weekly Completion</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={weekly}>
                <CartesianGrid stroke="#111827" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Line type="monotone" dataKey="percent" stroke="#F59E0B" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg bg-[#1F2937] p-4 text-white">
          <h3 className="mb-3 font-semibold">Monthly Completion</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={monthly}>
                <CartesianGrid stroke="#111827" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="percent" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2 rounded-lg bg-[#1F2937] p-4 text-white">
          <h3 className="mb-3 font-semibold">Activity Performance</h3>
          <div style={{ height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={activityPerf} layout="vertical">
                <CartesianGrid stroke="#111827" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="name" type="category" stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="completed" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
