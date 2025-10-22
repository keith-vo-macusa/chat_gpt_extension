import React from 'react'
import { NavigationButton } from './NavigationButton'
import { MessageCounter } from './MessageCounter'
import { UserMessage } from '../types'

interface NavigationPanelProps {
  userMessages: UserMessage[]
  currentIndex: number
  onPrevious: () => void
  onNext: () => void
  onCopy: () => void
}

export const NavigationPanel: React.FC<NavigationPanelProps> = ({
  userMessages,
  currentIndex,
  onPrevious,
  onNext,
  onCopy
}) => {
  return (
    <div className="chatgpt-message-navigator-panel">
      {/* Main navigation buttons */}
      <div className="nav-buttons-group">
        {/* Previous button (older message) */}
        <NavigationButton
          onClick={onPrevious}
          disabled={userMessages.length === 0}
          title={`Older message (${currentIndex + 1}/${userMessages.length}) - Ctrl+↑`}
          className="nav-button-prev"
        >
          ▲
        </NavigationButton>

        {/* Next button (newer message) */}
        <NavigationButton
          onClick={onNext}
          disabled={userMessages.length === 0}
          title={`Newer message (${currentIndex + 1}/${userMessages.length}) - Ctrl+↓`}
          className="nav-button-next"
        >
          ▼
        </NavigationButton>

        {/* Copy button */}
        {userMessages.length > 0 && (
          <NavigationButton
            onClick={onCopy}
            title="Copy current message - Ctrl+C"
            disabled={false}
            className="nav-button-copy"
          >
            📄
          </NavigationButton>
        )}
      </div>

      {/* Message counter */}
      <MessageCounter
        currentIndex={currentIndex}
        totalMessages={userMessages.length}
      />
    </div>
  )
}
