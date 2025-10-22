export interface QuickAction {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: string;
  category: 'code' | 'writing' | 'analysis' | 'learning' | 'debug';
  keywords: string[];
  shortcut?: string;
}

export class QuickActionsService {
  private static instance: QuickActionsService;
  private actions: QuickAction[] = [];

  static getInstance(): QuickActionsService {
    if (!QuickActionsService.instance) {
      QuickActionsService.instance = new QuickActionsService();
    }
    return QuickActionsService.instance;
  }

  constructor() {
    this.initializeDefaultActions();
  }

  private initializeDefaultActions(): void {
    this.actions = [
      // Code Actions
      {
        id: 'summarize-code',
        title: 'Summarize Code',
        description: 'Tóm tắt code một cách ngắn gọn',
        prompt: 'Please summarize this code in a few sentences, explaining what it does and its main purpose:',
        icon: '📝',
        category: 'code',
        keywords: ['summarize', 'code', 'explain', 'overview'],
        shortcut: 'Ctrl+Shift+S'
      },
      {
        id: 'explain-simple',
        title: 'Explain Simply',
        description: 'Giải thích code bằng ngôn ngữ đơn giản',
        prompt: 'Please explain this code in simple terms that a beginner could understand, avoiding technical jargon:',
        icon: '💡',
        category: 'code',
        keywords: ['explain', 'simple', 'beginner', 'understand'],
        shortcut: 'Ctrl+Shift+E'
      },
      {
        id: 'find-bugs',
        title: 'Find Bugs',
        description: 'Tìm lỗi và vấn đề trong code',
        prompt: 'Please review this code and identify any potential bugs, issues, or improvements. Focus on:',
        icon: '🐛',
        category: 'debug',
        keywords: ['bugs', 'debug', 'issues', 'problems', 'review'],
        shortcut: 'Ctrl+Shift+B'
      },
      {
        id: 'optimize-function',
        title: 'Optimize Function',
        description: 'Tối ưu hóa function/algorithm',
        prompt: 'Please analyze this code and suggest optimizations for better performance, readability, or maintainability:',
        icon: '⚡',
        category: 'code',
        keywords: ['optimize', 'performance', 'improve', 'refactor'],
        shortcut: 'Ctrl+Shift+O'
      },
      {
        id: 'add-comments',
        title: 'Add Comments',
        description: 'Thêm comments giải thích code',
        prompt: 'Please add detailed comments to this code to explain what each part does:',
        icon: '💬',
        category: 'code',
        keywords: ['comments', 'documentation', 'explain', 'annotate'],
        shortcut: 'Ctrl+Shift+C'
      },
      {
        id: 'code-review',
        title: 'Code Review',
        description: 'Review code theo best practices',
        prompt: 'Please perform a thorough code review of this code, checking for:',
        icon: '👀',
        category: 'code',
        keywords: ['review', 'best practices', 'quality', 'standards'],
        shortcut: 'Ctrl+Shift+R'
      },

      // Writing Actions
      {
        id: 'improve-writing',
        title: 'Improve Writing',
        description: 'Cải thiện văn bản và ngữ pháp',
        prompt: 'Please improve this text for better clarity, grammar, and flow:',
        icon: '✍️',
        category: 'writing',
        keywords: ['improve', 'writing', 'grammar', 'clarity'],
        shortcut: 'Ctrl+Shift+I'
      },
      {
        id: 'translate',
        title: 'Translate',
        description: 'Dịch văn bản sang ngôn ngữ khác',
        prompt: 'Please translate this text to English (or specify target language):',
        icon: '🌐',
        category: 'writing',
        keywords: ['translate', 'language', 'convert'],
        shortcut: 'Ctrl+Shift+T'
      },
      {
        id: 'summarize-text',
        title: 'Summarize Text',
        description: 'Tóm tắt văn bản dài',
        prompt: 'Please provide a concise summary of this text, highlighting the key points:',
        icon: '📄',
        category: 'writing',
        keywords: ['summarize', 'text', 'summary', 'key points'],
        shortcut: 'Ctrl+Shift+M'
      },

      // Analysis Actions
      {
        id: 'analyze-data',
        title: 'Analyze Data',
        description: 'Phân tích dữ liệu và tìm patterns',
        prompt: 'Please analyze this data and identify patterns, trends, or insights:',
        icon: '📊',
        category: 'analysis',
        keywords: ['analyze', 'data', 'patterns', 'insights', 'trends'],
        shortcut: 'Ctrl+Shift+A'
      },
      {
        id: 'compare-options',
        title: 'Compare Options',
        description: 'So sánh các lựa chọn khác nhau',
        prompt: 'Please compare these options and provide pros/cons for each:',
        icon: '⚖️',
        category: 'analysis',
        keywords: ['compare', 'options', 'pros', 'cons', 'evaluation'],
        shortcut: 'Ctrl+Shift+P'
      },

      // Learning Actions
      {
        id: 'explain-concept',
        title: 'Explain Concept',
        description: 'Giải thích khái niệm phức tạp',
        prompt: 'Please explain this concept in detail with examples and analogies:',
        icon: '🎓',
        category: 'learning',
        keywords: ['explain', 'concept', 'learn', 'understand', 'examples'],
        shortcut: 'Ctrl+Shift+L'
      },
      {
        id: 'create-examples',
        title: 'Create Examples',
        description: 'Tạo ví dụ minh họa',
        prompt: 'Please provide practical examples to illustrate this concept:',
        icon: '💡',
        category: 'learning',
        keywords: ['examples', 'illustrate', 'demonstrate', 'practical'],
        shortcut: 'Ctrl+Shift+X'
      }
    ];
  }

  getAllActions(): QuickAction[] {
    return [...this.actions];
  }

  getActionsByCategory(category: QuickAction['category']): QuickAction[] {
    return this.actions.filter(action => action.category === category);
  }

  getActionById(id: string): QuickAction | undefined {
    return this.actions.find(action => action.id === id);
  }

  searchActions(query: string): QuickAction[] {
    const lowercaseQuery = query.toLowerCase();
    return this.actions.filter(action =>
      action.title.toLowerCase().includes(lowercaseQuery) ||
      action.description.toLowerCase().includes(lowercaseQuery) ||
      action.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery))
    );
  }

  getPopularActions(limit: number = 6): QuickAction[] {
    // Return most commonly used actions (for now, return first 6)
    return this.actions.slice(0, limit);
  }

  generatePrompt(action: QuickAction, context: string): string {
    return `${action.prompt}\n\n${context}`;
  }

  addCustomAction(action: Omit<QuickAction, 'id'>): void {
    const newAction: QuickAction = {
      ...action,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    this.actions.push(newAction);
  }

  removeCustomAction(id: string): boolean {
    const index = this.actions.findIndex(action => action.id === id);
    if (index !== -1) {
      this.actions.splice(index, 1);
      return true;
    }
    return false;
  }

  updateCustomAction(id: string, updates: Partial<QuickAction>): boolean {
    const action = this.actions.find(action => action.id === id);
    if (action) {
      Object.assign(action, updates);
      return true;
    }
    return false;
  }

  getCategories(): Array<{ key: QuickAction['category']; label: string; icon: string }> {
    return [
      { key: 'code', label: 'Code', icon: '💻' },
      { key: 'writing', label: 'Writing', icon: '✍️' },
      { key: 'analysis', label: 'Analysis', icon: '📊' },
      { key: 'learning', label: 'Learning', icon: '🎓' },
      { key: 'debug', label: 'Debug', icon: '🐛' }
    ];
  }
}
