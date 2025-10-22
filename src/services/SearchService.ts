import { UserMessage } from '../types'

export interface SearchResult {
  message: UserMessage
  matches: SearchMatch[]
  relevanceScore: number
}

export interface SearchMatch {
  text: string
  startIndex: number
  endIndex: number
  isHighlighted: boolean
}

export interface SearchOptions {
  query: string
  caseSensitive: boolean
  wholeWord: boolean
  regex: boolean
  searchInUserMessages: boolean
  searchInAssistantMessages: boolean
}

export class SearchService {
  private static instance: SearchService
  private searchResults: SearchResult[] = []
  private currentSearchIndex = 0
  private searchOptions: SearchOptions = {
    query: '',
    caseSensitive: false,
    wholeWord: false,
    regex: false,
    searchInUserMessages: true,
    searchInAssistantMessages: false
  }

  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService()
    }
    return SearchService.instance
  }

  search(messages: UserMessage[], options: Partial<SearchOptions> = {}): SearchResult[] {
    this.searchOptions = { ...this.searchOptions, ...options }

    if (!this.searchOptions.query.trim()) {
      this.searchResults = []
      return this.searchResults
    }

    this.searchResults = []

    for (const message of messages) {
      if (this.searchOptions.searchInUserMessages) {
        const userMatches = this.findMatches(message.text, this.searchOptions.query)
        if (userMatches.length > 0) {
          this.searchResults.push({
            message,
            matches: userMatches,
            relevanceScore: this.calculateRelevanceScore(message.text, userMatches)
          })
        }
      }
    }

    // Sort by relevance score (higher is better)
    this.searchResults.sort((a, b) => b.relevanceScore - a.relevanceScore)
    this.currentSearchIndex = 0

    return this.searchResults
  }

  private findMatches(text: string, query: string): SearchMatch[] {
    const matches: SearchMatch[] = []
    let searchText = text
    let searchQuery = query

    if (!this.searchOptions.caseSensitive) {
      searchText = text.toLowerCase()
      searchQuery = query.toLowerCase()
    }

    if (this.searchOptions.regex) {
      try {
        const flags = this.searchOptions.caseSensitive ? 'g' : 'gi'
        const regex = new RegExp(searchQuery, flags)
        let match
        while ((match = regex.exec(searchText)) !== null) {
          matches.push({
            text: text.substring(match.index, match.index + match[0].length),
            startIndex: match.index,
            endIndex: match.index + match[0].length,
            isHighlighted: false
          })
        }
      } catch (error) {
        console.warn('Invalid regex pattern:', error)
        return []
      }
    } else {
      let index = 0
      while (index < searchText.length) {
        const foundIndex = searchText.indexOf(searchQuery, index)
        if (foundIndex === -1) break

        // Check whole word option
        if (this.searchOptions.wholeWord) {
          const beforeChar = foundIndex > 0 ? searchText[foundIndex - 1] : ' '
          const afterChar = foundIndex + searchQuery.length < searchText.length
            ? searchText[foundIndex + searchQuery.length] : ' '

          if (!this.isWordCharacter(beforeChar) && !this.isWordCharacter(afterChar)) {
            matches.push({
              text: text.substring(foundIndex, foundIndex + searchQuery.length),
              startIndex: foundIndex,
              endIndex: foundIndex + searchQuery.length,
              isHighlighted: false
            })
          }
        } else {
          matches.push({
            text: text.substring(foundIndex, foundIndex + searchQuery.length),
            startIndex: foundIndex,
            endIndex: foundIndex + searchQuery.length,
            isHighlighted: false
          })
        }

        index = foundIndex + 1
      }
    }

    return matches
  }

  private isWordCharacter(char: string): boolean {
    return /[a-zA-Z0-9_]/.test(char)
  }

  private calculateRelevanceScore(text: string, matches: SearchMatch[]): number {
    let score = 0

    // Base score from number of matches
    score += matches.length * 10

    // Bonus for exact matches
    const exactMatches = matches.filter(match =>
      match.text.toLowerCase() === this.searchOptions.query.toLowerCase()
    )
    score += exactMatches.length * 20

    // Bonus for matches at the beginning of text
    const beginningMatches = matches.filter(match => match.startIndex < 50)
    score += beginningMatches.length * 5

    // Penalty for very long texts (prefer shorter, more relevant matches)
    if (text.length > 1000) {
      score -= Math.floor(text.length / 1000) * 2
    }

    return score
  }

  getSearchResults(): SearchResult[] {
    return this.searchResults
  }

  getCurrentSearchIndex(): number {
    return this.currentSearchIndex
  }

  getCurrentSearchResult(): SearchResult | null {
    if (this.searchResults.length === 0) return null
    return this.searchResults[this.currentSearchIndex]
  }

  goToNextResult(): SearchResult | null {
    if (this.searchResults.length === 0) return null
    this.currentSearchIndex = (this.currentSearchIndex + 1) % this.searchResults.length
    return this.getCurrentSearchResult()
  }

  goToPreviousResult(): SearchResult | null {
    if (this.searchResults.length === 0) return null
    this.currentSearchIndex = this.currentSearchIndex === 0
      ? this.searchResults.length - 1
      : this.currentSearchIndex - 1
    return this.getCurrentSearchResult()
  }

  clearSearch(): void {
    this.searchResults = []
    this.currentSearchIndex = 0
  }

  getSearchOptions(): SearchOptions {
    return { ...this.searchOptions }
  }

  updateSearchOptions(options: Partial<SearchOptions>): void {
    this.searchOptions = { ...this.searchOptions, ...options }
  }
}
