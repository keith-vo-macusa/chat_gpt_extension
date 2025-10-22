export interface NotificationSettings {
  enabled: boolean
  sound: boolean
  vibration: boolean
  showPreview: boolean
  customMessage: string
  autoClose: boolean
  closeDelay: number // in seconds
}

export class NotificationService {
  private static readonly STORAGE_KEY = 'chatgpt-notification-settings'
  private static readonly PERMISSION_KEY = 'chatgpt-notification-permission'

  private static settings: NotificationSettings = {
    enabled: true,
    sound: true,
    vibration: false,
    showPreview: true,
    customMessage: 'ChatGPT has finished responding! 🎉',
    autoClose: true,
    closeDelay: 5
  }

  // Initialize notification service
  static async initialize(): Promise<boolean> {
    try {
      // Load settings from storage
      this.loadSettings()

      // Request permission if not granted
      if (this.settings.enabled) {
        const permission = await this.requestPermission()
        return permission === 'granted'
      }

      return true
    } catch (error) {
      console.error('Error initializing notification service:', error)
      return false
    }
  }

  // Request notification permission
  static async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return 'denied'
    }

    if (Notification.permission === 'granted') {
      return 'granted'
    }

    if (Notification.permission === 'denied') {
      return 'denied'
    }

    const permission = await Notification.requestPermission()
    localStorage.setItem(this.PERMISSION_KEY, permission)
    return permission
  }

  // Check if notifications are supported and enabled
  static isSupported(): boolean {
    return 'Notification' in window && this.settings.enabled
  }

  // Check if permission is granted
  static hasPermission(): boolean {
    return Notification.permission === 'granted'
  }

  // Show notification when ChatGPT responds
  static async notifyResponse(message?: string): Promise<void> {
    if (!this.isSupported() || !this.hasPermission()) {
      return
    }

    try {
      const notificationMessage = message || this.settings.customMessage

      const notification = new Notification('ChatGPT Response Ready', {
        body: notificationMessage,
        icon: this.getIconUrl(),
        badge: this.getBadgeUrl(),
        tag: 'chatgpt-response',
        requireInteraction: !this.settings.autoClose,
        silent: !this.settings.sound,
        vibrate: this.settings.vibration ? [200, 100, 200] : undefined
      })

      // Auto close notification
      if (this.settings.autoClose) {
        setTimeout(() => {
          notification.close()
        }, this.settings.closeDelay * 1000)
      }

      // Handle notification click
      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      // Play sound if enabled
      if (this.settings.sound) {
        this.playNotificationSound()
      }

    } catch (error) {
      console.error('Error showing notification:', error)
    }
  }

  // Show test notification
  static async showTestNotification(): Promise<void> {
    if (!this.isSupported() || !this.hasPermission()) {
      throw new Error('Notifications not supported or permission denied')
    }

    await this.notifyResponse('This is a test notification! 🔔')
  }

  // Get current settings
  static getSettings(): NotificationSettings {
    return { ...this.settings }
  }

  // Update settings
  static updateSettings(newSettings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...newSettings }
    this.saveSettings()

    // Restart monitoring if enabled status changed
    if (newSettings.enabled !== undefined) {
      if (newSettings.enabled) {
        this.startMonitoring()
      } else {
        this.stopMonitoring()
      }
    }
  }

  // Load settings from storage
  private static loadSettings(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        this.settings = { ...this.settings, ...JSON.parse(stored) }
      }
    } catch (error) {
      console.error('Error loading notification settings:', error)
    }
  }

  // Save settings to storage
  private static saveSettings(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings))
    } catch (error) {
      console.error('Error saving notification settings:', error)
    }
  }

  // Get icon URL for notification
  private static getIconUrl(): string {
    // Use a data URL for a simple icon
    return 'data:image/svg+xml;base64,' + btoa(`
      <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="#10a37f"/>
        <path d="M20 32l8 8 16-16" stroke="white" stroke-width="4" fill="none"/>
      </svg>
    `)
  }

  // Get badge URL for notification
  private static getBadgeUrl(): string {
    return 'data:image/svg+xml;base64,' + btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#10a37f"/>
        <path d="M8 12l2 2 4-4" stroke="white" stroke-width="2" fill="none"/>
      </svg>
    `)
  }

  // Play notification sound
  private static playNotificationSound(): void {
    try {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.warn('Could not play notification sound:', error)
    }
  }

  // Monitor ChatGPT responses
  static startMonitoring(): void {
    if (!this.isSupported() || !this.settings.enabled) return

    let lastResponseTime = 0
    let isWaitingForResponse = false
    let lastMessageCount = 0
    let responseCheckInterval: number | null = null

    // Function to check if ChatGPT is still typing/streaming
    const isChatGPTTyping = (): boolean => {
      // Check for streaming indicators
      const streamingIndicators = [
        '[data-testid="stop-button"]', // Stop button means still streaming
        '.result-streaming', // Streaming class
        '[data-testid="conversation-turn-3"] .animate-pulse', // Pulsing animation
        '.typing-indicator', // Typing indicator
        '.streaming-text', // Streaming text class
        '[data-testid="conversation-turn-3"] button[aria-label*="Stop"]', // Stop button in conversation
        '.animate-spin', // Spinning animation
        '[data-testid="conversation-turn-3"] .animate-pulse', // Pulsing in conversation
        '.cursor-blink', // Cursor blinking
        '.typing-cursor' // Typing cursor
      ]

      for (const selector of streamingIndicators) {
        if (document.querySelector(selector)) {
          return true
        }
      }

      // Check if there's a cursor or blinking element
      const cursorElements = document.querySelectorAll('.cursor, .blink, .animate-blink, .cursor-blink')
      if (cursorElements.length > 0) {
        return true
      }

      // Check for any element with streaming-related classes
      const streamingElements = document.querySelectorAll('[class*="streaming"], [class*="typing"], [class*="loading"]')
      if (streamingElements.length > 0) {
        return true
      }

      return false
    }

    // Function to check if response is complete
    const isResponseComplete = (): boolean => {
      const assistantMessages = document.querySelectorAll('[data-message-author-role="assistant"]')

      if (assistantMessages.length === 0) return false

      const lastMessage = assistantMessages[assistantMessages.length - 1]

      // Check if message is complete (no streaming indicators)
      const isComplete = !isChatGPTTyping()

      // Additional check: ensure message has substantial content
      const messageText = lastMessage.textContent || ''
      const hasContent = messageText.trim().length > 10

      return isComplete && hasContent
    }

    // Monitor for new messages and response completion
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const assistantMessages = document.querySelectorAll('[data-message-author-role="assistant"]')

          // Check if new message appeared
          if (assistantMessages.length > lastMessageCount) {
            lastMessageCount = assistantMessages.length
            isWaitingForResponse = true

            // Start checking for completion
            if (responseCheckInterval) {
              clearInterval(responseCheckInterval)
            }

            responseCheckInterval = window.setInterval(() => {
              if (isResponseComplete() && isWaitingForResponse) {
                const messageTime = Date.now()

                if (messageTime > lastResponseTime) {
                  lastResponseTime = messageTime
                  isWaitingForResponse = false

                  // Clear the interval
                  if (responseCheckInterval) {
                    clearInterval(responseCheckInterval)
                    responseCheckInterval = null
                  }

                  // Get the response text for preview
                  const lastMessage = assistantMessages[assistantMessages.length - 1]
                  const responseText = lastMessage.textContent || ''
                  const preview = this.settings.showPreview && responseText.length > 0
                    ? `"${responseText.substring(0, 100)}${responseText.length > 100 ? '...' : ''}"`
                    : ''

                  console.log('ChatGPT response completed, showing notification')
                  this.notifyResponse(preview)
                }
              }
            }, 500) // Check every 500ms
          }
        }
      })
    })

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // Monitor for user sending messages
    const inputObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Check if user sent a message (send button becomes disabled)
          const sendButton = document.querySelector('[data-testid="send-button"]')
          if (sendButton && sendButton.hasAttribute('disabled')) {
            isWaitingForResponse = true
            console.log('User sent message, waiting for ChatGPT response...')
          }
        }
      })
    })

    inputObserver.observe(document.body, {
      childList: true,
      subtree: true
    })

    console.log('ChatGPT response monitoring started with improved detection')
  }

  // Stop monitoring
  static stopMonitoring(): void {
    // Note: In a real implementation, you'd store observer references and disconnect them
    console.log('ChatGPT response monitoring stopped')
  }

  // Get monitoring status
  static getMonitoringStatus(): { enabled: boolean; supported: boolean; permission: boolean } {
    return {
      enabled: this.settings.enabled,
      supported: this.isSupported(),
      permission: this.hasPermission()
    }
  }

  // Debug function to check current state
  static debugCurrentState(): void {
    const assistantMessages = document.querySelectorAll('[data-message-author-role="assistant"]')

    // Check for streaming indicators (same logic as isChatGPTTyping)
    const streamingIndicators = [
      '[data-testid="stop-button"]',
      '.result-streaming',
      '[data-testid="conversation-turn-3"] .animate-pulse',
      '.typing-indicator',
      '.streaming-text',
      '[data-testid="conversation-turn-3"] button[aria-label*="Stop"]',
      '.animate-spin',
      '.cursor-blink',
      '.typing-cursor'
    ]

    let isTyping = false
    for (const selector of streamingIndicators) {
      if (document.querySelector(selector)) {
        isTyping = true
        break
      }
    }

    console.log('=== Notification Debug Info ===')
    console.log('Settings:', this.settings)
    console.log('Supported:', this.isSupported())
    console.log('Permission:', this.hasPermission())
    console.log('Assistant messages count:', assistantMessages.length)
    console.log('Is ChatGPT typing:', isTyping)

    if (assistantMessages.length > 0) {
      const lastMessage = assistantMessages[assistantMessages.length - 1]
      console.log('Last message text length:', lastMessage.textContent?.length || 0)
      console.log('Last message preview:', lastMessage.textContent?.substring(0, 100))
    }

    console.log('===============================')
  }
}
