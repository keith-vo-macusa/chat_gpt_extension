import { KEYBOARD_SHORTCUTS } from './constants'

export interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  action: () => void
  description: string
}

export const createKeyboardHandler = (shortcuts: KeyboardShortcut[]) => {
  return (event: KeyboardEvent) => {
    const pressedKey = event.key.toLowerCase()
    const ctrl = event.ctrlKey || event.metaKey // Support both Ctrl and Cmd

    for (const shortcut of shortcuts) {
      const keyMatch = pressedKey === shortcut.key.toLowerCase()
      const ctrlMatch = !!shortcut.ctrlKey === ctrl
      const shiftMatch = !!shortcut.shiftKey === event.shiftKey
      const altMatch = !!shortcut.altKey === event.altKey

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault()
        event.stopPropagation()
        shortcut.action()
        return true
      }
    }
    return false
  }
}
