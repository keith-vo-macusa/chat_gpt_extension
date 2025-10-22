import { UserMessage } from '../types'

export interface ExportOptions {
  format: 'txt' | 'md' | 'json' | 'csv'
  includeTimestamps: boolean
  includeMessageNumbers: boolean
  includeMetadata: boolean
  dateRange?: {
    start: Date
    end: Date
  }
  messageFilter?: (message: UserMessage) => boolean
}

export interface ConversationMetadata {
  title: string
  url: string
  exportDate: string
  messageCount: number
  totalCharacters: number
  dateRange: {
    start: string
    end: string
  }
}

export class ExportService {
  private static instance: ExportService

  static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService()
    }
    return ExportService.instance
  }

  async exportMessages(
    messages: UserMessage[],
    options: ExportOptions = {
      format: 'txt',
      includeTimestamps: false,
      includeMessageNumbers: true,
      includeMetadata: true
    }
  ): Promise<Blob> {
    const metadata = this.generateMetadata(messages)
    const filteredMessages = this.filterMessages(messages, options)

    switch (options.format) {
      case 'txt':
        return this.exportAsText(filteredMessages, metadata, options)
      case 'md':
        return this.exportAsMarkdown(filteredMessages, metadata, options)
      case 'json':
        return this.exportAsJSON(filteredMessages, metadata, options)
      case 'csv':
        return this.exportAsCSV(filteredMessages, metadata, options)
      default:
        throw new Error(`Unsupported export format: ${options.format}`)
    }
  }

  private generateMetadata(messages: UserMessage[]): ConversationMetadata {
    const now = new Date()
    const totalCharacters = messages.reduce((sum, msg) => sum + msg.text.length, 0)

    return {
      title: this.extractConversationTitle(),
      url: window.location.href,
      exportDate: now.toISOString(),
      messageCount: messages.length,
      totalCharacters,
      dateRange: {
        start: now.toISOString(),
        end: now.toISOString()
      }
    }
  }

  private extractConversationTitle(): string {
    // Try to extract title from page
    const titleElement = document.querySelector('title')
    if (titleElement) {
      return titleElement.textContent?.replace('ChatGPT', '').trim() || 'ChatGPT Conversation'
    }
    return 'ChatGPT Conversation'
  }

  private filterMessages(messages: UserMessage[], options: ExportOptions): UserMessage[] {
    let filtered = [...messages]

    // Apply custom filter
    if (options.messageFilter) {
      filtered = filtered.filter(options.messageFilter)
    }

    // Apply date range filter
    if (options.dateRange) {
      filtered = filtered.filter(msg => {
        // For now, we'll use current time as message time
        // In a real implementation, you'd extract actual message timestamps
        const messageTime = new Date()
        return messageTime >= options.dateRange!.start && messageTime <= options.dateRange!.end
      })
    }

    return filtered
  }

  private async exportAsText(
    messages: UserMessage[],
    metadata: ConversationMetadata,
    options: ExportOptions
  ): Promise<Blob> {
    let content = ''

    if (options.includeMetadata) {
      content += `# ${metadata.title}\n\n`
      content += `**Export Date:** ${new Date(metadata.exportDate).toLocaleString()}\n`
      content += `**Message Count:** ${metadata.messageCount}\n`
      content += `**Total Characters:** ${metadata.totalCharacters}\n`
      content += `**URL:** ${metadata.url}\n\n`
      content += '---\n\n'
    }

    messages.forEach((message, index) => {
      if (options.includeMessageNumbers) {
        content += `## Message ${index + 1}\n\n`
      }

      if (options.includeTimestamps) {
        content += `*Exported: ${new Date().toLocaleString()}*\n\n`
      }

      content += `${message.text}\n\n`
    })

    return new Blob([content], { type: 'text/plain;charset=utf-8' })
  }

  private async exportAsMarkdown(
    messages: UserMessage[],
    metadata: ConversationMetadata,
    options: ExportOptions
  ): Promise<Blob> {
    let content = ''

    if (options.includeMetadata) {
      content += `# ${metadata.title}\n\n`
      content += `> **Export Information**\n`
      content += `> - **Date:** ${new Date(metadata.exportDate).toLocaleString()}\n`
      content += `> - **Messages:** ${metadata.messageCount}\n`
      content += `> - **Characters:** ${metadata.totalCharacters}\n`
      content += `> - **Source:** [ChatGPT](${metadata.url})\n\n`
      content += '---\n\n'
    }

    messages.forEach((message, index) => {
      content += `## ${options.includeMessageNumbers ? `Message ${index + 1}` : 'User Message'}\n\n`

      if (options.includeTimestamps) {
        content += `*${new Date().toLocaleString()}*\n\n`
      }

      // Format message text as markdown
      const formattedText = this.formatAsMarkdown(message.text)
      content += `${formattedText}\n\n`
    })

    return new Blob([content], { type: 'text/markdown;charset=utf-8' })
  }

  private async exportAsJSON(
    messages: UserMessage[],
    metadata: ConversationMetadata,
    options: ExportOptions
  ): Promise<Blob> {
    const exportData = {
      metadata,
      messages: messages.map((msg, index) => ({
        index: index + 1,
        text: msg.text,
        timestamp: new Date().toISOString(),
        characterCount: msg.text.length,
        wordCount: msg.text.split(/\s+/).length
      })),
      exportOptions: options
    }

    const content = JSON.stringify(exportData, null, 2)
    return new Blob([content], { type: 'application/json;charset=utf-8' })
  }

  private async exportAsCSV(
    messages: UserMessage[],
    metadata: ConversationMetadata,
    options: ExportOptions
  ): Promise<Blob> {
    let content = ''

    // CSV Header
    const headers = ['Message Number', 'Text', 'Character Count', 'Word Count']
    if (options.includeTimestamps) {
      headers.splice(1, 0, 'Timestamp')
    }
    content += headers.join(',') + '\n'

    // CSV Data
    messages.forEach((message, index) => {
      const row = [
        (index + 1).toString(),
        `"${message.text.replace(/"/g, '""')}"`, // Escape quotes
        message.text.length.toString(),
        message.text.split(/\s+/).length.toString()
      ]

      if (options.includeTimestamps) {
        row.splice(1, 0, new Date().toISOString())
      }

      content += row.join(',') + '\n'
    })

    return new Blob([content], { type: 'text/csv;charset=utf-8' })
  }

  private formatAsMarkdown(text: string): string {
    // Basic markdown formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '**$1**') // Bold
      .replace(/\*(.*?)\*/g, '*$1*') // Italic
      .replace(/`(.*?)`/g, '`$1`') // Code
      .replace(/\n/g, '\n\n') // Double line breaks for paragraphs
  }

  async downloadFile(blob: Blob, filename: string): Promise<void> {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  generateFilename(format: string, metadata: ConversationMetadata): string {
    const timestamp = new Date().toISOString().split('T')[0]
    const title = metadata.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50)
    return `chatgpt_${title}_${timestamp}.${format}`
  }

  // Get conversation statistics
  getConversationStats(messages: UserMessage[]): {
    totalMessages: number
    totalCharacters: number
    totalWords: number
    averageMessageLength: number
    longestMessage: UserMessage | null
    shortestMessage: UserMessage | null
  } {
    if (messages.length === 0) {
      return {
        totalMessages: 0,
        totalCharacters: 0,
        totalWords: 0,
        averageMessageLength: 0,
        longestMessage: null,
        shortestMessage: null
      }
    }

    const totalCharacters = messages.reduce((sum, msg) => sum + msg.text.length, 0)
    const totalWords = messages.reduce((sum, msg) => sum + msg.text.split(/\s+/).length, 0)
    const averageMessageLength = totalCharacters / messages.length

    const longestMessage = messages.reduce((longest, current) =>
      current.text.length > longest.text.length ? current : longest
    )

    const shortestMessage = messages.reduce((shortest, current) =>
      current.text.length < shortest.text.length ? current : shortest
    )

    return {
      totalMessages: messages.length,
      totalCharacters,
      totalWords,
      averageMessageLength: Math.round(averageMessageLength),
      longestMessage,
      shortestMessage
    }
  }
}
