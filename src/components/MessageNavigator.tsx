import React, { useState } from 'react';
import { NavigationPanel } from './NavigationPanel';
import { SearchPanel } from './SearchPanel';
import { SearchResults } from './SearchResults';
import { ExportPanel } from './ExportPanel';
import { HistoryPanel } from './HistoryPanel';
import PromptPanel from './PromptPanel';
import ThemePanel from './ThemePanel';
import SmartSuggestionPanel from './SmartSuggestionPanel';
import CodeMinifierPanel from './CodeMinifierPanel';
import QuickActionsPanel from './QuickActionsPanel';
import SmartTemplatesPanel from './SmartTemplatesPanel';
import { useMessageNavigation } from '../hooks/useMessageNavigation';
import { SearchResult } from '../services/SearchService';
import { QuickAction } from '../services/QuickActionsService';
import { SmartTemplate } from '../services/SmartTemplatesService';

const MessageNavigator: React.FC = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isExportVisible, setIsExportVisible] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [isThemeVisible, setIsThemeVisible] = useState(false);
  const [isSmartSuggestionVisible, setIsSmartSuggestionVisible] = useState(false);
  const [isCodeMinifierVisible, setIsCodeMinifierVisible] = useState(false);
  const [isQuickActionsVisible, setIsQuickActionsVisible] = useState(false);
  const [isSmartTemplatesVisible, setIsSmartTemplatesVisible] = useState(false);
  const [suggestionContext, setSuggestionContext] = useState('');

  const handleSearch = () => {
    setIsSearchVisible(true);
  };

  const handleExport = () => {
    setIsExportVisible(true);
  };

  const handleHistory = () => {
    setIsHistoryVisible(true);
  };

  const handlePrompt = () => {
    setIsPromptVisible(true);
  };

  const handleTheme = () => {
    setIsThemeVisible(true);
  };

  const handleSmartSuggestion = () => {
    // Get current context from ChatGPT input
    const inputElement = document.querySelector(
      'textarea[placeholder*="Message"], textarea[placeholder*="message"], div[contenteditable="true"]'
    ) as HTMLTextAreaElement | HTMLInputElement | HTMLElement;
    const context = inputElement ? inputElement.value || inputElement.textContent || '' : '';
    setSuggestionContext(context);
    setIsSmartSuggestionVisible(true);
  };

  const handleCodeMinifier = () => {
    // Get selected text or current input content
    const selection = window.getSelection();
    let content = '';

    if (selection && selection.toString().trim().length > 0) {
      content = selection.toString();
    } else {
      // Get current context from ChatGPT input
      const inputElement = document.querySelector(
        'textarea[placeholder*="Message"], textarea[placeholder*="message"], div[contenteditable="true"]'
      ) as HTMLTextAreaElement | HTMLInputElement | HTMLElement;
      content = inputElement ? inputElement.value || inputElement.textContent || '' : '';
    }

    setSuggestionContext(content);
    setIsCodeMinifierVisible(true);
  };

  const handleQuickActions = () => {
    setIsQuickActionsVisible(true);
  };

  const handleSmartTemplates = () => {
    setIsSmartTemplatesVisible(true);
  };

  const handleQuickActionSelect = (action: QuickAction, generatedPrompt: string) => {
    // Fill the ChatGPT input with the generated prompt
    const inputElement = document.querySelector(
      'textarea[placeholder*="Message"], textarea[placeholder*="message"], div[contenteditable="true"]'
    ) as HTMLTextAreaElement | HTMLInputElement | HTMLElement;

    if (inputElement) {
      if ('value' in inputElement) {
        (inputElement as HTMLTextAreaElement).value = generatedPrompt;
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
      } else if ('textContent' in inputElement) {
        (inputElement as HTMLElement).textContent = generatedPrompt;
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  };

  const handleSmartTemplateSelect = (template: SmartTemplate, generatedPrompt: string) => {
    // Fill the ChatGPT input with the generated prompt
    const inputElement = document.querySelector(
      'textarea[placeholder*="Message"], textarea[placeholder*="message"], div[contenteditable="true"]'
    ) as HTMLTextAreaElement | HTMLInputElement | HTMLElement;

    if (inputElement) {
      if ('value' in inputElement) {
        (inputElement as HTMLTextAreaElement).value = generatedPrompt;
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
      } else if ('textContent' in inputElement) {
        (inputElement as HTMLElement).textContent = generatedPrompt;
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  };

  const { userMessages, currentIndex, goToPrevious, goToNext, copyCurrentMessage, goToMessage } =
    useMessageNavigation(
      handleSearch,
      handleExport,
      handleHistory,
      handlePrompt,
      handleTheme,
      handleSmartSuggestion,
      handleCodeMinifier,
      handleQuickActions,
      handleSmartTemplates
    );

  const handleSearchClose = () => {
    setIsSearchVisible(false);
    setShowSearchResults(false);
    setSearchResults([]);
  };

  const handleSearchResultSelect = (result: SearchResult) => {
    // Navigate to the selected message
    goToMessage(result.message.index);
    setIsSearchVisible(false);
    setShowSearchResults(false);
  };

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
    setCurrentSearchIndex(0);
    setShowSearchResults(true);
  };

  const handleSearchResultClick = (result: SearchResult, index: number) => {
    setCurrentSearchIndex(index);
    handleSearchResultSelect(result);
  };

  const handleHistoryMessageSelect = (index: number) => {
    goToMessage(index);
    setIsHistoryVisible(false);
  };

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
        onPrompt={handlePrompt}
        onTheme={handleTheme}
        onSmartSuggestion={handleSmartSuggestion}
        onCodeMinifier={handleCodeMinifier}
        onQuickActions={handleQuickActions}
        onSmartTemplates={handleSmartTemplates}
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

      {isPromptVisible && (
        <PromptPanel
          isVisible={isPromptVisible}
          onClose={() => setIsPromptVisible(false)}
        />
      )}

      {isThemeVisible && (
        <ThemePanel
          isVisible={isThemeVisible}
          onClose={() => setIsThemeVisible(false)}
        />
      )}

      {isSmartSuggestionVisible && (
        <SmartSuggestionPanel
          isVisible={isSmartSuggestionVisible}
          onClose={() => setIsSmartSuggestionVisible(false)}
          context={suggestionContext}
        />
      )}

      {isCodeMinifierVisible && (
        <CodeMinifierPanel
          isVisible={isCodeMinifierVisible}
          onClose={() => setIsCodeMinifierVisible(false)}
          initialContent={suggestionContext}
        />
      )}

      {isQuickActionsVisible && (
        <QuickActionsPanel
          isVisible={isQuickActionsVisible}
          onClose={() => setIsQuickActionsVisible(false)}
          onActionSelect={handleQuickActionSelect}
        />
      )}

      {isSmartTemplatesVisible && (
        <SmartTemplatesPanel
          isVisible={isSmartTemplatesVisible}
          onClose={() => setIsSmartTemplatesVisible(false)}
          onTemplateSelect={handleSmartTemplateSelect}
        />
      )}
    </>
  );
};

export default MessageNavigator;
