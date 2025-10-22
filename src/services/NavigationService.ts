import { KeyboardShortcut } from '../utils/keyboard'

export class NavigationService {
  static createNavigationShortcuts(
    userMessages: any[],
    currentIndex: number,
    onNavigate: (index: number) => void,
    onCopy: () => void
  ): KeyboardShortcut[] {
    return [
      {
        key: 'ArrowUp',
        ctrlKey: true,
        action: () => {
          if (currentIndex > 0) {
            onNavigate(currentIndex - 1)
          }
        },
        description: 'Previous message'
      },
      {
        key: 'ArrowDown',
        ctrlKey: true,
        action: () => {
          if (currentIndex < userMessages.length - 1) {
            onNavigate(currentIndex + 1)
          }
        },
        description: 'Next message'
      },
      {
        key: 'c',
        ctrlKey: true,
        action: onCopy,
        description: 'Copy current message'
      },
      {
        key: 'Home',
        ctrlKey: true,
        action: () => onNavigate(0),
        description: 'Go to first message'
      },
      {
        key: 'End',
        ctrlKey: true,
        action: () => onNavigate(userMessages.length - 1),
        description: 'Go to last message'
      }
    ]
  }
}
