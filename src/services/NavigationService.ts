import { KeyboardShortcut } from '../utils/keyboard'

export class NavigationService {
  static createNavigationShortcuts(
    userMessages: any[],
    currentIndex: number,
    onNavigate: (index: number) => void,
    onCopy: () => void,
    onSearch?: () => void,
    onExport?: () => void,
    onHistory?: () => void,
    onPrompt?: () => void,
    onTheme?: () => void,
    onSmartSuggestion?: () => void,
    onCodeMinifier?: () => void
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
      },
      ...(onSearch ? [{
        key: 'f',
        ctrlKey: true,
        action: onSearch,
        description: 'Open search panel'
      }] : []),
      ...(onExport ? [{
        key: 'e',
        ctrlKey: true,
        action: onExport,
        description: 'Open export panel'
      }] : []),
      ...(onHistory ? [{
        key: 'h',
        ctrlKey: true,
        action: onHistory,
        description: 'Open history panel'
      }] : []),
      ...(onPrompt ? [{
        key: 'p',
        ctrlKey: true,
        action: onPrompt,
        description: 'Open prompt manager'
      }] : []),
      ...(onTheme ? [{
        key: 't',
        ctrlKey: true,
        action: onTheme,
        description: 'Open theme settings'
      }] : []),
      ...(onSmartSuggestion ? [{
        key: 's',
        ctrlKey: true,
        action: onSmartSuggestion,
        description: 'Open smart suggestions'
      }] : []),
      ...(onCodeMinifier ? [{
        key: 'm',
        ctrlKey: true,
        action: onCodeMinifier,
        description: 'Open code minifier'
      }] : [])
    ]
  }
}
