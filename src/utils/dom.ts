import { SELECTORS } from './constants'

export function getConversationRoot(): Element {
	for (const selector of SELECTORS.conversationRoots) {
		const el = document.querySelector(selector)
		if (el) return el
	}
	return document.body
}

export function getUserMessageElements(root: Element): HTMLElement[] {
	return Array.from(root.querySelectorAll(SELECTORS.userTurn)) as HTMLElement[]
}

export function findMessageBubble(el: HTMLElement): HTMLElement | null {
	return (el.querySelector(SELECTORS.userBubble) as HTMLElement) || null
}

export function extractMessageText(el: HTMLElement): string {
	const bubble = findMessageBubble(el)
	const textEl = (bubble?.querySelector(SELECTORS.userTextFallback) || el.querySelector(SELECTORS.userTextFallback)) as HTMLElement | null
	return (textEl?.textContent || el.textContent || '').trim()
}

