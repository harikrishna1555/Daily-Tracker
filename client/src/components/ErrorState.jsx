import React from 'react'

export default function ErrorState({ message = 'Something went wrong' }) {
  return (
    <div className="rounded-lg bg-[#1F2937] p-6 text-center text-white">
      <div className="text-lg font-semibold text-red-400">{message}</div>
    </div>
  )
}
