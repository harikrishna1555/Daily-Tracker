import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8">
          <div className="rounded-lg bg-[#1F2937] p-6 text-white">
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="mt-2 text-sm text-gray-300">An unexpected error occurred. Try refreshing the page.</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
