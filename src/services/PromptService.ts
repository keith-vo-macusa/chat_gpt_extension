import { Prompt, PromptCategory } from '../types'

export class PromptService {
  private static readonly STORAGE_KEY_PROMPTS = 'chatgpt-prompt-manager-prompts'
  private static readonly STORAGE_KEY_CATEGORIES = 'chatgpt-prompt-manager-categories'

  // Default categories
  private static readonly DEFAULT_CATEGORIES: PromptCategory[] = [
    { id: 'general', name: 'General', color: '#6b7280' },
    { id: 'coding', name: 'Coding', color: '#3b82f6' },
    { id: 'writing', name: 'Writing', color: '#10b981' },
    { id: 'analysis', name: 'Analysis', color: '#f59e0b' },
    { id: 'creative', name: 'Creative', color: '#8b5cf6' }
  ]

  // Initialize default data
  static initializeDefaults(): void {
    if (!this.getCategories().length) {
      this.saveCategories(this.DEFAULT_CATEGORIES)
    }
  }

  // Prompt CRUD Operations
  static createPrompt(prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Prompt {
    const newPrompt: Prompt = {
      ...prompt,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const prompts = this.getPrompts()
    prompts.push(newPrompt)
    this.savePrompts(prompts)

    return newPrompt
  }

  static getPrompts(): Prompt[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY_PROMPTS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading prompts:', error)
      return []
    }
  }

  static updatePrompt(id: string, updates: Partial<Omit<Prompt, 'id' | 'createdAt'>>): Prompt | null {
    const prompts = this.getPrompts()
    const index = prompts.findIndex(p => p.id === id)

    if (index === -1) return null

    prompts[index] = {
      ...prompts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    this.savePrompts(prompts)
    return prompts[index]
  }

  static deletePrompt(id: string): boolean {
    const prompts = this.getPrompts()
    const filteredPrompts = prompts.filter(p => p.id !== id)

    if (filteredPrompts.length === prompts.length) return false

    this.savePrompts(filteredPrompts)
    return true
  }

  // Category CRUD Operations
  static createCategory(category: Omit<PromptCategory, 'id'>): PromptCategory {
    const newCategory: PromptCategory = {
      ...category,
      id: this.generateId()
    }

    const categories = this.getCategories()
    categories.push(newCategory)
    this.saveCategories(categories)

    return newCategory
  }

  static getCategories(): PromptCategory[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY_CATEGORIES)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading categories:', error)
      return []
    }
  }

  static updateCategory(id: string, updates: Partial<Omit<PromptCategory, 'id'>>): PromptCategory | null {
    const categories = this.getCategories()
    const index = categories.findIndex(c => c.id === id)

    if (index === -1) return null

    categories[index] = { ...categories[index], ...updates }
    this.saveCategories(categories)
    return categories[index]
  }

  static deleteCategory(id: string): boolean {
    const categories = this.getCategories()
    const filteredCategories = categories.filter(c => c.id !== id)

    if (filteredCategories.length === categories.length) return false

    // Move prompts from deleted category to general
    const prompts = this.getPrompts()
    const updatedPrompts = prompts.map(p =>
      p.category === id ? { ...p, category: 'general' } : p
    )
    this.savePrompts(updatedPrompts)
    this.saveCategories(filteredCategories)

    return true
  }

  // Search and Filter
  static searchPrompts(query: string, categoryId?: string): Prompt[] {
    const prompts = this.getPrompts()
    let filteredPrompts = prompts

    // Filter by category
    if (categoryId) {
      filteredPrompts = filteredPrompts.filter(p => p.category === categoryId)
    }

    // Search in title, content, and tags
    if (query.trim()) {
      const searchTerm = query.toLowerCase()
      filteredPrompts = filteredPrompts.filter(p =>
        p.title.toLowerCase().includes(searchTerm) ||
        p.content.toLowerCase().includes(searchTerm) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    // Sort by updatedAt (newest first)
    return filteredPrompts.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }

  // Injection into ChatGPT input
  static injectPromptToInput(prompt: Prompt): boolean {
    try {
      // Try different selectors for ChatGPT input
      const selectors = [
        'textarea[placeholder*="Message"]',
        'textarea[placeholder*="message"]',
        'div[contenteditable="true"]',
        'textarea',
        'input[type="text"]'
      ]

      let inputElement: HTMLTextAreaElement | HTMLInputElement | HTMLElement | null = null

      for (const selector of selectors) {
        inputElement = document.querySelector(selector) as any
        if (inputElement) break
      }

      if (!inputElement) {
        console.error('Could not find ChatGPT input element')
        return false
      }

      // Handle different input types
      if (inputElement instanceof HTMLTextAreaElement || inputElement instanceof HTMLInputElement) {
        inputElement.value = prompt.content
        inputElement.focus()

        // Trigger input event
        inputElement.dispatchEvent(new Event('input', { bubbles: true }))
      } else if (inputElement instanceof HTMLElement && inputElement.contentEditable === 'true') {
        inputElement.textContent = prompt.content
        inputElement.focus()

        // Trigger input event
        inputElement.dispatchEvent(new Event('input', { bubbles: true }))
      }

      // Show success notification
      this.showInjectionNotification(prompt.title)
      return true

    } catch (error) {
      console.error('Error injecting prompt:', error)
      return false
    }
  }

  // Import/Export
  static exportPrompts(): string {
    const prompts = this.getPrompts()
    const categories = this.getCategories()
    return JSON.stringify({ prompts, categories }, null, 2)
  }

  static importPrompts(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)

      if (data.prompts && Array.isArray(data.prompts)) {
        this.savePrompts(data.prompts)
      }

      if (data.categories && Array.isArray(data.categories)) {
        this.saveCategories(data.categories)
      }

      return true
    } catch (error) {
      console.error('Error importing prompts:', error)
      return false
    }
  }

  // Private helper methods
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private static savePrompts(prompts: Prompt[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_PROMPTS, JSON.stringify(prompts))
    } catch (error) {
      console.error('Error saving prompts:', error)
    }
  }

  private static saveCategories(categories: PromptCategory[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_CATEGORIES, JSON.stringify(categories))
    } catch (error) {
      console.error('Error saving categories:', error)
    }
  }

  private static showInjectionNotification(promptTitle: string): void {
    // Create notification element
    const notification = document.createElement('div')
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease-out;
    `

    notification.textContent = `✅ Prompt "${promptTitle}" injected!`

    // Add CSS animation
    const style = document.createElement('style')
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `
    document.head.appendChild(style)

    document.body.appendChild(notification)

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease-out reverse'
      setTimeout(() => {
        notification.remove()
        style.remove()
      }, 300)
    }, 3000)
  }
}
