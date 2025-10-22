import React from 'react'
import { createRoot } from 'react-dom/client'

const Popup: React.FC = () => {
  return (
    <div style={{
      width: '300px',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2>ChatGPT Message Navigator</h2>
      <p>Navigate between your messages in ChatGPT conversations.</p>
      <p><strong>Features:</strong></p>
      <ul>
        <li>⬆️⬇️ Navigate between messages</li>
        <li>🎯 Highlight current message</li>
        <li>📋 Copy message to clipboard</li>
        <li>📊 Message counter</li>
      </ul>
      <p>Go to any ChatGPT conversation to start using the extension!</p>
    </div>
  )
}

// Render popup
const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(<Popup />)
}
