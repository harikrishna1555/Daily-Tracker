import React from 'react'

export default function LoadingSpinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-[#F59E0B] border-gray-700" />
    </div>
  )
}
