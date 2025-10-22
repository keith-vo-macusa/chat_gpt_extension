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
  onSearch: () => void
  onExport: () => void
  onHistory: () => void
  onPrompt: () => void
}

export const NavigationPanel: React.FC<NavigationPanelProps> = ({
  userMessages,
  currentIndex,
  onPrevious,
  onNext,
  onCopy,
  onSearch,
  onExport,
  onHistory,
  onPrompt
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

        {/* Search button */}
        <NavigationButton
          onClick={onSearch}
          title="Search messages - Ctrl+F"
          disabled={false}
          className="nav-button-search"
        >
          🔍
        </NavigationButton>
      </div>

      {/* Feature buttons */}
      <div className="feature-buttons-group">
        {/* Prompt button */}
        <NavigationButton
          onClick={onPrompt}
          title="Prompt Manager - Ctrl+P"
          disabled={false}
          className="nav-button-prompt"
        >
          📝
        </NavigationButton>

        {/* Export button */}
        <NavigationButton
          onClick={onExport}
          title="Export messages - Ctrl+E"
          disabled={userMessages.length === 0}
          className="nav-button-export"
        >
          📤
        </NavigationButton>

        {/* History button */}
        <NavigationButton
          onClick={onHistory}
          title="View history - Ctrl+H"
          disabled={userMessages.length === 0}
          className="nav-button-history"
        >
          📚
        </NavigationButton>
      </div>

      {/* Message counter */}
      <MessageCounter
        currentIndex={currentIndex}
        totalMessages={userMessages.length}
      />
    </div>
  )
}
