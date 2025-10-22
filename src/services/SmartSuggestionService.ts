import { Prompt } from '../types'
import { PromptService } from './PromptService'

export interface SmartSuggestion {
  id: string
  type: 'prompt' | 'template' | 'quick_action'
  title: string
  content: string
  category: string
  confidence: number
  reason: string
}

export interface SmartTemplate {
  id: string
  name: string
  description: string
  category: string
  template: string
  variables: string[]
  usage: string
}

export class SmartSuggestionService {
  private static readonly STORAGE_KEY_SUGGESTIONS = 'chatgpt-smart-suggestions'
  private static readonly STORAGE_KEY_TEMPLATES = 'chatgpt-smart-templates'

  // Smart templates for different contexts
  private static readonly SMART_TEMPLATES: SmartTemplate[] = [
    {
      id: 'code-review',
      name: 'Code Review',
      description: 'Review code for best practices and improvements',
      category: 'coding',
      template: 'Please review this code and provide feedback on:\n1. Code quality and best practices\n2. Potential bugs or issues\n3. Performance optimizations\n4. Readability improvements\n\nCode:\n{code}',
      variables: ['code'],
      usage: 'Paste your code in the {code} placeholder'
    },
    {
      id: 'explain-concept',
      name: 'Explain Concept',
      description: 'Explain a complex concept in simple terms',
      category: 'learning',
      template: 'Please explain {concept} in simple terms with:\n1. A clear definition\n2. Real-world examples\n3. Common use cases\n4. Related concepts\n\nMake it easy to understand for someone new to the topic.',
      variables: ['concept'],
      usage: 'Replace {concept} with the topic you want explained'
    },
    {
      id: 'write-email',
      name: 'Write Email',
      description: 'Professional email template',
      category: 'communication',
      template: 'Write a professional email to {recipient} about {subject}.\n\nContext: {context}\n\nTone: {tone}\n\nInclude:\n- Clear subject line\n- Professional greeting\n- Main message\n- Call to action\n- Professional closing',
      variables: ['recipient', 'subject', 'context', 'tone'],
      usage: 'Fill in the placeholders for recipient, subject, context, and tone'
    },
    {
      id: 'debug-code',
      name: 'Debug Code',
      description: 'Help debug code issues',
      category: 'coding',
      template: 'I\'m having trouble with this code:\n\n{code}\n\nError message: {error}\n\nExpected behavior: {expected}\n\nPlease help me:\n1. Identify the issue\n2. Explain why it\'s happening\n3. Provide a solution\n4. Suggest prevention strategies',
      variables: ['code', 'error', 'expected'],
      usage: 'Replace placeholders with your code, error message, and expected behavior'
    },
    {
      id: 'create-outline',
      name: 'Create Outline',
      description: 'Create structured outline for content',
      category: 'writing',
      template: 'Create a detailed outline for {topic}.\n\nType: {type}\nAudience: {audience}\nLength: {length}\n\nInclude:\n- Main sections\n- Subsections\n- Key points\n- Supporting details\n- Conclusion',
      variables: ['topic', 'type', 'audience', 'length'],
      usage: 'Specify the topic, type of content, target audience, and desired length'
    },
    {
      id: 'analyze-data',
      name: 'Analyze Data',
      description: 'Analyze and interpret data',
      category: 'analysis',
      template: 'Please analyze this data and provide insights:\n\nData: {data}\n\nContext: {context}\n\nQuestions to address:\n1. What patterns do you see?\n2. What are the key trends?\n3. What insights can be drawn?\n4. What recommendations do you have?\n5. What are potential limitations?',
      variables: ['data', 'context'],
      usage: 'Provide your data and context for analysis'
    }
  ]

  // Get smart suggestions based on context
  static getSmartSuggestions(context: string, maxSuggestions: number = 5): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = []
    const prompts = PromptService.getPrompts()
    const templates = this.getSmartTemplates()

    // Analyze context for keywords
    const keywords = this.extractKeywords(context.toLowerCase())

    // Suggest relevant prompts
    const relevantPrompts = this.findRelevantPrompts(prompts, keywords)
    suggestions.push(...relevantPrompts.slice(0, 3))

    // Suggest smart templates
    const relevantTemplates = this.findRelevantTemplates(templates, keywords)
    suggestions.push(...relevantTemplates.slice(0, 2))

