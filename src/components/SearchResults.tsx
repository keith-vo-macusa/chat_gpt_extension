import React from 'react'
import { SearchResult } from '../services/SearchService'

interface SearchResultsProps {
  results: SearchResult[]
  currentIndex: number
  onResultSelect: (result: SearchResult, index: number) => void
  onClose: () => void
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  currentIndex,
  onResultSelect,
  onClose
}) => {
  const highlightText = (text: string, matches: any[]) => {
    if (matches.length === 0) return text

    let highlightedText = ''
    let lastIndex = 0

    // Sort matches by start index to process them in order
    const sortedMatches = [...matches].sort((a, b) => a.startIndex - b.startIndex)

    sortedMatches.forEach(match => {
      highlightedText += text.substring(lastIndex, match.startIndex)
      highlightedText += `<mark class="search-highlight">${match.text}</mark>`
      lastIndex = match.endIndex
    })

    highlightedText += text.substring(lastIndex)
    return highlightedText
  }

  const getContextText = (text: string, match: any, contextLength: number = 100) => {
    const start = Math.max(0, match.startIndex - contextLength)
    const end = Math.min(text.length, match.endIndex + contextLength)

    let context = text.substring(start, end)

    // Add ellipsis if we're not at the beginning/end
    if (start > 0) context = '...' + context
    if (end < text.length) context = context + '...'

    return context
  }

  const getMatchContext = (text: string, matches: any[]) => {
    if (matches.length === 0) return text

    // Get the first match for context
    const firstMatch = matches[0]
    return getContextText(text, firstMatch, 150)
  }

  if (results.length === 0) {
    return (
      <div className="search-results-empty">
        <div className="search-results-empty-icon">🔍</div>
        <div className="search-results-empty-text">Không tìm thấy kết quả nào</div>
        <div className="search-results-empty-hint">
          Thử thay đổi từ khóa tìm kiếm hoặc tùy chọn tìm kiếm
        </div>
      </div>
    )
  }

  return (
    <div className="search-results-container">
      <div className="search-results-header">
        <div className="search-results-count">
          Tìm thấy {results.length} kết quả
        </div>
        <button
          className="search-results-close"
          onClick={onClose}
          title="Đóng kết quả tìm kiếm"
        >
          ✕
        </button>
      </div>

      <div className="search-results-list">
        {results.map((result, index) => (
          <div
            key={`${result.message.index}-${index}`}
            className={`search-result-item ${index === currentIndex ? 'active' : ''}`}
            onClick={() => onResultSelect(result, index)}
          >
            <div className="search-result-header">
              <div className="search-result-meta">
                <span className="search-result-index">Tin nhắn #{result.message.index + 1}</span>
                <span className="search-result-matches-count">
                  {result.matches.length} kết quả khớp
                </span>
              </div>
              <div className="search-result-score">
                Độ liên quan: {result.relevanceScore}
              </div>
            </div>

            <div className="search-result-content">
              <div
                className="search-result-text"
                dangerouslySetInnerHTML={{
                  __html: highlightText(
                    getMatchContext(result.message.text, result.matches),
                    result.matches
                  )
                }}
              />
            </div>

            {result.matches.length > 1 && (
              <div className="search-result-matches-detail">
                <div className="search-result-matches-title">Tất cả kết quả khớp:</div>
                <div className="search-result-matches-list">
                  {result.matches.map((match, matchIndex) => (
                    <div key={matchIndex} className="search-result-match-item">
                      <span className="search-result-match-text">
                        "{match.text}"
                      </span>
                      <span className="search-result-match-position">
                        (vị trí {match.startIndex}-{match.endIndex})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="search-results-footer">
        <div className="search-results-navigation">
          <span>↑↓ Chọn kết quả</span>
          <span>Enter Mở tin nhắn</span>
          <span>Esc Đóng</span>
        </div>
      </div>
    </div>
  )
}
