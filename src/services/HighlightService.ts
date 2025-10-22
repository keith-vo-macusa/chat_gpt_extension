import { UserMessage } from '../types'

export class HighlightService {
  private static readonly HIGHLIGHT_CLASS = 'highlighted-message'
  private static readonly UI_DELAYS = {
    highlightDelayMs: 300,
    highlightAutoClearMs: 3000
  }

  static highlightMessage(message: UserMessage): void {
    // Remove previous highlight
    document.querySelectorAll(`.${this.HIGHLIGHT_CLASS}`).forEach(el => {
      el.classList.remove(this.HIGHLIGHT_CLASS)
    })

    // Scroll to message first - try multiple scroll strategies
    this.scrollToElement(message.element)

    // Add highlight after a short delay for better UX
    setTimeout(() => {
      const messageBubble = this.findMessageBubble(message.element)
      if (messageBubble) {
        messageBubble.classList.add(this.HIGHLIGHT_CLASS)
      } else {
        // Fallback: highlight the main element if no bubble found
        message.element.classList.add(this.HIGHLIGHT_CLASS)
      }

      // Auto-remove highlight after 3 seconds
      setTimeout(() => {
        if (messageBubble) {
          messageBubble.classList.remove(this.HIGHLIGHT_CLASS)
        } else {
          message.element.classList.remove(this.HIGHLIGHT_CLASS)
        }
      }, this.UI_DELAYS.highlightAutoClearMs)
    }, this.UI_DELAYS.highlightDelayMs)
  }

  private static scrollToElement(element: HTMLElement): void {
    // Find the main scrollable container (ChatGPT's main chat area)
    const scrollContainer = this.findScrollContainer()

    if (scrollContainer) {
      // Calculate element position relative to scroll container
      const containerRect = scrollContainer.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()

      // Calculate scroll position to center the element
      const scrollTop = scrollContainer.scrollTop +
        (elementRect.top - containerRect.top) -
        (containerRect.height / 2) +
        (elementRect.height / 2)

      // Smooth scroll to calculated position
      scrollContainer.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      })
    } else {
      // Fallback to standard scrollIntoView
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      })
    }
  }

  private static findScrollContainer(): HTMLElement | null {
    // Try to find ChatGPT's main scrollable container
    const selectors = [
      '[data-testid="conversation-turn-3"]',
      '[data-testid="chat-conversation"]',
      '[data-message-author-role]',
      'main',
      '[role="main"]',
      'div[class*="overflow-y-auto"]',
      'div[class*="overflow-auto"]',
      'div[class*="scroll"]'
    ]

    for (const selector of selectors) {
      const element = document.querySelector(selector) as HTMLElement
      if (element && element.scrollHeight > element.clientHeight) {
        return element
      }
    }

    // Fallback to window scroll
    return null
  }

  private static findMessageBubble(el: HTMLElement): HTMLElement | null {
    return (el.querySelector('.user-message-bubble-color') as HTMLElement) || null
  }
}
