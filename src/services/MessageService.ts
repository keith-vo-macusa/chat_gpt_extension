import { UserMessage } from '../types'

export class MessageService {
  static findUserMessages(): UserMessage[] {
    const messages: UserMessage[] = []
    const conversationContainer = this.getConversationRoot()
    console.log('ChatGPT Message Navigator: Conversation container:', conversationContainer)

    // Debug DOM structure
    this.debugDOMStructure(conversationContainer)

    const userMessageElements = this.getUserMessageElements(conversationContainer)
    console.log('ChatGPT Message Navigator: Raw user message elements:', userMessageElements.length)

    userMessageElements.forEach((htmlElement, index) => {
      const text = this.extractMessageText(htmlElement)
      console.log(`ChatGPT Message Navigator: Element ${index}:`, {
        text: text.substring(0, 100),
        className: htmlElement.className,
        tagName: htmlElement.tagName,
        textLength: text.length,
        innerHTML: htmlElement.innerHTML.substring(0, 200)
      })

      // More lenient filtering - only exclude obvious non-messages
      if (text.length > 0 &&
          !text.includes('ChatGPT') &&
          !text.includes('Assistant') &&
          !text.includes('AI') &&
          !text.includes('Anh vừa gửi') && // Exclude AI responses
          !text.includes('có thể nói rõ hơn')) {

        messages.push({
          element: htmlElement,
          text: text,
          index: messages.length
        })
        console.log(`ChatGPT Message Navigator: Added message ${messages.length}: "${text.substring(0, 50)}..."`)
      } else {
        console.log(`ChatGPT Message Navigator: Skipped element ${index}: "${text.substring(0, 50)}..."`)
      }
    })

    // Sort messages by their position in the DOM
    messages.sort((a, b) => {
      const position = a.element.compareDocumentPosition(b.element)
      return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    })

    console.log(`ChatGPT Message Navigator: Final count: ${messages.length} user messages`)
    return messages
  }

  private static getConversationRoot(): Element {
    const SELECTORS = [
      '[role="main"]',
      'main',
      '[class*="conversation"]',
      '[class*="chat"]'
    ]

    for (const selector of SELECTORS) {
      const el = document.querySelector(selector)
      if (el) return el
    }
    return document.body
  }

  private static getUserMessageElements(root: Element): HTMLElement[] {
    // Try multiple selectors for different ChatGPT versions
    const selectors = [
      '[data-message-author-role="user"]',
      '[data-author-role="user"]',
      '[data-message-author="user"]',
      '[data-author="user"]',
      '[class*="user-message"]',
      '[class*="user-turn"]',
      'div[class*="group"][class*="user"]',
      'div[class*="message"][class*="user"]',
      // More specific selectors for newer ChatGPT
      'div[class*="group"]:has([data-message-author-role="user"])',
      'div[class*="turn"]:has([data-message-author-role="user"])',
      'div[class*="conversation"]:has([data-message-author-role="user"])'
    ]

    let userMessages: HTMLElement[] = []

    for (const selector of selectors) {
      try {
        const elements = Array.from(root.querySelectorAll(selector)) as HTMLElement[]
        if (elements.length > 0) {
          console.log(`ChatGPT Message Navigator: Found ${elements.length} messages with selector: ${selector}`)
          userMessages = elements
          break
        }
      } catch (e) {
        console.log(`ChatGPT Message Navigator: Selector ${selector} failed:`, e)
      }
    }

    // If no specific user messages found, try to find any message-like elements
    if (userMessages.length === 0) {
      console.log('ChatGPT Message Navigator: No user messages found with standard selectors, trying fallback...')

      // Strategy 1: Look for divs with specific patterns
      const allDivs = Array.from(root.querySelectorAll('div')) as HTMLElement[]
      userMessages = allDivs.filter(div => {
        const text = div.textContent?.trim() || ''
        const className = div.className || ''
        const hasUserRole = div.hasAttribute('data-message-author-role') &&
                           div.getAttribute('data-message-author-role') === 'user'

        return (hasUserRole ||
                (text.length > 2 &&
                 text.length < 1000 && // Not too long (likely not a full conversation)
                 !text.includes('ChatGPT') &&
                 !text.includes('Assistant') &&
                 !text.includes('AI') &&
                 !text.includes('Anh vừa gửi') &&
                 !text.includes('có thể nói rõ hơn') &&
                 (className.includes('message') ||
                  className.includes('turn') ||
                  className.includes('group') ||
                  className.includes('user'))))
      })

      console.log(`ChatGPT Message Navigator: Fallback found ${userMessages.length} potential messages`)

      // Strategy 2: If still no messages, try a more aggressive approach
      if (userMessages.length === 0) {
        console.log('ChatGPT Message Navigator: Trying aggressive fallback...')
        const allElements = Array.from(root.querySelectorAll('*')) as HTMLElement[]
        userMessages = allElements.filter(el => {
          const text = el.textContent?.trim() || ''
          return text.length > 1 &&
                 text.length < 100 &&
                 !text.includes('ChatGPT') &&
                 !text.includes('Assistant') &&
                 !text.includes('AI') &&
                 !text.includes('Anh vừa gửi') &&
                 !text.includes('có thể nói rõ hơn') &&
                 el.children.length === 0 // Leaf nodes only
        })
        console.log(`ChatGPT Message Navigator: Aggressive fallback found ${userMessages.length} potential messages`)
      }
    }

    return userMessages
  }

