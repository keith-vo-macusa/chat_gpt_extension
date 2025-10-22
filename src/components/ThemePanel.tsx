import React, { useState, useEffect } from 'react';
import {
  Theme,
  CustomTheme,
  LayoutSettings,
  PersonalizationSettings,
  NotificationSettings,
} from '../types';
import { ThemeService } from '../services/ThemeService';
import { NotificationService } from '../services/NotificationService';

interface ThemePanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const ThemePanel: React.FC<ThemePanelProps> = ({ isVisible, onClose }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(ThemeService.getCurrentTheme());
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([]);
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>(
    ThemeService.getLayoutSettings()
  );
  const [personalization, setPersonalization] = useState<PersonalizationSettings>(
    ThemeService.getPersonalizationSettings()
  );
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(
    NotificationService.getSettings()
  );
  const [activeTab, setActiveTab] = useState<
    'themes' | 'layout' | 'personalization' | 'notifications'
  >('themes');
  const [showCreateTheme, setShowCreateTheme] = useState(false);
  const [customThemeForm, setCustomThemeForm] = useState({
    name: '',
    colors: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#111827',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      accent: '#10b981',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  });

  useEffect(() => {
    if (isVisible) {
      loadData();
    }
  }, [isVisible]);

  const loadData = () => {
    setAvailableThemes(ThemeService.getAvailableThemes());
    setCustomThemes(ThemeService.getCustomThemes());
    setCurrentTheme(ThemeService.getCurrentTheme());
    setLayoutSettings(ThemeService.getLayoutSettings());
    setPersonalization(ThemeService.getPersonalizationSettings());
    setNotificationSettings(NotificationService.getSettings());
  };

  const handleThemeChange = (themeId: string) => {
    const success = ThemeService.setCurrentTheme(themeId);
    if (success) {
      setCurrentTheme(ThemeService.getCurrentTheme());
    }
  };

  const handleLayoutChange = (newSettings: Partial<LayoutSettings>) => {
    const updatedSettings = { ...layoutSettings, ...newSettings };
    setLayoutSettings(updatedSettings);
    ThemeService.setLayoutSettings(updatedSettings);
  };

  const handlePersonalizationChange = (newSettings: Partial<PersonalizationSettings>) => {
    const updatedSettings = { ...personalization, ...newSettings };
    setPersonalization(updatedSettings);
    ThemeService.setPersonalizationSettings(updatedSettings);
  };

  const handleNotificationChange = (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...notificationSettings, ...newSettings };
    setNotificationSettings(updatedSettings);
    NotificationService.updateSettings(updatedSettings);
  };

  const handleTestNotification = async () => {
    try {
      await NotificationService.showTestNotification();
    } catch (error) {
      alert('Error showing test notification: ' + (error as Error).message);
    }
  };

  const handleDebugNotification = () => {
    NotificationService.debugCurrentState();
  };

  const handleCreateCustomTheme = () => {
    const newTheme: CustomTheme = {
      ...customThemeForm,
      id: `custom-${Date.now()}`,
      isCustom: true,
      userId: 'user',
      createdAt: new Date().toISOString(),
      fonts: {
        primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        secondary:
          'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      },
      borderRadius: '8px',
      shadows: {
        small: '0 1px 3px rgba(0, 0, 0, 0.1)',
        medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        large: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    };

    const success = ThemeService.saveCustomTheme(newTheme);
    if (success) {
      loadData();
      setShowCreateTheme(false);
      setCustomThemeForm({
        name: '',
        colors: {
          primary: '#3b82f6',
          secondary: '#6b7280',
          background: '#ffffff',
          surface: '#f9fafb',
          text: '#111827',
          textSecondary: '#6b7280',
          border: '#e5e7eb',
          accent: '#10b981',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        },
      });
    }
  };

  const handleDeleteCustomTheme = (themeId: string) => {
    if (confirm('Are you sure you want to delete this custom theme?')) {
      const success = ThemeService.deleteCustomTheme(themeId);
      if (success) {
        loadData();
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div className="theme-panel-overlay">
      <div className="theme-panel">
        <div className="theme-panel-header">
          <h2>🎨 Theme & Settings</h2>
          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="theme-panel-content">
          {/* Tabs */}
          <div className="theme-tabs">
            <button
              className={`theme-tab ${activeTab === 'themes' ? 'active' : ''}`}
              onClick={() => setActiveTab('themes')}
            >
              Themes
            </button>
            <button
              className={`theme-tab ${activeTab === 'layout' ? 'active' : ''}`}
              onClick={() => setActiveTab('layout')}
            >
              Layout
            </button>
            <button
              className={`theme-tab ${activeTab === 'personalization' ? 'active' : ''}`}
              onClick={() => setActiveTab('personalization')}
            >
              Personal
            </button>
            <button
              className={`theme-tab ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
          </div>

          {/* Themes Tab */}
          {activeTab === 'themes' && (
            <div className="theme-tab-content">
              <div className="themes-section">
                <h3>Available Themes</h3>
                <div className="themes-grid">
                  {availableThemes.map((theme) => (
                    <div
                      key={theme.id}
                      className={`theme-card ${currentTheme.id === theme.id ? 'active' : ''}`}
                      onClick={() => handleThemeChange(theme.id)}
                    >
                      <div
                        className="theme-preview"
                        style={{ backgroundColor: theme.colors.background }}
                      >
                        <div
                          className="theme-preview-header"
                          style={{ backgroundColor: theme.colors.surface }}
                        >
                          <div
                            className="theme-preview-dot"
                            style={{ backgroundColor: theme.colors.primary }}
                          ></div>
                          <div
                            className="theme-preview-dot"
                            style={{ backgroundColor: theme.colors.secondary }}
                          ></div>
                          <div
                            className="theme-preview-dot"
                            style={{ backgroundColor: theme.colors.accent }}
                          ></div>
                        </div>
                        <div className="theme-preview-content">
                          <div
                            className="theme-preview-text"
                            style={{ color: theme.colors.text }}
                          >
                            Sample text
                          </div>
                          <div
                            className="theme-preview-text-secondary"
                            style={{ color: theme.colors.textSecondary }}
                          >
                            Secondary text
                          </div>
                        </div>
                      </div>
                      <div className="theme-info">
                        <h4>{theme.name}</h4>
                        {theme.id.startsWith('custom-') && (
                          <button
                            className="delete-theme-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCustomTheme(theme.id);
                            }}
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="create-theme-btn"
                  onClick={() => setShowCreateTheme(true)}
                >
                  + Create Custom Theme
                </button>
              </div>

              {/* Create Custom Theme Form */}
              {showCreateTheme && (
                <div className="create-theme-form">
                  <h3>Create Custom Theme</h3>
                  <input
                    type="text"
                    placeholder="Theme name"
                    value={customThemeForm.name}
                    onChange={(e) =>
                      setCustomThemeForm({ ...customThemeForm, name: e.target.value })
                    }
                    className="form-input"
                  />

                  <div className="color-picker-grid">
                    {Object.entries(customThemeForm.colors).map(([key, value]) => (
                      <div
                        key={key}
                        className="color-picker-item"
                      >
                        <label>{key}</label>
                        <input
                          type="color"
                          value={value}
                          onChange={(e) =>
                            setCustomThemeForm({
                              ...customThemeForm,
                              colors: { ...customThemeForm.colors, [key]: e.target.value },
                            })
                          }
                          className="color-input"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="form-actions">
                    <button
                      className="save-btn"
                      onClick={handleCreateCustomTheme}
                    >
                      Create Theme
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setShowCreateTheme(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Layout Tab */}
          {activeTab === 'layout' && (
            <div className="theme-tab-content">
              <div className="layout-section">
                <h3>Panel Layout</h3>

                <div className="setting-group">
                  <label>Position</label>
                  <select
                    value={layoutSettings.position}
                    onChange={(e) =>
                      handleLayoutChange({
                        position: e.target.value as 'right' | 'left' | 'bottom',
                      })
                    }
                    className="form-select"
                  >
                    <option value="right">Right</option>
                    <option value="left">Left</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>

                <div className="setting-group">
                  <label>Size</label>
                  <select
                    value={layoutSettings.size}
                    onChange={(e) =>
                      handleLayoutChange({ size: e.target.value as 'small' | 'medium' | 'large' })
                    }
                    className="form-select"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div className="setting-group">
                  <label>Opacity: {Math.round(layoutSettings.opacity * 100)}%</label>
                  <input
                    type="range"
                    min="0.3"
                    max="1"
                    step="0.1"
                    value={layoutSettings.opacity}
                    onChange={(e) => handleLayoutChange({ opacity: parseFloat(e.target.value) })}
                    className="form-range"
                  />
                </div>

                <div className="setting-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={layoutSettings.autoHide}
                      onChange={(e) => handleLayoutChange({ autoHide: e.target.checked })}
                    />
                    Auto-hide panel
                  </label>
                </div>

                <div className="setting-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={layoutSettings.showLabels}
                      onChange={(e) => handleLayoutChange({ showLabels: e.target.checked })}
                    />
                    Show button labels
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Personalization Tab */}
          {activeTab === 'personalization' && (
            <div className="theme-tab-content">
              <div className="personalization-section">
                <h3>Personalization</h3>

                <div className="setting-group">
                  <label>Nickname</label>
                  <input
                    type="text"
                    value={personalization.nickname}
                    onChange={(e) => handlePersonalizationChange({ nickname: e.target.value })}
                    className="form-input"
                    placeholder="Enter your nickname"
                  />
                </div>

                <div className="setting-group">
                  <label>Avatar URL</label>
                  <input
                    type="url"
                    value={personalization.avatar}
                    onChange={(e) => handlePersonalizationChange({ avatar: e.target.value })}
                    className="form-input"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div className="setting-group">
                  <label>Language</label>
                  <select
                    value={personalization.language}
                    onChange={(e) =>
                      handlePersonalizationChange({ language: e.target.value as 'vi' | 'en' })
                    }
                    className="form-select"
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="setting-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={personalization.showWelcomeMessage}
                      onChange={(e) =>
                        handlePersonalizationChange({ showWelcomeMessage: e.target.checked })
                      }
                    />
                    Show welcome message
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="theme-tab-content">
              <div className="notifications-section">
                <h3>Browser Notifications</h3>

                <div className="setting-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={notificationSettings.enabled}
                      onChange={(e) => handleNotificationChange({ enabled: e.target.checked })}
                    />
                    Enable notifications when ChatGPT responds
                  </label>
                </div>

                <div className="setting-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={notificationSettings.sound}
                      onChange={(e) => handleNotificationChange({ sound: e.target.checked })}
                    />
                    Play sound with notification
                  </label>
                </div>

                <div className="setting-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={notificationSettings.vibration}
                      onChange={(e) => handleNotificationChange({ vibration: e.target.checked })}
                    />
                    Vibrate device (mobile only)
                  </label>
                </div>

                <div className="setting-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={notificationSettings.showPreview}
                      onChange={(e) => handleNotificationChange({ showPreview: e.target.checked })}
                    />
                    Show response preview in notification
                  </label>
                </div>

                <div className="setting-group">
                  <label>Custom notification message</label>
                  <input
                    type="text"
                    value={notificationSettings.customMessage}
                    onChange={(e) => handleNotificationChange({ customMessage: e.target.value })}
                    className="form-input"
                    placeholder="Enter custom message..."
                  />
                </div>

                <div className="setting-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={notificationSettings.autoClose}
                      onChange={(e) => handleNotificationChange({ autoClose: e.target.checked })}
                    />
                    Auto-close notification
                  </label>
                </div>

                {notificationSettings.autoClose && (
                  <div className="setting-group">
                    <label>Auto-close delay: {notificationSettings.closeDelay} seconds</label>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={notificationSettings.closeDelay}
                      onChange={(e) =>
                        handleNotificationChange({ closeDelay: parseInt(e.target.value) })
                      }
                      className="form-range"
                    />
                  </div>
                )}

                <div className="setting-group">
                  <button
                    className="test-notification-btn"
                    onClick={handleTestNotification}
                    disabled={!notificationSettings.enabled}
                  >
                    🔔 Test Notification
                  </button>
                  <button
                    className="debug-notification-btn"
                    onClick={handleDebugNotification}
                  >
                    🐛 Debug Status
                  </button>
                </div>

                <div className="notification-status">
                  <p>
                    <strong>Status:</strong>{' '}
                    {NotificationService.isSupported() ? '✅ Supported' : '❌ Not supported'}
                  </p>
                  <p>
                    <strong>Permission:</strong>{' '}
                    {NotificationService.hasPermission() ? '✅ Granted' : '❌ Denied'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemePanel;
