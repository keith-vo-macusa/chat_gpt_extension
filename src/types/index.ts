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
