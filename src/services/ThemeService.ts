export interface Theme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    accent: string
    success: string
    warning: string
    error: string
  }
  fonts: {
    primary: string
    secondary: string
  }
  borderRadius: string
  shadows: {
    small: string
    medium: string
    large: string
  }
}

export interface CustomTheme extends Theme {
  isCustom: true
  userId: string
  createdAt: string
}

export interface LayoutSettings {
  position: 'right' | 'left' | 'bottom'
  size: 'small' | 'medium' | 'large'
  opacity: number
  autoHide: boolean
  showLabels: boolean
}

export interface PersonalizationSettings {
  nickname: string
  avatar: string
  showWelcomeMessage: boolean
  language: 'vi' | 'en'
}

export class ThemeService {
  private static readonly STORAGE_KEY_THEME = 'chatgpt-theme-manager-current-theme'
  private static readonly STORAGE_KEY_CUSTOM_THEMES = 'chatgpt-theme-manager-custom-themes'
  private static readonly STORAGE_KEY_LAYOUT = 'chatgpt-theme-manager-layout'
  private static readonly STORAGE_KEY_PERSONALIZATION = 'chatgpt-theme-manager-personalization'

  // Default themes
  private static readonly DEFAULT_THEMES: Theme[] = [
    {
      id: 'light',
      name: 'Light',
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
        error: '#ef4444'
      },
      fonts: {
        primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        secondary: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
      },
      borderRadius: '8px',
      shadows: {
        small: '0 1px 3px rgba(0, 0, 0, 0.1)',
        medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        large: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }
    },
    {
      id: 'dark',
      name: 'Dark',
      colors: {
        primary: '#60a5fa',
        secondary: '#9ca3af',
        background: '#1f2937',
        surface: '#374151',
        text: '#f9fafb',
        textSecondary: '#9ca3af',
        border: '#4b5563',
        accent: '#34d399',
        success: '#34d399',
        warning: '#fbbf24',
        error: '#f87171'
      },
      fonts: {
        primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        secondary: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
      },
      borderRadius: '8px',
      shadows: {
        small: '0 1px 3px rgba(0, 0, 0, 0.3)',
        medium: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        large: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
      }
    },
    {
      id: 'neon',
      name: 'Neon',
      colors: {
        primary: '#00ff88',
        secondary: '#ff0080',
        background: '#0a0a0a',
        surface: '#1a1a1a',
        text: '#00ff88',
        textSecondary: '#ff0080',
        border: '#333333',
        accent: '#00ffff',
        success: '#00ff88',
        warning: '#ffff00',
        error: '#ff0080'
      },
      fonts: {
        primary: '"Courier New", Courier, monospace',
        secondary: '"Courier New", Courier, monospace'
      },
      borderRadius: '4px',
      shadows: {
        small: '0 0 10px rgba(0, 255, 136, 0.3)',
        medium: '0 0 20px rgba(0, 255, 136, 0.4)',
        large: '0 0 30px rgba(0, 255, 136, 0.5)'
      }
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      colors: {
        primary: '#000000',
        secondary: '#666666',
        background: '#ffffff',
        surface: '#ffffff',
        text: '#000000',
        textSecondary: '#666666',
        border: '#e0e0e0',
        accent: '#000000',
        success: '#000000',
        warning: '#666666',
        error: '#000000'
      },
      fonts: {
        primary: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        secondary: '"Helvetica Neue", Helvetica, Arial, sans-serif'
      },
      borderRadius: '0px',
      shadows: {
        small: 'none',
        medium: '0 2px 4px rgba(0, 0, 0, 0.1)',
        large: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }
    }
  ]

  // Get all available themes
  static getAvailableThemes(): Theme[] {
    return [...this.DEFAULT_THEMES, ...this.getCustomThemes()]
  }

  // Get current theme
  static getCurrentTheme(): Theme {
    try {
      const themeId = localStorage.getItem(this.STORAGE_KEY_THEME) || 'light'
      const themes = this.getAvailableThemes()
      return themes.find(theme => theme.id === themeId) || this.DEFAULT_THEMES[0]
    } catch (error) {
      console.error('Error loading current theme:', error)
      return this.DEFAULT_THEMES[0]
    }
  }

  // Set current theme
  static setCurrentTheme(themeId: string): boolean {
    try {
      const themes = this.getAvailableThemes()
      const theme = themes.find(t => t.id === themeId)
      if (theme) {
        localStorage.setItem(this.STORAGE_KEY_THEME, themeId)
        this.applyTheme(theme)
        return true
      }
      return false
    } catch (error) {
      console.error('Error setting theme:', error)
      return false
    }
  }

  // Apply theme to DOM
  static applyTheme(theme: Theme): void {
    const root = document.documentElement
    const colors = theme.colors

    // Apply CSS custom properties
    root.style.setProperty('--theme-primary', colors.primary)
    root.style.setProperty('--theme-secondary', colors.secondary)
    root.style.setProperty('--theme-background', colors.background)
    root.style.setProperty('--theme-surface', colors.surface)
    root.style.setProperty('--theme-text', colors.text)
    root.style.setProperty('--theme-text-secondary', colors.textSecondary)
    root.style.setProperty('--theme-border', colors.border)
    root.style.setProperty('--theme-accent', colors.accent)
    root.style.setProperty('--theme-success', colors.success)
    root.style.setProperty('--theme-warning', colors.warning)
    root.style.setProperty('--theme-error', colors.error)

    // Apply fonts
    root.style.setProperty('--theme-font-primary', theme.fonts.primary)
    root.style.setProperty('--theme-font-secondary', theme.fonts.secondary)

    // Apply other properties
    root.style.setProperty('--theme-border-radius', theme.borderRadius)
    root.style.setProperty('--theme-shadow-small', theme.shadows.small)
    root.style.setProperty('--theme-shadow-medium', theme.shadows.medium)
    root.style.setProperty('--theme-shadow-large', theme.shadows.large)

    // Add theme class to body
    document.body.className = document.body.className.replace(/theme-\w+/g, '')
    document.body.classList.add(`theme-${theme.id}`)
  }

  // Custom themes
  static getCustomThemes(): CustomTheme[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY_CUSTOM_THEMES)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading custom themes:', error)
      return []
    }
  }

  static saveCustomTheme(theme: CustomTheme): boolean {
    try {
      const customThemes = this.getCustomThemes()
      const existingIndex = customThemes.findIndex(t => t.id === theme.id)

      if (existingIndex >= 0) {
        customThemes[existingIndex] = theme
      } else {
        customThemes.push(theme)
      }

      localStorage.setItem(this.STORAGE_KEY_CUSTOM_THEMES, JSON.stringify(customThemes))
      return true
    } catch (error) {
      console.error('Error saving custom theme:', error)
      return false
    }
  }

  static deleteCustomTheme(themeId: string): boolean {
    try {
      const customThemes = this.getCustomThemes()
      const filtered = customThemes.filter(t => t.id !== themeId)
      localStorage.setItem(this.STORAGE_KEY_CUSTOM_THEMES, JSON.stringify(filtered))
      return true
    } catch (error) {
      console.error('Error deleting custom theme:', error)
      return false
    }
  }

  // Layout settings
  static getLayoutSettings(): LayoutSettings {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY_LAYOUT)
      return data ? JSON.parse(data) : {
        position: 'right',
        size: 'medium',
        opacity: 1,
        autoHide: false,
        showLabels: true
      }
    } catch (error) {
      console.error('Error loading layout settings:', error)
      return {
        position: 'right',
        size: 'medium',
        opacity: 1,
        autoHide: false,
        showLabels: true
      }
    }
  }

  static setLayoutSettings(settings: LayoutSettings): boolean {
    try {
      localStorage.setItem(this.STORAGE_KEY_LAYOUT, JSON.stringify(settings))
      this.applyLayoutSettings(settings)
      return true
    } catch (error) {
      console.error('Error saving layout settings:', error)
      return false
    }
  }

  static applyLayoutSettings(settings: LayoutSettings): void {
    const root = document.documentElement

    // Apply position
    root.style.setProperty('--panel-position', settings.position)

    // Apply size
    const sizeMap = { small: '40px', medium: '48px', large: '56px' }
    root.style.setProperty('--panel-size', sizeMap[settings.size])

    // Apply opacity
    root.style.setProperty('--panel-opacity', settings.opacity.toString())

    // Apply auto-hide
    if (settings.autoHide) {
      document.body.classList.add('panel-auto-hide')
    } else {
      document.body.classList.remove('panel-auto-hide')
    }

    // Apply labels
    if (settings.showLabels) {
      document.body.classList.add('panel-show-labels')
    } else {
      document.body.classList.remove('panel-show-labels')
    }
  }

  // Personalization settings
  static getPersonalizationSettings(): PersonalizationSettings {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY_PERSONALIZATION)
      return data ? JSON.parse(data) : {
        nickname: 'User',
        avatar: '',
        showWelcomeMessage: true,
        language: 'vi'
      }
    } catch (error) {
      console.error('Error loading personalization settings:', error)
      return {
        nickname: 'User',
        avatar: '',
        showWelcomeMessage: true,
        language: 'vi'
      }
    }
  }

  static setPersonalizationSettings(settings: PersonalizationSettings): boolean {
    try {
      localStorage.setItem(this.STORAGE_KEY_PERSONALIZATION, JSON.stringify(settings))
      return true
    } catch (error) {
      console.error('Error saving personalization settings:', error)
      return false
    }
  }

  // Initialize theme system
  static initialize(): void {
    const currentTheme = this.getCurrentTheme()
    const layoutSettings = this.getLayoutSettings()

    this.applyTheme(currentTheme)
    this.applyLayoutSettings(layoutSettings)
  }
}
