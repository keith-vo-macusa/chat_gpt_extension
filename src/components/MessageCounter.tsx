import React from 'react'

interface MessageCounterProps {
  currentIndex: number
  totalMessages: number
  isLoading?: boolean
}

export const MessageCounter: React.FC<MessageCounterProps> = ({
  currentIndex,
  totalMessages,
  isLoading = false
}) => {
  if (totalMessages === 0 && !isLoading) return null

  return (
    <div className="message-counter-floating">
      {isLoading ? (
        <span className="loading-indicator">⏳</span>
      ) : (
        `${currentIndex + 1}/${totalMessages}`
      )}
    </div>
  )
}
