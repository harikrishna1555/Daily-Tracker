import React from 'react'
import StatCard from '../components/StatCard'
import PageHeader from '../components/PageHeader'
import { FiActivity, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi'

const mockStats = [
  { title: "Today's Progress", value: '62%', subtitle: 'Completed 8 of 13', icon: <FiTrendingUp size={28} /> },
  { title: 'Completed Activities', value: 8, subtitle: 'Today', icon: <FiCheckCircle size={28} /> },
  { title: 'Pending Activities', value: 5, subtitle: 'Today', icon: <FiClock size={28} /> },
  { title: 'Current Streak', value: '5 days', subtitle: 'Streak', icon: <FiActivity size={28} /> },
]

const recent = [
  { id: 1, text: 'Completed Drink Water', time: '2m ago' },
  { id: 2, text: 'Completed Morning Run', time: '1h ago' },
  { id: 3, text: 'Added Reading activity', time: 'Yesterday' },
]

const summary = [
  { id: 1, title: 'Hydration', desc: '5/8 glasses' },
  { id: 2, title: 'Exercise', desc: '30 min' },
  { id: 3, title: 'Reading', desc: '20 pages' },
]

export default function Dashboard() {
  return (
    <div>
      <PageHeader title="Dashboard" />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((s) => (
          <StatCard key={s.title} title={s.title} value={s.value} subtitle={s.subtitle} icon={s.icon} />
        ))}
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2 rounded-lg bg-[#1F2937] p-4 text-white">
          <h2 className="mb-3 text-lg font-semibold">Recent Activity</h2>
          <ul className="space-y-3">
            {recent.map((r) => (
              <li key={r.id} className="flex items-center justify-between rounded-md border border-transparent px-3 py-2 hover:bg-[#111827]/40">
                <div className="text-sm">{r.text}</div>
                <div className="text-xs text-gray-400">{r.time}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-[#1F2937] p-4 text-white">
          <h2 className="mb-3 text-lg font-semibold">Today's Summary</h2>
          <ul className="space-y-3">
            {summary.map((s) => (
              <li key={s.id} className="rounded-md border border-transparent px-3 py-2 hover:bg-[#111827]/40">
                <div className="text-sm font-medium">{s.title}</div>
                <div className="text-sm text-gray-300">{s.desc}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