    // Sort by confidence and return top suggestions
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxSuggestions)
  }

  // Get all smart templates
  static getSmartTemplates(): SmartTemplate[] {
    try {
      const customTemplates = this.getCustomTemplates()
      return [...this.SMART_TEMPLATES, ...customTemplates]
    } catch (error) {
      console.error('Error loading smart templates:', error)
      return this.SMART_TEMPLATES
    }
  }

  // Get custom templates
  static getCustomTemplates(): SmartTemplate[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY_TEMPLATES)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading custom templates:', error)
      return []
    }
  }

  // Save custom template
  static saveCustomTemplate(template: SmartTemplate): boolean {
    try {
      const customTemplates = this.getCustomTemplates()
      const existingIndex = customTemplates.findIndex(t => t.id === template.id)

      if (existingIndex >= 0) {
        customTemplates[existingIndex] = template
      } else {
        customTemplates.push(template)
      }

      localStorage.setItem(this.STORAGE_KEY_TEMPLATES, JSON.stringify(customTemplates))
      return true
    } catch (error) {
      console.error('Error saving custom template:', error)
      return false
    }
  }

  // Delete custom template
  static deleteCustomTemplate(templateId: string): boolean {
    try {
      const customTemplates = this.getCustomTemplates()
      const filtered = customTemplates.filter(t => t.id !== templateId)
      localStorage.setItem(this.STORAGE_KEY_TEMPLATES, JSON.stringify(filtered))
      return true
    } catch (error) {
      console.error('Error deleting custom template:', error)
      return false
    }
  }

  // Process template with variables
  static processTemplate(template: SmartTemplate, variables: Record<string, string>): string {
    let processedTemplate = template.template

    template.variables.forEach(variable => {
      const value = variables[variable] || `{${variable}}`
      processedTemplate = processedTemplate.replace(new RegExp(`{${variable}}`, 'g'), value)
    })

    return processedTemplate
  }

  // Get quick actions based on context
  static getQuickActions(context: string): SmartSuggestion[] {
    const quickActions: SmartSuggestion[] = [
      {
        id: 'summarize',
        type: 'quick_action',
        title: 'Summarize',
        content: 'Please summarize the following text in 2-3 key points:\n\n{text}',
        category: 'general',
        confidence: 0.8,
        reason: 'Text appears to be long and could benefit from summarization'
      },
      {
        id: 'translate',
        type: 'quick_action',
        title: 'Translate',
        content: 'Please translate the following text to {language}:\n\n{text}',
        category: 'general',
        confidence: 0.7,
        reason: 'Text might need translation'
      },
      {
        id: 'improve',
        type: 'quick_action',
        title: 'Improve Writing',
        content: 'Please improve the following text for clarity, grammar, and style:\n\n{text}',
        category: 'writing',
        confidence: 0.6,
        reason: 'Text could be improved for better readability'
      },
      {
        id: 'explain',
        type: 'quick_action',
        title: 'Explain',
        content: 'Please explain this in simple terms:\n\n{text}',
        category: 'learning',
        confidence: 0.5,
        reason: 'Content might need explanation'
      }
    ]

    // Filter based on context
    return quickActions.filter(action =>
      this.isRelevantToContext(action, context)
    ).slice(0, 3)
  }

  // Private helper methods
  private static extractKeywords(text: string): string[] {
    // Simple keyword extraction
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them']

    return text
      .split(/\s+/)
      .map(word => word.toLowerCase().replace(/[^\w]/g, ''))
      .filter(word => word.length > 2 && !commonWords.includes(word))
  }

  private static findRelevantPrompts(prompts: Prompt[], keywords: string[]): SmartSuggestion[] {
    return prompts
      .map(prompt => {
        const relevance = this.calculateRelevance(prompt, keywords)
        return {
          id: `prompt-${prompt.id}`,
          type: 'prompt' as const,
          title: prompt.title,
          content: prompt.content,
          category: prompt.category,
          confidence: relevance,
          reason: `Matches your recent prompts in ${prompt.category} category`
        }
      })
      .filter(suggestion => suggestion.confidence > 0.3)
  }

  private static findRelevantTemplates(templates: SmartTemplate[], keywords: string[]): SmartSuggestion[] {
    return templates
      .map(template => {
        const relevance = this.calculateTemplateRelevance(template, keywords)
        return {
          id: `template-${template.id}`,
          type: 'template' as const,
          title: template.name,
          content: template.template,
          category: template.category,
          confidence: relevance,
          reason: `Template for ${template.category} tasks`
        }
      })
      .filter(suggestion => suggestion.confidence > 0.4)
  }

  private static calculateRelevance(prompt: Prompt, keywords: string[]): number {
    const text = `${prompt.title} ${prompt.content} ${prompt.tags.join(' ')}`.toLowerCase()
    let score = 0

    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 1
      }
    })

    return Math.min(score / keywords.length, 1)
  }

  private static calculateTemplateRelevance(template: SmartTemplate, keywords: string[]): number {
    const text = `${template.name} ${template.description} ${template.category}`.toLowerCase()
    let score = 0

    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 1
      }
    })

    return Math.min(score / keywords.length, 1)
  }

  private static isRelevantToContext(action: SmartSuggestion, context: string): boolean {
    const contextLower = context.toLowerCase()

    switch (action.id) {
      case 'summarize':
        return contextLower.length > 200
      case 'translate':
        return /[^\x00-\x7F]/.test(context) || contextLower.includes('translate')
      case 'improve':
        return contextLower.length > 50 && (contextLower.includes('write') || contextLower.includes('text'))
      case 'explain':
        return contextLower.includes('what') || contextLower.includes('how') || contextLower.includes('why')
      default:
        return true
    }
  }
}
