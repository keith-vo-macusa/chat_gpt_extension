import React, { useState, useEffect } from 'react';
import { CodeMinifierService } from '../services/CodeMinifierService';
import { KEYBOARD_SHORTCUTS } from '../utils/constants';

interface CodeMinifierPanelProps {
  isVisible: boolean;
  onClose: () => void;
  initialContent?: string;
}

const CodeMinifierPanel: React.FC<CodeMinifierPanelProps> = ({
  isVisible,
  onClose,
  initialContent = '',
}) => {
  const [originalContent, setOriginalContent] = useState(initialContent);
  const [minifiedContent, setMinifiedContent] = useState('');
  const [codeType, setCodeType] = useState('');
  const [stats, setStats] = useState({
    originalSize: 0,
    minifiedSize: 0,
    reduction: 0,
    reductionPercentage: 0,
  });
  const [options, setOptions] = useState({
    removeComments: true,
    removeWhitespace: true,
    removeEmptyLines: true,
    preserveStrings: true,
    minifyHtml: true,
    minifyCss: true,
    minifyJs: true,
  });

  const minifier = CodeMinifierService.getInstance();

  useEffect(() => {
    if (originalContent) {
      const detectedType = minifier.detectCodeType(originalContent);
      setCodeType(detectedType);
      minifyCode();
    }
  }, [originalContent, options]);

  const minifyCode = () => {
    if (!originalContent.trim()) {
      setMinifiedContent('');
      setStats({ originalSize: 0, minifiedSize: 0, reduction: 0, reductionPercentage: 0 });
      return;
    }

    const minified = minifier.minify(originalContent, options);
    setMinifiedContent(minified);

    const minificationStats = minifier.getMinificationStats(originalContent, minified);
    setStats(minificationStats);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      // You could add a toast notification here
      console.log('Code copied to clipboard');
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.ctrlKey && event.key === KEYBOARD_SHORTCUTS.M) {
      event.preventDefault();
      minifyCode();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="code-minifier-panel"
      onKeyDown={handleKeyDown}
    >
      <div className="panel-header">
        <h3>Code Minifier</h3>
        <div className="panel-controls">
          <span className="code-type-badge">{codeType.toUpperCase()}</span>
          <button
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </div>

      <div className="minifier-content">
        <div className="options-section">
          <h4>Minification Options</h4>
          <div className="options-grid">
            <label>
              <input
                type="checkbox"
                checked={options.removeComments}
                onChange={(e) => setOptions({ ...options, removeComments: e.target.checked })}
              />
              Remove Comments
            </label>
            <label>
              <input
                type="checkbox"
                checked={options.removeWhitespace}
                onChange={(e) => setOptions({ ...options, removeWhitespace: e.target.checked })}
              />
              Remove Whitespace
            </label>
            <label>
              <input
                type="checkbox"
                checked={options.removeEmptyLines}
                onChange={(e) => setOptions({ ...options, removeEmptyLines: e.target.checked })}
              />
              Remove Empty Lines
            </label>
            <label>
              <input
                type="checkbox"
                checked={options.preserveStrings}
                onChange={(e) => setOptions({ ...options, preserveStrings: e.target.checked })}
              />
              Preserve Strings
            </label>
          </div>
        </div>

        <div className="content-section">
          <div className="input-section">
            <div className="section-header">
              <h4>Original Code</h4>
              <button
                className="copy-btn"
                onClick={() => copyToClipboard(originalContent)}
                disabled={!originalContent.trim()}
              >
                Copy
              </button>
            </div>
            <textarea
              value={originalContent}
              onChange={(e) => setOriginalContent(e.target.value)}
              placeholder="Paste your code here..."
              className="code-textarea"
              rows={8}
            />
          </div>

          <div className="output-section">
            <div className="section-header">
              <h4>Minified Code</h4>
              <div className="output-controls">
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(minifiedContent)}
                  disabled={!minifiedContent.trim()}
                >
                  Copy
                </button>
                <button
                  className="minify-btn"
                  onClick={minifyCode}
                  disabled={!originalContent.trim()}
                >
                  Minify (Ctrl+M)
                </button>
              </div>
            </div>
            <textarea
              value={minifiedContent}
              readOnly
              className="code-textarea minified"
              rows={8}
            />
          </div>
        </div>

        {stats.originalSize > 0 && (
          <div className="stats-section">
            <h4>Minification Stats</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Original Size:</span>
                <span className="stat-value">{stats.originalSize.toLocaleString()} chars</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Minified Size:</span>
                <span className="stat-value">{stats.minifiedSize.toLocaleString()} chars</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Reduction:</span>
                <span className="stat-value">{stats.reduction.toLocaleString()} chars</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Percentage:</span>
                <span className="stat-value">{stats.reductionPercentage}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeMinifierPanel;
