import React from 'react'
import { NavigationPanel } from './NavigationPanel'
import { useMessageNavigation } from '../hooks/useMessageNavigation'

const MessageNavigator: React.FC = () => {
  const {
    userMessages,
    currentIndex,
    goToPrevious,
    goToNext,
    copyCurrentMessage,
  } = useMessageNavigation()

  return (
    <NavigationPanel
      userMessages={userMessages}
      currentIndex={currentIndex}
      onPrevious={goToPrevious}
      onNext={goToNext}
      onCopy={copyCurrentMessage}
    />
  )
}

export default MessageNavigator
