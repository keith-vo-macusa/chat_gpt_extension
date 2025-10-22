import React, { useState, useEffect } from 'react';
import {
  SmartTemplatesService,
  SmartTemplate,
  TemplateVariable,
} from '../services/SmartTemplatesService';

interface SmartTemplatesPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onTemplateSelect: (template: SmartTemplate, generatedPrompt: string) => void;
}

const SmartTemplatesPanel: React.FC<SmartTemplatesPanelProps> = ({
  isVisible,
  onClose,
  onTemplateSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [templates, setTemplates] = useState<SmartTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<SmartTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<SmartTemplate | null>(null);
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});

  const smartTemplatesService = SmartTemplatesService.getInstance();

  useEffect(() => {
    const allTemplates = smartTemplatesService.getAllTemplates();
    setTemplates(allTemplates);
    setFilteredTemplates(allTemplates);
  }, []);

  useEffect(() => {
    let filtered = templates;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((template) => template.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = smartTemplatesService.searchTemplates(searchQuery);
      if (selectedCategory !== 'all') {
        filtered = filtered.filter((template) => template.category === selectedCategory);
      }
    }

    setFilteredTemplates(filtered);
  }, [searchQuery, selectedCategory, templates]);

  const handleTemplateClick = (template: SmartTemplate) => {
    setSelectedTemplate(template);
    // Initialize variables with default values
    const variables: Record<string, string> = {};
    template.variables.forEach((variable) => {
      variables[variable.name] = variable.defaultValue || '';
    });
    setTemplateVariables(variables);
  };

  const handleVariableChange = (variableName: string, value: string) => {
    setTemplateVariables((prev) => ({
      ...prev,
      [variableName]: value,
    }));
  };

  const handleGeneratePrompt = () => {
    if (!selectedTemplate) return;

    const generatedPrompt = smartTemplatesService.generatePrompt(
      selectedTemplate,
      templateVariables
    );
    smartTemplatesService.incrementUsage(selectedTemplate.id);
    onTemplateSelect(selectedTemplate, generatedPrompt);
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (selectedTemplate) {
        setSelectedTemplate(null);
      } else {
        onClose();
      }
    }
  };

  const categories = [
    { key: 'all', label: 'All', icon: '🔍' },
    ...smartTemplatesService.getCategories(),
  ];

  if (!isVisible) return null;

  return (
    <div
      className="smart-templates-panel"
      onKeyDown={handleKeyDown}
    >
      <div className="panel-header">
        <h3>Smart Templates</h3>
        <div className="panel-controls">
          <span className="templates-count">{filteredTemplates.length} templates</span>
          <button
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </div>

      <div className="templates-content">
        {!selectedTemplate ? (
          <>
            {/* Search and Filter */}
            <div className="search-section">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search templates..."
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

            {/* Templates Grid */}
            <div className="templates-grid">
              {filteredTemplates.length === 0 ? (
                <div className="no-results">
                  <div className="no-results-icon">📝</div>
                  <h4>No templates found</h4>
                  <p>Try adjusting your search or category filter</p>
                </div>
              ) : (
                filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="template-card"
                    onClick={() => handleTemplateClick(template)}
                  >
                    <div className="template-header">
                      <span className="template-icon">{template.icon}</span>
                      <div className="template-info">
                        <h4 className="template-title">{template.title}</h4>
                        <p className="template-description">{template.description}</p>
                      </div>
                      <div className="template-stats">
                        <span className="usage-count">{template.usageCount} uses</span>
                      </div>
                    </div>
                    <div className="template-tags">
                      {template.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="template-tag"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="template-variables">
                      <span className="variables-count">{template.variables.length} variables</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          /* Template Form */
          <div className="template-form">
            <div className="template-form-header">
              <button
                className="back-btn"
                onClick={() => setSelectedTemplate(null)}
              >
                ← Back
              </button>
              <h4>{selectedTemplate.title}</h4>
            </div>

            <div className="template-preview">
              <h5>Template Preview:</h5>
              <div className="preview-content">
                {selectedTemplate.template.split('\n').slice(0, 5).join('\n')}
                {selectedTemplate.template.split('\n').length > 5 && '...'}
              </div>
            </div>

            <div className="variables-section">
              <h5>Fill in the details:</h5>
              {selectedTemplate.variables.map((variable) => (
                <div
                  key={variable.name}
                  className="variable-field"
                >
                  <label className="variable-label">
                    {variable.name}
                    {variable.required && <span className="required">*</span>}
                    <span className="variable-description">{variable.description}</span>
                  </label>

                  {variable.type === 'select' ? (
                    <select
                      value={templateVariables[variable.name] || ''}
                      onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                      className="variable-input"
                    >
                      <option value="">Select {variable.name}</option>
                      {variable.options?.map((option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : variable.type === 'multiline' ? (
                    <textarea
                      value={templateVariables[variable.name] || ''}
                      onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                      placeholder={variable.placeholder}
                      className="variable-input variable-textarea"
                      rows={3}
                    />
                  ) : variable.type === 'code' ? (
                    <textarea
                      value={templateVariables[variable.name] || ''}
                      onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                      placeholder={variable.placeholder}
                      className="variable-input variable-code"
                      rows={8}
                    />
                  ) : (
                    <input
                      type="text"
                      value={templateVariables[variable.name] || ''}
                      onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                      placeholder={variable.placeholder}
                      className="variable-input"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="template-actions">
              <button
                className="generate-btn"
                onClick={handleGeneratePrompt}
                disabled={
                  !selectedTemplate.variables.every(
                    (v) => !v.required || templateVariables[v.name]?.trim()
                  )
                }
              >
                Generate Prompt
              </button>
            </div>
          </div>
        )}

        {/* Quick Tips */}
        <div className="quick-tips">
          <h4>💡 Quick Tips</h4>
          <ul>
            <li>Templates help structure your prompts for better results</li>
            <li>Fill in all required fields for complete prompts</li>
            <li>Use code blocks for better formatting</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SmartTemplatesPanel;
