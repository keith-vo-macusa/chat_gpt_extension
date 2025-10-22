import { useState, useEffect, useCallback, useRef } from 'react'
import { MessageNavigatorState } from '../types'
import { MessageService } from '../services/MessageService'
import { HighlightService } from '../services/HighlightService'
import { CopyService } from '../services/CopyService'
import { NavigationService } from '../services/NavigationService'
import { createKeyboardHandler } from '../utils/keyboard'

export const useMessageNavigation = (
  onSearch?: () => void,
  onExport?: () => void,
  onHistory?: () => void,
  onPrompt?: () => void,
  onTheme?: () => void,
  onSmartSuggestion?: () => void,
  onCodeMinifier?: () => void
) => {
  const [state, setState] = useState<MessageNavigatorState>({
    userMessages: [],
    currentIndex: 0,
    isVisible: true,
    bookmarks: new Set()
  })

  const keyboardHandler = useRef<((event: KeyboardEvent) => boolean) | null>(null)

  // Find user messages in current conversation only
  const findUserMessages = useCallback(() => {
    return MessageService.findUserMessages()
  }, [])

  // Update messages when page changes
  useEffect(() => {
    let debounceTimer: number | null = null

    const updateMessages = (isInitial = false) => {
      // Clear previous debounce timer
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }

      // Debounce non-initial updates to avoid excessive scanning
      if (!isInitial) {
        debounceTimer = setTimeout(() => {
          performUpdate(isInitial)
        }, 300) // 300ms debounce
      } else {
        performUpdate(isInitial)
      }
    }

    const performUpdate = (isInitial = false) => {
      const messages = findUserMessages()
      const oldLength = state.userMessages.length

      setState(prev => ({ ...prev, userMessages: messages }))

      if (messages.length > 0) {
        // Add copy buttons to all messages
        messages.forEach(message => {
          CopyService.addCopyButtonToMessage(message)
        })

        // Only set to last message when new messages are added (not on initial load)
        if (!isInitial && messages.length > oldLength) {
          const lastIndex = messages.length - 1
          setState(prev => ({ ...prev, currentIndex: lastIndex }))
          // Highlight the last message after a short delay
          setTimeout(() => {
            scrollToMessage(lastIndex)
          }, 100)
        } else if (isInitial && messages.length > 0) {
          // On initial load, just set to last message without scrolling
          const lastIndex = messages.length - 1
          setState(prev => ({ ...prev, currentIndex: lastIndex }))
        }
      } else {
        setState(prev => ({ ...prev, currentIndex: 0 }))
      }
    }

    // Initial update
    updateMessages(true)

    // Set up observer to watch for new messages
    const observer = new MutationObserver(() => {
      updateMessages(false)
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => {
      observer.disconnect()
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [findUserMessages, state.userMessages.length])

  // Navigate to specific message
  const navigateToMessage = useCallback((index: number) => {
    setState(prev => ({ ...prev, currentIndex: index }))
    scrollToMessage(index)
  }, [])

  // Scroll to specific message and highlight it
  const scrollToMessage = useCallback((index: number) => {
    // Re-scan DOM to avoid stale elements
    const freshMessages = MessageService.findUserMessages()
    const message = freshMessages[index]
    if (message) {
      // Update messages in state to keep them fresh
      setState(prev => ({ ...prev, userMessages: freshMessages }))
      // Defer to ensure layout is stable
      setTimeout(() => {
        HighlightService.highlightMessage(message)
        CopyService.addCopyButtonToMessage(message)
      }, 0)
    }
  }, [])

  // Navigate to previous message (older message)
  const goToPrevious = useCallback(() => {
    if (state.userMessages.length === 0) return

    if (state.currentIndex > 0) {
      navigateToMessage(state.currentIndex - 1)
    } else {
      // If at first message, go to last message (wrap around)
      navigateToMessage(state.userMessages.length - 1)
    }
  }, [state.currentIndex, state.userMessages.length, navigateToMessage])

  // Navigate to next message (newer message)
  const goToNext = useCallback(() => {
    if (state.userMessages.length === 0) return

    if (state.currentIndex < state.userMessages.length - 1) {
      navigateToMessage(state.currentIndex + 1)
    } else {
      // If at last message, go to first message (wrap around)
      navigateToMessage(0)
    }
  }, [state.currentIndex, state.userMessages.length, navigateToMessage])

  // Copy current message to clipboard
  const copyCurrentMessage = useCallback(async () => {
    if (state.userMessages[state.currentIndex]) {
      try {
        await CopyService.copyMessage(state.userMessages[state.currentIndex])
      } catch (err) {
        console.error('Failed to copy message:', err)
      }
    }
  }, [state.userMessages, state.currentIndex])

  // Bookmark functionality removed

  // Keyboard shortcuts
  const setupKeyboardShortcuts = useCallback(() => {
    const shortcuts = NavigationService.createNavigationShortcuts(
      state.userMessages,
      state.currentIndex,
      navigateToMessage,
      copyCurrentMessage,
      onSearch,
      onExport,
      onHistory,
      onPrompt,
      onTheme,
      onSmartSuggestion,
      onCodeMinifier
    )

    keyboardHandler.current = createKeyboardHandler(shortcuts)
    document.addEventListener('keydown', keyboardHandler.current)
  }, [state.userMessages, state.currentIndex, navigateToMessage, copyCurrentMessage, onSearch, onExport, onHistory, onPrompt, onTheme, onSmartSuggestion, onCodeMinifier])

  // Setup keyboard shortcuts
  useEffect(() => {
    setupKeyboardShortcuts()
  }, [setupKeyboardShortcuts])

  // Cleanup keyboard shortcuts
  useEffect(() => {
    return () => {
      if (keyboardHandler.current) {
        document.removeEventListener('keydown', keyboardHandler.current)
      }
    }
  }, [])

  return {
    ...state,
    goToPrevious,
    goToNext,
    copyCurrentMessage,
    goToMessage: navigateToMessage
  }
}
