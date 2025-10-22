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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 8l-6 6h12z"/>
          </svg>
        </NavigationButton>

        {/* Next button (newer message) */}
        <NavigationButton
          onClick={onNext}
          disabled={userMessages.length === 0}
          title={`Newer message (${currentIndex + 1}/${userMessages.length}) - Ctrl+↓`}
          className="nav-button-next"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 16l6-6H6z"/>
          </svg>
        </NavigationButton>

        {/* Copy button */}
        {/* {userMessages.length > 0 && (
          <NavigationButton
            onClick={onCopy}
            title="Copy current message - Ctrl+C"
            disabled={false}
            className="nav-button-copy"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 1H8a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2h2a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-4 18H4V7h8v12Zm4-4h-2V5a2 2 0 0 0-2-2H8V3h8v12Z"/>
            </svg>
          </NavigationButton>
        )} */}

        {/* Search button */}
        <NavigationButton
          onClick={onSearch}
          title="Search messages - Ctrl+F"
          disabled={false}
          className="nav-button-search"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="11" cy="11" r="7" stroke="none"/>
            <line x1="18" y1="18" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="2"/>
          </svg>
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22h11a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 17.5 6H10.414l-2.707-2.707A.997.997 0 0 0 7 2H6.5A2.5 2.5 0 0 0 4 4.5v15zM6.5 4H8l3 3h6.5a.5.5 0 0 1 .5.5V10H6V4.5a.5.5 0 0 1 .5-.5zm13 5.5V19.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H8l3 3h7.5a.5.5 0 0 1 .5.5z"/>
          </svg>
        </NavigationButton>

        {/* Export button */}
        {/* <NavigationButton
          onClick={onExport}
          title="Export messages - Ctrl+E"
          disabled={userMessages.length === 0}
          className="nav-button-export"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 20h14a1 1 0 0 0 1-1v-6a1 1 0 1 0-2 0v5H6v-5a1 1 0 1 0-2 0v6a1 1 0 0 0 1 1zm7-18a1 1 0 0 0-1 1v8.586l-2.293-2.293a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l4-4a1 1 0 1 0-1.414-1.414L13 11.586V3a1 1 0 0 0-1-1z"/>
          </svg>
        </NavigationButton> */}

        {/* History button */}
        {/* <NavigationButton
          onClick={onHistory}
          title="View history - Ctrl+H"
          disabled={userMessages.length === 0}
          className="nav-button-history"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21a9 9 0 1 1 9-9 1 1 0 0 1-2 0 7 7 0 1 0-7 7 1 1 0 0 1 0 2zm-1-7V7a1 1 0 0 1 2 0v6a1 1 0 0 1-.55.89l-3 1.5a1 1 0 0 1-.9-1.79z"/>
          </svg>
        </NavigationButton> */}
      </div>

      {/* Message counter */}
      <MessageCounter
        currentIndex={currentIndex}
        totalMessages={userMessages.length}
      />
    </div>
  )
}
