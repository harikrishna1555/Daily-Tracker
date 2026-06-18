import React from 'react'

export default function PageHeader({ title, children }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-white">{title}</h1>
      <div>{children}</div>
    </div>
  )
}
