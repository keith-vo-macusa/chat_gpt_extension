import { UserMessage } from '../types'

export class CopyService {
  private static readonly COPY_BUTTON_CLASS = 'chatgpt-copy-button'
  private static readonly COPY_SUCCESS_MS = 2000

  static async copyMessage(message: UserMessage): Promise<void> {
    try {
      await navigator.clipboard.writeText(message.text)
      console.log('Message copied to clipboard')
    } catch (err) {
      console.error('Failed to copy message:', err)
      throw err
    }
  }

  static addCopyButtonToMessage(message: UserMessage): void {
    const messageBubble = this.findMessageBubble(message.element)
    if (!messageBubble) return

    // Check if copy button already exists
    if (messageBubble.querySelector(`.${this.COPY_BUTTON_CLASS}`)) return

    // Create copy button
    const copyButton = document.createElement('button')
    copyButton.className = this.COPY_BUTTON_CLASS
    copyButton.innerHTML = this.getCopyIcon()
    copyButton.title = 'Copy message'

    // Add click handler
    copyButton.addEventListener('click', async (e) => {
      e.stopPropagation()
      try {
        await this.copyMessage(message)
        this.showCopySuccess(copyButton)
      } catch (err) {
        console.error('Failed to copy message:', err)
      }
    })

    // Add to message bubble
    messageBubble.style.position = 'relative'
    messageBubble.appendChild(copyButton)
  }

  private static findMessageBubble(el: HTMLElement): HTMLElement | null {
    return (el.querySelector('.user-message-bubble-color') as HTMLElement) || null
  }

  private static getCopyIcon(): string {
    return `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 1H8a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2h2a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-4 18H4V7h8v12Zm4-4h-2V5a2 2 0 0 0-2-2H8V3h8v12Z"/>
      </svg>`
  }

  private static getCheckIcon(): string {
    return `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.285 6.708a1 1 0 0 1 .007 1.414l-9 9a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L10 14.586l8.578-8.578a1 1 0 0 1 1.707.7Z"/>
      </svg>`
  }

  private static showCopySuccess(button: HTMLButtonElement): void {
    button.innerHTML = this.getCheckIcon()
    button.style.color = '#10a37f'

    setTimeout(() => {
      button.innerHTML = this.getCopyIcon()
      button.style.color = ''
    }, this.COPY_SUCCESS_MS)
  }
}
