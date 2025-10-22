import React, { useState, useEffect } from 'react'
import { Prompt, PromptCategory } from '../types'
import { PromptService } from '../services/PromptService'

interface PromptPanelProps {
  isVisible: boolean
  onClose: () => void
}

const PromptPanel: React.FC<PromptPanelProps> = ({ isVisible, onClose }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [categories, setCategories] = useState<PromptCategory[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: ''
  })

  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    color: '#6b7280'
  })

  useEffect(() => {
    if (isVisible) {
      PromptService.initializeDefaults()
      loadData()
    }
  }, [isVisible])

  const loadData = () => {
    setPrompts(PromptService.getPrompts())
    setCategories(PromptService.getCategories())
  }

  const handleCreatePrompt = () => {
    if (!formData.title.trim() || !formData.content.trim()) return

    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)

    PromptService.createPrompt({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags
    })

    setFormData({ title: '', content: '', category: 'general', tags: '' })
    setShowCreateForm(false)
    loadData()
  }

  const handleUpdatePrompt = () => {
    if (!editingPrompt || !formData.title.trim() || !formData.content.trim()) return

    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)

    PromptService.updatePrompt(editingPrompt.id, {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags
    })

    setEditingPrompt(null)
    setFormData({ title: '', content: '', category: 'general', tags: '' })
    loadData()
  }

  const handleDeletePrompt = (id: string) => {
    if (confirm('Are you sure you want to delete this prompt?')) {
      PromptService.deletePrompt(id)
      loadData()
    }
  }

  const handleCreateCategory = () => {
    if (!categoryFormData.name.trim()) return

    PromptService.createCategory({
      name: categoryFormData.name,
      color: categoryFormData.color
    })

    setCategoryFormData({ name: '', color: '#6b7280' })
    setShowCategoryForm(false)
    loadData()
  }

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt)
    setFormData({
      title: prompt.title,
      content: prompt.content,
      category: prompt.category,
      tags: prompt.tags.join(', ')
    })
    setShowCreateForm(true)
  }

  const handleUsePrompt = (prompt: Prompt) => {
    const success = PromptService.injectPromptToInput(prompt)
    if (success) {
      onClose() // Đóng modal sau khi inject thành công
    }
  }

  const filteredPrompts = PromptService.searchPrompts(searchQuery, selectedCategory)

  if (!isVisible) return null

  return (
    <div className="prompt-panel-overlay">
      <div className="prompt-panel">
        <div className="prompt-panel-header">
          <h2>📝 Prompt Manager</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="prompt-panel-content">
          {/* Search and Filter */}
          <div className="search-section">
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-filter"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className="create-prompt-btn"
              onClick={() => {
                setShowCreateForm(true)
                setEditingPrompt(null)
                setFormData({ title: '', content: '', category: 'general', tags: '' })
              }}
            >
              + Create Prompt
            </button>
            <button
              className="create-category-btn"
              onClick={() => setShowCategoryForm(true)}
            >
              + Add Category
            </button>
          </div>

          {/* Create/Edit Form */}
          {showCreateForm && (
            <div className="form-section">
              <h3>{editingPrompt ? 'Edit Prompt' : 'Create New Prompt'}</h3>

              <input
                type="text"
                placeholder="Prompt title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="form-input"
              />

              <textarea
                placeholder="Prompt content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="form-textarea"
                rows={4}
              />

              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-select"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="form-input"
              />

              <div className="form-actions">
                <button
                  className="save-btn"
                  onClick={editingPrompt ? handleUpdatePrompt : handleCreatePrompt}
                >
                  {editingPrompt ? 'Update' : 'Create'}
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingPrompt(null)
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Create Category Form */}
          {showCategoryForm && (
            <div className="form-section">
              <h3>Create New Category</h3>

              <input
                type="text"
                placeholder="Category name"
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                className="form-input"
              />

              <input
                type="color"
                value={categoryFormData.color}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, color: e.target.value })}
                className="color-input"
              />

              <div className="form-actions">
                <button className="save-btn" onClick={handleCreateCategory}>
                  Create
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setShowCategoryForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Prompts List */}
          <div className="prompts-list">
            {filteredPrompts.length === 0 ? (
              <div className="empty-state">
                <p>No prompts found. Create your first prompt!</p>
              </div>
            ) : (
              filteredPrompts.map(prompt => {
                const category = categories.find(c => c.id === prompt.category)
                return (
                  <div key={prompt.id} className="prompt-item">
                    <div className="prompt-header">
                      <h4 className="prompt-title" onClick={() => handleUsePrompt(prompt)}>
                        {prompt.title}
                      </h4>
                      <div className="prompt-actions">
                        <button
                          className="use-btn"
                          onClick={() => handleUsePrompt(prompt)}
                          title="Use this prompt"
                        >
                          Use
                        </button>
                        <button
                          className="edit-btn"
                          onClick={() => handleEditPrompt(prompt)}
                          title="Edit prompt"
                        >
                          ✏️
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeletePrompt(prompt.id)}
                          title="Delete prompt"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className="prompt-content">
                      {prompt.content.length > 100
                        ? `${prompt.content.substring(0, 100)}...`
                        : prompt.content
                      }
                    </div>

                    <div className="prompt-meta">
                      <span
                        className="category-badge"
                        style={{ backgroundColor: category?.color || '#6b7280' }}
                      >
                        {category?.name || 'General'}
                      </span>
                      {prompt.tags.length > 0 && (
                        <div className="tags">
                          {prompt.tags.map(tag => (
                            <span key={tag} className="tag">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromptPanel
