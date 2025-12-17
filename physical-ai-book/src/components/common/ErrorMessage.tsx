import React from 'react'
import './ErrorMessage.css'

interface ErrorMessageProps {
  message: string
  onDismiss?: () => void
  showIcon?: boolean
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onDismiss,
  showIcon = true
}) => {
  return (
    <div className="error-message-container">
      {showIcon && <span className="error-icon">⚠️</span>}
      <span className="error-message-text">{message}</span>
      {onDismiss && (
        <button className="error-dismiss-button" onClick={onDismiss} aria-label="Dismiss error">
          ×
        </button>
      )}
    </div>
  )
}

export default ErrorMessage