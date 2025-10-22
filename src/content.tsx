import React from 'react'
import { createRoot } from 'react-dom/client'
import MessageNavigator from './components/MessageNavigator'
import './content.css'

// Wait for DOM to be ready
const initExtension = () => {
  // Check if we're on ChatGPT
  if (!window.location.hostname.includes('openai.com') && !window.location.hostname.includes('chatgpt.com')) {
    console.log('ChatGPT Message Navigator: Not on ChatGPT domain')
    return
  }

  console.log('ChatGPT Message Navigator: Initializing on', window.location.hostname)

  // Remove existing panel if any
  const existingPanel = document.getElementById('chatgpt-message-navigator')
  if (existingPanel) {
    existingPanel.remove()
  }

  // Create navigation panel
  const navPanel = document.createElement('div')
  navPanel.id = 'chatgpt-message-navigator'
  document.body.appendChild(navPanel)

  // Render React component
  const root = createRoot(navPanel)
  root.render(<MessageNavigator />)

  console.log('ChatGPT Message Navigator: Panel created and rendered')
}

// Initialize when DOM is ready
const initializeExtension = () => {
  try {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initExtension)
    } else {
      initExtension()
    }
  } catch (error) {
    console.error('ChatGPT Message Navigator: Initialization error:', error)
  }
}

// Use setTimeout to ensure proper initialization order
setTimeout(initializeExtension, 0)

// Re-initialize when navigating to new conversations
let currentUrl = window.location.href
const observer = new MutationObserver(() => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href
    // Remove existing panel
    const existingPanel = document.getElementById('chatgpt-message-navigator')
    if (existingPanel) {
      existingPanel.remove()
    }
    // Re-initialize
    setTimeout(initExtension, 1000)
  }
})

observer.observe(document.body, {
  childList: true,
  subtree: true
})
