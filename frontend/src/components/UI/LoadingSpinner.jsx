import React from 'react'

const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const colorClasses = {
    primary: 'border-green-500',
    white: 'border-white',
    gray: 'border-gray-500'
  }

  return (
    <div className="flex justify-center items-center p-4">
      <div
        className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
      />
    </div>
  )
}

export default LoadingSpinner
