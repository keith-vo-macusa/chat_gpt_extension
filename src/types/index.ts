export interface UserMessage {
  element: HTMLElement
  text: string
  index: number
}

export interface MessageNavigatorState {
  userMessages: UserMessage[]
  currentIndex: number
  isVisible: boolean
  bookmarks: Set<number>
}

export interface SearchState {
  isVisible: boolean
  query: string
  results: any[]
  currentIndex: number
  showResults: boolean
}

// Prompt Management Types
export interface Prompt {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

export interface PromptCategory {
  id: string
  name: string
  color: string
}

export interface PromptState {
  prompts: Prompt[]
  categories: PromptCategory[]
  isVisible: boolean
  searchQuery: string
  selectedCategory: string
  editingPrompt: Prompt | null
}

// Theme Management Types
export interface Theme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    accent: string
    success: string
    warning: string
    error: string
  }
  fonts: {
    primary: string
    secondary: string
  }
  borderRadius: string
  shadows: {
    small: string
    medium: string
    large: string
  }
}

export interface CustomTheme extends Theme {
  isCustom: true
  userId: string
  createdAt: string
}

export interface LayoutSettings {
  position: 'right' | 'left' | 'bottom'
  size: 'small' | 'medium' | 'large'
  opacity: number
  autoHide: boolean
  showLabels: boolean
}

export interface PersonalizationSettings {
  nickname: string
  avatar: string
  showWelcomeMessage: boolean
  language: 'vi' | 'en'
}

// Smart Features Types
export interface SmartSuggestion {
  id: string
  type: 'prompt' | 'template' | 'quick_action'
  title: string
  content: string
  category: string
  confidence: number
  reason: string
}

export interface SmartTemplate {
  id: string
  name: string
  description: string
  category: string
  template: string
  variables: string[]
  usage: string
}

// Notification Types
export interface NotificationSettings {
  enabled: boolean
  sound: boolean
  vibration: boolean
  showPreview: boolean
  customMessage: string
  autoClose: boolean
  closeDelay: number
}
