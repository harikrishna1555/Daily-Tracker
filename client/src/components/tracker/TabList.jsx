import React from 'react'
import IconMap from '../../utils/iconMap'

export default function TabList({ tabs = [], selectedTabId, onSelect }) {
  const safeTabs = Array.isArray(tabs) ? tabs : []

  return (
    <div className="space-y-3">
      {safeTabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect && onSelect(t)}
          className={`w-full text-left rounded-xl px-4 py-3 transition-colors duration-150 ${selectedTabId === t.id ? 'bg-amber-500 text-black shadow-lg' : 'bg-[#111827] text-gray-200 hover:bg-[#0b1220]'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="text-xl">{IconMap[t.icon] || IconMap.Folder}</div>
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-gray-400">Position: {t.position ?? 0}</div>
              </div>
            </div>
            <div className="text-sm text-gray-300">{t.count ?? ''}</div>
          </div>
        </button>
      ))}
      {safeTabs.length === 0 && (
        <div className="rounded-xl bg-[#111827] p-4 text-gray-400">No tabs yet</div>
      )}
    </div>
  )
}
