import React from 'react'
import './LoadingSpinner.css'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  centered?: boolean
  message?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  centered = false,
  message = 'Loading...'
}) => {
  const sizeClass = `spinner-${size}`
  const centerClass = centered ? 'spinner-centered' : ''

  return (
    <div className={`spinner-container ${centerClass}`}>
      <div className={`loading-spinner ${sizeClass}`}></div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  )
}

export default LoadingSpinner