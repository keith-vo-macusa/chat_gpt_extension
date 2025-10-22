import React, { useState, useEffect } from 'react';
import { QuickActionsService, QuickAction } from '../services/QuickActionsService';
import { KEYBOARD_SHORTCUTS } from '../utils/constants';

interface QuickActionsPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onActionSelect: (action: QuickAction, generatedPrompt: string) => void;
}

const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  isVisible,
  onClose,
  onActionSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [actions, setActions] = useState<QuickAction[]>([]);
  const [filteredActions, setFilteredActions] = useState<QuickAction[]>([]);

  const quickActionsService = QuickActionsService.getInstance();

  useEffect(() => {
    const allActions = quickActionsService.getAllActions();
    setActions(allActions);
    setFilteredActions(allActions);
  }, []);

  useEffect(() => {
    let filtered = actions;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((action) => action.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = quickActionsService.searchActions(searchQuery);
      if (selectedCategory !== 'all') {
        filtered = filtered.filter((action) => action.category === selectedCategory);
      }
    }

    setFilteredActions(filtered);
  }, [searchQuery, selectedCategory, actions]);

  const handleActionClick = (action: QuickAction) => {
    // Get current context from ChatGPT input or selected text
    const selection = window.getSelection();
    let context = '';

    if (selection && selection.toString().trim().length > 0) {
      context = selection.toString();
    } else {
      // Get current context from ChatGPT input
      const inputElement = document.querySelector(
        'textarea[placeholder*="Message"], textarea[placeholder*="message"], div[contenteditable="true"]'
      ) as HTMLTextAreaElement | HTMLInputElement | HTMLElement;
      context = inputElement ? inputElement.value || inputElement.textContent || '' : '';
    }

    const generatedPrompt = quickActionsService.generatePrompt(action, context);
    onActionSelect(action, generatedPrompt);
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  const categories = [
    { key: 'all', label: 'All', icon: '🔍' },
    ...quickActionsService.getCategories(),
  ];

  if (!isVisible) return null;

  return (
    <div
      className="quick-actions-panel"
      onKeyDown={handleKeyDown}
    >
      <div className="panel-header">
        <h3>Quick Actions</h3>
        <div className="panel-controls">
          <span className="actions-count">{filteredActions.length} actions</span>
          <button
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </div>

      <div className="actions-content">
        {/* Search and Filter */}
        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search actions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              autoFocus
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category.key}
                className={`category-btn ${selectedCategory === category.key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.key)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-label">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions Grid */}
        <div className="actions-grid">
          {filteredActions.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h4>No actions found</h4>
              <p>Try adjusting your search or category filter</p>
            </div>
          ) : (
            filteredActions.map((action) => (
              <div
                key={action.id}
                className="action-card"
                onClick={() => handleActionClick(action)}
              >
                <div className="action-header">
                  <span className="action-icon">{action.icon}</span>
                  <div className="action-info">
                    <h4 className="action-title">{action.title}</h4>
                    <p className="action-description">{action.description}</p>
                  </div>
                  {action.shortcut && <span className="action-shortcut">{action.shortcut}</span>}
                </div>
                <div className="action-tags">
                  {action.keywords.slice(0, 3).map((keyword) => (
                    <span
                      key={keyword}
                      className="action-tag"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Tips */}
        <div className="quick-tips">
          <h4>💡 Quick Tips</h4>
          <ul>
            <li>Select text in ChatGPT to use as context for actions</li>
            <li>Use keyboard shortcuts for faster access</li>
            <li>Actions will automatically fill your ChatGPT input</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;
