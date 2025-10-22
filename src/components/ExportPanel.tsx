import React, { useState, useRef } from 'react'
import { ExportService, ExportOptions } from '../services/ExportService'
import { UserMessage } from '../types'

interface ExportPanelProps {
  userMessages: UserMessage[]
  isVisible: boolean
  onClose: () => void
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  userMessages,
  isVisible,
  onClose
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'txt',
    includeTimestamps: false,
    includeMessageNumbers: true,
    includeMetadata: true
  })
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const exportService = ExportService.getInstance()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = async () => {
    if (userMessages.length === 0) {
      alert('Không có tin nhắn nào để xuất!')
      return
    }

    setIsExporting(true)
    setExportProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      const blob = await exportService.exportMessages(userMessages, exportOptions)
      const metadata = exportService.generateMetadata(userMessages)
      const filename = exportService.generateFilename(exportOptions.format, metadata)

      await exportService.downloadFile(blob, filename)

      clearInterval(progressInterval)
      setExportProgress(100)

      setTimeout(() => {
        setIsExporting(false)
        setExportProgress(0)
        onClose()
      }, 1000)

    } catch (error) {
      console.error('Export failed:', error)
      alert('Xuất file thất bại! Vui lòng thử lại.')
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  const handleFormatChange = (format: 'txt' | 'md' | 'json' | 'csv') => {
    setExportOptions(prev => ({ ...prev, format }))
  }

  const handleOptionChange = (key: keyof ExportOptions, value: boolean) => {
    setExportOptions(prev => ({ ...prev, [key]: value }))
  }

  const getStats = () => {
    return exportService.getConversationStats(userMessages)
  }

  const stats = getStats()

  if (!isVisible) return null

  return (
    <div className="export-panel">
      <div className="export-header">
        <h3>📤 Xuất tin nhắn</h3>
        <button
          className="export-close-btn"
          onClick={onClose}
          title="Đóng xuất tin nhắn"
        >
          ✕
        </button>
      </div>

      <div className="export-content">
        {/* Statistics */}
        <div className="export-stats">
          <h4>📊 Thống kê hội thoại</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Tổng tin nhắn:</span>
              <span className="stat-value">{stats.totalMessages}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tổng ký tự:</span>
              <span className="stat-value">{stats.totalCharacters.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tổng từ:</span>
              <span className="stat-value">{stats.totalWords.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Độ dài TB:</span>
              <span className="stat-value">{stats.averageMessageLength} ký tự</span>
            </div>
          </div>
        </div>

        {/* Export Format */}
        <div className="export-section">
          <h4>📄 Định dạng xuất</h4>
          <div className="format-options">
            {[
              { value: 'txt', label: 'Text (.txt)', icon: '📝' },
              { value: 'md', label: 'Markdown (.md)', icon: '📋' },
              { value: 'json', label: 'JSON (.json)', icon: '🔧' },
              { value: 'csv', label: 'CSV (.csv)', icon: '📊' }
            ].map(format => (
              <label key={format.value} className="format-option">
                <input
                  type="radio"
                  name="format"
                  value={format.value}
                  checked={exportOptions.format === format.value}
                  onChange={() => handleFormatChange(format.value as any)}
                />
                <span className="format-icon">{format.icon}</span>
                <span className="format-label">{format.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div className="export-section">
          <h4>⚙️ Tùy chọn xuất</h4>
          <div className="export-options">
            <label className="export-option">
              <input
                type="checkbox"
                checked={exportOptions.includeMetadata}
                onChange={(e) => handleOptionChange('includeMetadata', e.target.checked)}
              />
              <span>Bao gồm thông tin hội thoại</span>
            </label>
            <label className="export-option">
              <input
                type="checkbox"
                checked={exportOptions.includeMessageNumbers}
                onChange={(e) => handleOptionChange('includeMessageNumbers', e.target.checked)}
              />
              <span>Đánh số tin nhắn</span>
            </label>
            <label className="export-option">
              <input
                type="checkbox"
                checked={exportOptions.includeTimestamps}
                onChange={(e) => handleOptionChange('includeTimestamps', e.target.checked)}
              />
              <span>Bao gồm thời gian</span>
            </label>
          </div>
        </div>

        {/* Preview */}
        <div className="export-section">
          <h4>👁️ Xem trước</h4>
          <div className="export-preview">
            <div className="preview-header">
              <span>File: chatgpt_conversation_{new Date().toISOString().split('T')[0]}.{exportOptions.format}</span>
              <span>Kích thước: ~{Math.round(stats.totalCharacters / 1000)}KB</span>
            </div>
            <div className="preview-content">
              {exportOptions.format === 'txt' && (
                <pre>{`# ChatGPT Conversation

**Export Date:** ${new Date().toLocaleString()}
**Message Count:** ${stats.totalMessages}
**Total Characters:** ${stats.totalCharacters}

---

## Message 1

${userMessages[0]?.text.substring(0, 100)}...`}</pre>
              )}
              {exportOptions.format === 'md' && (
                <pre>{`# ChatGPT Conversation

> **Export Information**
> - **Date:** ${new Date().toLocaleString()}
> - **Messages:** ${stats.totalMessages}
> - **Characters:** ${stats.totalCharacters}

---

## Message 1

${userMessages[0]?.text.substring(0, 100)}...`}</pre>
              )}
              {exportOptions.format === 'json' && (
                <pre>{`{
  "metadata": {
    "title": "ChatGPT Conversation",
    "exportDate": "${new Date().toISOString()}",
    "messageCount": ${stats.totalMessages}
  },
  "messages": [
    {
      "index": 1,
      "text": "${userMessages[0]?.text.substring(0, 50)}...",
      "timestamp": "${new Date().toISOString()}"
    }
  ]
}`}</pre>
              )}
              {exportOptions.format === 'csv' && (
                <pre>{`Message Number,Text,Character Count,Word Count
1,"${userMessages[0]?.text.substring(0, 50)}...",${userMessages[0]?.text.length},${userMessages[0]?.text.split(/\s+/).length}`}</pre>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="export-footer">
        <div className="export-actions">
          <button
            className="export-btn"
            onClick={handleExport}
            disabled={isExporting || userMessages.length === 0}
          >
            {isExporting ? (
              <>
                <span className="export-spinner">⏳</span>
                Đang xuất... {exportProgress}%
              </>
            ) : (
              <>
                <span>📥</span>
                Xuất file
              </>
            )}
          </button>
          <button
            className="export-cancel-btn"
            onClick={onClose}
            disabled={isExporting}
          >
            Hủy
          </button>
        </div>

        {isExporting && (
          <div className="export-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
