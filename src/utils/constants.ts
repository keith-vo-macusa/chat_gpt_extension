export const HIGHLIGHT_CLASS = 'highlighted-message'
export const COPY_BUTTON_CLASS = 'chatgpt-copy-button'

export const SELECTORS = {
	conversationRoots: [
		'[role="main"]',
		'main',
		'[class*="conversation"]',
		'[class*="chat"]'
	],
	userTurn: '[data-message-author-role="user"]',
	userBubble: '.user-message-bubble-color',
	userTextFallback: '.whitespace-pre-wrap, [class*="whitespace-pre-wrap"]'
} as const

export const UI = {
  copySuccessMs: 2000,
  highlightDelayMs: 300,
  highlightAutoClearMs: 3000
} as const

export const KEYBOARD_SHORTCUTS = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  HOME: 'Home',
  END: 'End',
  C: 'c',
  F: 'f',
  E: 'e',
  S: 's',
  P: 'p',
  M: 'm',
  ESC: 'Escape'
} as const

