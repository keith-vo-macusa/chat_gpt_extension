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