  private static extractMessageText(el: HTMLElement): string {
    // Try multiple text extraction strategies
    const textSelectors = [
      '.whitespace-pre-wrap',
      '[class*="whitespace-pre-wrap"]',
      '[class*="markdown"]',
      '[class*="prose"]',
      'p',
      'div[class*="text"]',
      'span[class*="text"]'
    ]

    // First try to find text in message bubble
    const bubble = this.findMessageBubble(el)
    if (bubble) {
      for (const selector of textSelectors) {
        const textEl = bubble.querySelector(selector) as HTMLElement
        if (textEl && textEl.textContent?.trim()) {
          return textEl.textContent.trim()
        }
      }
    }

    // Then try to find text in the element itself
    for (const selector of textSelectors) {
      const textEl = el.querySelector(selector) as HTMLElement
      if (textEl && textEl.textContent?.trim()) {
        return textEl.textContent.trim()
      }
    }

    // Fallback to direct text content
    return el.textContent?.trim() || ''
  }

  private static findMessageBubble(el: HTMLElement): HTMLElement | null {
    const bubbleSelectors = [
      '.user-message-bubble-color',
      '[class*="user-message-bubble"]',
      '[class*="message-bubble"]',
      '[class*="bubble"]',
      '[class*="content"]',
      'div[class*="group"]'
    ]

    for (const selector of bubbleSelectors) {
      const bubble = el.querySelector(selector) as HTMLElement
      if (bubble) return bubble
    }

    return null
  }

  private static debugDOMStructure(container: Element): void {
    console.log('ChatGPT Message Navigator: === DOM DEBUG ===')

    // Check for common ChatGPT selectors
    const commonSelectors = [
      '[data-message-author-role]',
      '[data-author-role]',
      '[class*="message"]',
      '[class*="turn"]',
      '[class*="group"]',
      '[class*="conversation"]'
    ]

    commonSelectors.forEach(selector => {
      const elements = container.querySelectorAll(selector)
      console.log(`ChatGPT Message Navigator: Found ${elements.length} elements with selector: ${selector}`)
      if (elements.length > 0) {
        Array.from(elements).slice(0, 3).forEach((el, i) => {
          console.log(`  Element ${i}:`, {
            tagName: el.tagName,
            className: el.className,
            textContent: el.textContent?.substring(0, 50),
            attributes: Array.from(el.attributes).map(attr => `${attr.name}="${attr.value}"`)
          })
        })
      }
    })

    console.log('ChatGPT Message Navigator: === END DOM DEBUG ===')
  }
}
