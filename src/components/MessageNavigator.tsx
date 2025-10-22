import React, { useState } from 'react'
import { NavigationPanel } from './NavigationPanel'
import { SearchPanel } from './SearchPanel'
import { SearchResults } from './SearchResults'
import { ExportPanel } from './ExportPanel'
import { HistoryPanel } from './HistoryPanel'
import { useMessageNavigation } from '../hooks/useMessageNavigation'
import { SearchResult } from '../services/SearchService'

const MessageNavigator: React.FC = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isExportVisible, setIsExportVisible] = useState(false)
  const [isHistoryVisible, setIsHistoryVisible] = useState(false)

  const handleSearch = () => {
    setIsSearchVisible(true)
  }

  const handleExport = () => {
    setIsExportVisible(true)
  }

  const handleHistory = () => {
    setIsHistoryVisible(true)
  }

  const {
    userMessages,
    currentIndex,
    goToPrevious,
    goToNext,
    copyCurrentMessage,
    goToMessage,
  } = useMessageNavigation(handleSearch, handleExport, handleHistory)

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

  const handleHistoryMessageSelect = (index: number) => {
    goToMessage(index)
    setIsHistoryVisible(false)
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
        onExport={handleExport}
        onHistory={handleHistory}
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

      {isExportVisible && (
        <ExportPanel
          userMessages={userMessages}
          isVisible={isExportVisible}
          onClose={() => setIsExportVisible(false)}
        />
      )}

      {isHistoryVisible && (
        <HistoryPanel
          userMessages={userMessages}
          isVisible={isHistoryVisible}
          onClose={() => setIsHistoryVisible(false)}
          onMessageSelect={handleHistoryMessageSelect}
        />
      )}
    </>
  )
}

export default MessageNavigator
