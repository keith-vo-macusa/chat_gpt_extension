import React, { useState, useEffect, useRef } from 'react'
import { SearchService, SearchResult, SearchOptions } from '../services/SearchService'
import { UserMessage } from '../types'

interface SearchPanelProps {
  userMessages: UserMessage[]
  isVisible: boolean
  onClose: () => void
  onResultSelect: (result: SearchResult) => void
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  userMessages,
  isVisible,
  onClose,
  onResultSelect
}) => {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [currentResultIndex, setCurrentResultIndex] = useState(0)
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    query: '',
    caseSensitive: false,
    wholeWord: false,
    regex: false,
    searchInUserMessages: true,
    searchInAssistantMessages: false
  })
  const [showOptions, setShowOptions] = useState(false)

  const searchService = SearchService.getInstance()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isVisible])

  useEffect(() => {
    if (query.trim()) {
      const results = searchService.search(userMessages, { ...searchOptions, query })
      setSearchResults(results)
      setCurrentResultIndex(0)
    } else {
      setSearchResults([])
      setCurrentResultIndex(0)
    }
  }, [query, searchOptions, userMessages])

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery)
    setSearchOptions(prev => ({ ...prev, query: newQuery }))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'Enter') {
      if (searchResults.length > 0) {
        const result = searchResults[currentResultIndex]
        onResultSelect(result)
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (searchResults.length > 0) {
        setCurrentResultIndex(prev => (prev + 1) % searchResults.length)
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (searchResults.length > 0) {
        setCurrentResultIndex(prev => prev === 0 ? searchResults.length - 1 : prev - 1)
      }
    }
  }

  const handleResultClick = (result: SearchResult, index: number) => {
    setCurrentResultIndex(index)
    onResultSelect(result)
  }

  const highlightText = (text: string, matches: any[]) => {
    if (matches.length === 0) return text

    let highlightedText = ''
    let lastIndex = 0

    matches.forEach(match => {
      highlightedText += text.substring(lastIndex, match.startIndex)
      highlightedText += `<mark class="search-highlight">${match.text}</mark>`
      lastIndex = match.endIndex
    })

    highlightedText += text.substring(lastIndex)
    return highlightedText
  }

  if (!isVisible) return null

  return (
    <div className="search-panel">
      <div className="search-header">
        <div className="search-input-container">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tìm kiếm tin nhắn..."
            className="search-input"
          />
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="search-options-btn"
            title="Tùy chọn tìm kiếm"
          >
            ⚙️
          </button>
          <button
            onClick={onClose}
            className="search-close-btn"
            title="Đóng tìm kiếm"
          >
            ✕
          </button>
        </div>

        {showOptions && (
          <div className="search-options">
            <label className="search-option">
              <input
                type="checkbox"
                checked={searchOptions.caseSensitive}
                onChange={(e) => setSearchOptions(prev => ({ ...prev, caseSensitive: e.target.checked }))}
              />
              Phân biệt hoa thường
            </label>
            <label className="search-option">
              <input
                type="checkbox"
                checked={searchOptions.wholeWord}
                onChange={(e) => setSearchOptions(prev => ({ ...prev, wholeWord: e.target.checked }))}
              />
              Từ đầy đủ
            </label>
            <label className="search-option">
              <input
                type="checkbox"
                checked={searchOptions.regex}
                onChange={(e) => setSearchOptions(prev => ({ ...prev, regex: e.target.checked }))}
              />
              Regex
            </label>
          </div>
        )}
      </div>

      <div className="search-results">
        {query.trim() && (
          <div className="search-info">
            {searchResults.length > 0 ? (
              <span>
                Tìm thấy {searchResults.length} kết quả
                {searchResults.length > 1 && ` (${currentResultIndex + 1}/${searchResults.length})`}
              </span>
            ) : (
              <span>Không tìm thấy kết quả nào</span>
            )}
          </div>
        )}

        <div className="search-results-list">
          {searchResults.map((result, index) => (
            <div
              key={`${result.message.index}-${index}`}
              className={`search-result-item ${index === currentResultIndex ? 'active' : ''}`}
              onClick={() => handleResultClick(result, index)}
            >
              <div className="search-result-header">
                <span className="search-result-index">#{result.message.index + 1}</span>
                <span className="search-result-score">Score: {result.relevanceScore}</span>
              </div>
              <div
                className="search-result-content"
                dangerouslySetInnerHTML={{
                  __html: highlightText(result.message.text, result.matches)
                }}
              />
              <div className="search-result-matches">
                {result.matches.length} kết quả khớp
              </div>
            </div>
          ))}
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="search-footer">
          <div className="search-shortcuts">
            <span>↑↓ Chọn kết quả</span>
            <span>Enter Mở</span>
            <span>Esc Đóng</span>
          </div>
        </div>
      )}
    </div>
  )
}
