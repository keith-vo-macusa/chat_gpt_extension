import React, { useState } from 'react'
import { NavigationPanel } from './NavigationPanel'
import { SearchPanel } from './SearchPanel'
import { SearchResults } from './SearchResults'
import { useMessageNavigation } from '../hooks/useMessageNavigation'
import { SearchResult } from '../services/SearchService'

const MessageNavigator: React.FC = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0)
  const [showSearchResults, setShowSearchResults] = useState(false)

  const handleSearch = () => {
    setIsSearchVisible(true)
  }

  const {
    userMessages,
    currentIndex,
    goToPrevious,
    goToNext,
    copyCurrentMessage,
    goToMessage,
  } = useMessageNavigation(handleSearch)

  const handleSearchClose = () => {
    setIsSearchVisible(false)
    setShowSearchResults(false)
    setSearchResults([])
  }

  const handleSearchResultSelect = (result: SearchResult) => {
    // Navigate to the selected message
    goToMessage(result.message.index)
    setIsSearchVisible(false)
    setShowSearchResults(false)
  }

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results)
    setCurrentSearchIndex(0)
    setShowSearchResults(true)
  }

  const handleSearchResultClick = (result: SearchResult, index: number) => {
    setCurrentSearchIndex(index)
    handleSearchResultSelect(result)
  }

  return (
    <>
      <NavigationPanel
        userMessages={userMessages}
        currentIndex={currentIndex}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onCopy={copyCurrentMessage}
        onSearch={handleSearch}
      />

      {isSearchVisible && (
        <SearchPanel
          userMessages={userMessages}
          isVisible={isSearchVisible}
          onClose={handleSearchClose}
          onResultSelect={handleSearchResultSelect}
        />
      )}

      {showSearchResults && (
        <SearchResults
          results={searchResults}
          currentIndex={currentSearchIndex}
          onResultSelect={handleSearchResultClick}
          onClose={() => setShowSearchResults(false)}
        />
      )}
    </>
  )
}

export default MessageNavigator
