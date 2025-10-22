import React, { useState, useEffect } from 'react';
import { SmartSuggestion, SmartTemplate } from '../types';
import { SmartSuggestionService } from '../services/SmartSuggestionService';
import { PromptService } from '../services/PromptService';

interface SmartSuggestionPanelProps {
  isVisible: boolean;
  onClose: () => void;
  context?: string;
}

const SmartSuggestionPanel: React.FC<SmartSuggestionPanelProps> = ({
  isVisible,
  onClose,
  context = '',
}) => {
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [templates, setTemplates] = useState<SmartTemplate[]>([]);
  const [quickActions, setQuickActions] = useState<SmartSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'templates' | 'quick_actions'>(
    'suggestions'
  );
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    category: 'general',
    template: '',
    variables: [] as string[],
    usage: '',
  });
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isVisible) {
      loadData();
    }
  }, [isVisible, context]);

  const loadData = () => {
    const smartSuggestions = SmartSuggestionService.getSmartSuggestions(context);
    const smartTemplates = SmartSuggestionService.getSmartTemplates();
    const actions = SmartSuggestionService.getQuickActions(context);

    setSuggestions(smartSuggestions);
    setTemplates(smartTemplates);
    setQuickActions(actions);
  };

  const handleUseSuggestion = (suggestion: SmartSuggestion) => {
    if (suggestion.type === 'template') {
      // For templates, show variable input form
      const template = templates.find((t) => t.id === suggestion.id.replace('template-', ''));
      if (template) {
        setTemplateForm({
          name: template.name,
          description: template.description,
          category: template.category,
          template: template.template,
          variables: template.variables,
          usage: template.usage,
        });
        setTemplateVariables({});
        setActiveTab('templates');
        return;
      }
    }

    // For prompts and quick actions, inject directly
    PromptService.injectPromptToInput({
      id: suggestion.id,
      title: suggestion.title,
      content: suggestion.content,
      category: suggestion.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
    });
    onClose();
  };

  const handleUseTemplate = (template: SmartTemplate) => {
    const processedContent = SmartSuggestionService.processTemplate(template, templateVariables);

    PromptService.injectPromptToInput({
      id: template.id,
      title: template.name,
      content: processedContent,
      category: template.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
    });
    onClose();
  };

  const handleCreateTemplate = () => {
    if (!templateForm.name || !templateForm.template) return;

    const newTemplate: SmartTemplate = {
      id: `custom-${Date.now()}`,
      name: templateForm.name,
      description: templateForm.description,
      category: templateForm.category,
      template: templateForm.template,
      variables: templateForm.variables,
      usage: templateForm.usage,
    };

    const success = SmartSuggestionService.saveCustomTemplate(newTemplate);
    if (success) {
      loadData();
      setShowCreateTemplate(false);
      setTemplateForm({
        name: '',
        description: '',
        category: 'general',
        template: '',
        variables: [],
        usage: '',
      });
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      const success = SmartSuggestionService.deleteCustomTemplate(templateId);
      if (success) {
        loadData();
      }
    }
  };

  const addVariable = () => {
    const variableName = prompt('Enter variable name:');
    if (variableName && !templateForm.variables.includes(variableName)) {
      setTemplateForm({
        ...templateForm,
        variables: [...templateForm.variables, variableName],
      });
    }
  };

  const removeVariable = (variable: string) => {
    setTemplateForm({
      ...templateForm,
      variables: templateForm.variables.filter((v) => v !== variable),
    });
  };

  if (!isVisible) return null;

  return (
    <div className="smart-suggestion-panel-overlay">
      <div className="smart-suggestion-panel">
        <div className="smart-suggestion-panel-header">
          <h2>⚡ Smart Suggestions</h2>
          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="smart-suggestion-panel-content">
          {/* Context display */}
          {context && (
            <div className="context-display">
              <h4>Context:</h4>
              <p>{context.length > 100 ? `${context.substring(0, 100)}...` : context}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="suggestion-tabs">
            <button
              className={`suggestion-tab ${activeTab === 'suggestions' ? 'active' : ''}`}
              onClick={() => setActiveTab('suggestions')}
            >
              Suggestions ({suggestions.length})
            </button>
            <button
              className={`suggestion-tab ${activeTab === 'templates' ? 'active' : ''}`}
              onClick={() => setActiveTab('templates')}
            >
              Templates ({templates.length})
            </button>
            <button
              className={`suggestion-tab ${activeTab === 'quick_actions' ? 'active' : ''}`}
              onClick={() => setActiveTab('quick_actions')}
            >
              Quick Actions ({quickActions.length})
            </button>
          </div>

          {/* Suggestions Tab */}
          {activeTab === 'suggestions' && (
            <div className="suggestion-tab-content">
              {suggestions.length === 0 ? (
                <div className="empty-state">
                  <p>No suggestions available. Try typing something in the chat!</p>
                </div>
              ) : (
                <div className="suggestions-list">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="suggestion-item"
                    >
                      <div className="suggestion-header">
                        <h4>{suggestion.title}</h4>
                        <div className="suggestion-meta">
                          <span className="suggestion-category">{suggestion.category}</span>
                          <span className="suggestion-confidence">
                            {Math.round(suggestion.confidence * 100)}% match
                          </span>
                        </div>
                      </div>
                      <p className="suggestion-reason">{suggestion.reason}</p>
                      <div className="suggestion-content">
                        {suggestion.content.length > 150
                          ? `${suggestion.content.substring(0, 150)}...`
                          : suggestion.content}
                      </div>
                      <button
                        className="use-suggestion-btn"
                        onClick={() => handleUseSuggestion(suggestion)}
                      >
                        Use This
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="suggestion-tab-content">
              <div className="templates-header">
                <h3>Smart Templates</h3>
                <button
                  className="create-template-btn"
                  onClick={() => setShowCreateTemplate(true)}
                >
                  + Create Template
                </button>
              </div>

              {templates.length === 0 ? (
                <div className="empty-state">
                  <p>No templates available.</p>
                </div>
              ) : (
                <div className="templates-list">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="template-item"
                    >
                      <div className="template-header">
                        <h4>{template.name}</h4>
                        <div className="template-actions">
                          <button
                            className="use-template-btn"
                            onClick={() => handleUseTemplate(template)}
                          >
                            Use
                          </button>
                          {template.id.startsWith('custom-') && (
                            <button
                              className="delete-template-btn"
                              onClick={() => handleDeleteTemplate(template.id)}
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="template-description">{template.description}</p>
                      <div className="template-variables">
                        {template.variables.map((variable) => (
                          <input
                            key={variable}
                            type="text"
                            placeholder={`${variable}...`}
                            value={templateVariables[variable] || ''}
                            onChange={(e) =>
                              setTemplateVariables({
                                ...templateVariables,
                                [variable]: e.target.value,
                              })
                            }
                            className="template-variable-input"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Create Template Form */}
              {showCreateTemplate && (
                <div className="create-template-form">
                  <h3>Create Smart Template</h3>

                  <input
                    type="text"
                    placeholder="Template name"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                    className="form-input"
                  />

                  <input
                    type="text"
                    placeholder="Description"
                    value={templateForm.description}
                    onChange={(e) =>
                      setTemplateForm({ ...templateForm, description: e.target.value })
                    }
                    className="form-input"
                  />

                  <select
                    value={templateForm.category}
                    onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="general">General</option>
                    <option value="coding">Coding</option>
                    <option value="writing">Writing</option>
                    <option value="analysis">Analysis</option>
                    <option value="communication">Communication</option>
                    <option value="learning">Learning</option>
                  </select>

                  <textarea
                    placeholder="Template content (use {variable} for placeholders)"
                    value={templateForm.template}
                    onChange={(e) => setTemplateForm({ ...templateForm, template: e.target.value })}
                    className="form-textarea"
                    rows={4}
                  />

                  <div className="variables-section">
                    <h4>Variables</h4>
                    <div className="variables-list">
                      {templateForm.variables.map((variable) => (
                        <div
                          key={variable}
                          className="variable-item"
                        >
                          <span>{variable}</span>
                          <button onClick={() => removeVariable(variable)}>×</button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={addVariable}
                      className="add-variable-btn"
                    >
                      + Add Variable
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Usage instructions"
                    value={templateForm.usage}
                    onChange={(e) => setTemplateForm({ ...templateForm, usage: e.target.value })}
                    className="form-input"
                  />

                  <div className="form-actions">
                    <button
                      className="save-btn"
                      onClick={handleCreateTemplate}
                    >
                      Create Template
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setShowCreateTemplate(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions Tab */}
          {activeTab === 'quick_actions' && (
            <div className="suggestion-tab-content">
              {quickActions.length === 0 ? (
                <div className="empty-state">
                  <p>No quick actions available for this context.</p>
                </div>
              ) : (
                <div className="quick-actions-list">
                  {quickActions.map((action) => (
                    <div
                      key={action.id}
                      className="quick-action-item"
                    >
                      <div className="quick-action-header">
                        <h4>{action.title}</h4>
                        <span className="quick-action-confidence">
                          {Math.round(action.confidence * 100)}% relevant
                        </span>
                      </div>
                      <p className="quick-action-reason">{action.reason}</p>
                      <button
                        className="use-quick-action-btn"
                        onClick={() => handleUseSuggestion(action)}
                      >
                        Use Action
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartSuggestionPanel;
