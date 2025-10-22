export interface SmartTemplate {
  id: string;
  title: string;
  description: string;
  template: string;
  category: 'code-review' | 'documentation' | 'debugging' | 'learning' | 'analysis' | 'writing';
  tags: string[];
  variables: TemplateVariable[];
  icon: string;
  isBuiltIn: boolean;
  usageCount: number;
  lastUsed?: Date;
}

export interface TemplateVariable {
  name: string;
  placeholder: string;
  description: string;
  required: boolean;
  defaultValue?: string;
  type: 'text' | 'code' | 'select' | 'multiline';
  options?: string[]; // For select type
}

export class SmartTemplatesService {
  private static instance: SmartTemplatesService;
  private templates: SmartTemplate[] = [];

  static getInstance(): SmartTemplatesService {
    if (!SmartTemplatesService.instance) {
      SmartTemplatesService.instance = new SmartTemplatesService();
    }
    return SmartTemplatesService.instance;
  }

  constructor() {
    this.initializeDefaultTemplates();
  }

  private initializeDefaultTemplates(): void {
    this.templates = [
      // Code Review Templates
      {
        id: 'code-review-basic',
        title: 'Basic Code Review',
        description: 'Comprehensive code review template',
        template: `Please review this code and provide feedback on:

**Code:**
\`\`\`{language}
{code}
\`\`\`

**Review Criteria:**
- Code quality and readability
- Performance and efficiency
- Security considerations
- Best practices adherence
- Potential bugs or issues
- Suggestions for improvement

**Focus Areas:**
{focus_areas}

Please provide specific, actionable feedback.`,
        category: 'code-review',
        tags: ['review', 'code', 'quality', 'feedback'],
        icon: '👀',
        isBuiltIn: true,
        usageCount: 0,
        variables: [
          {
            name: 'language',
            placeholder: 'javascript',
            description: 'Programming language',
            required: true,
            type: 'select',
            options: ['javascript', 'python', 'java', 'typescript', 'php', 'go', 'rust', 'c++', 'c#', 'other']
          },
          {
            name: 'code',
            placeholder: '// Paste your code here',
            description: 'Code to review',
            required: true,
            type: 'code'
          },
          {
            name: 'focus_areas',
            placeholder: 'performance, security, readability',
            description: 'Specific areas to focus on',
            required: false,
            type: 'text',
            defaultValue: 'general code quality'
          }
        ]
      },
      {
        id: 'code-review-security',
        title: 'Security Code Review',
        description: 'Security-focused code review template',
        template: `Please perform a security-focused review of this code:

**Code:**
\`\`\`{language}
{code}
\`\`\`

**Security Review Checklist:**
- Input validation and sanitization
- SQL injection vulnerabilities
- XSS prevention
- Authentication and authorization
- Data encryption and sensitive data handling
- Error handling and information disclosure
- Dependency vulnerabilities
- Secure coding practices

**Context:**
{context}

Please identify any security issues and provide remediation suggestions.`,
        category: 'code-review',
        tags: ['security', 'review', 'vulnerabilities', 'audit'],
        icon: '🔒',
        isBuiltIn: true,
        usageCount: 0,
        variables: [
          {
            name: 'language',
            placeholder: 'javascript',
            description: 'Programming language',
            required: true,
            type: 'select',
            options: ['javascript', 'python', 'java', 'typescript', 'php', 'go', 'rust', 'c++', 'c#', 'other']
          },
          {
            name: 'code',
            placeholder: '// Paste your code here',
            description: 'Code to review',
            required: true,
            type: 'code'
          },
          {
            name: 'context',
            placeholder: 'Web application, API endpoint, etc.',
            description: 'Application context',
            required: false,
            type: 'text',
            defaultValue: 'General application'
          }
        ]
      },

      // Documentation Templates
      {
        id: 'api-documentation',
        title: 'API Documentation',
        description: 'Generate API documentation from code',
        template: `Please generate comprehensive API documentation for this code:

**Code:**
\`\`\`{language}
{code}
\`\`\`

**Documentation Requirements:**
- API endpoint description
- Request/response formats
- Parameters and their types
- Example requests and responses
- Error codes and handling
- Authentication requirements
- Rate limiting information

**API Context:**
{api_context}

Please format the documentation in Markdown.`,
        category: 'documentation',
        tags: ['api', 'documentation', 'endpoints', 'swagger'],
        icon: '📚',
        isBuiltIn: true,
        usageCount: 0,
        variables: [
          {
            name: 'language',
            placeholder: 'javascript',
            description: 'Programming language',
            required: true,
            type: 'select',
            options: ['javascript', 'python', 'java', 'typescript', 'php', 'go', 'rust', 'c++', 'c#', 'other']
          },
          {
            name: 'code',
            placeholder: '// Paste your API code here',
            description: 'API code to document',
            required: true,
            type: 'code'
          },
          {
            name: 'api_context',
            placeholder: 'REST API, GraphQL, etc.',
            description: 'API type and context',
            required: false,
            type: 'text',
            defaultValue: 'REST API'
          }
        ]
      },
      {
        id: 'function-documentation',
        title: 'Function Documentation',
        description: 'Generate JSDoc/Python docstring documentation',
        template: `Please generate detailed documentation for this function:

**Function Code:**
\`\`\`{language}
{code}
\`\`\`

**Documentation Format:** {doc_format}

**Include:**
- Function description
- Parameter types and descriptions
- Return value description
- Usage examples
- Error conditions
- Side effects

**Additional Context:**
{context}`,
        category: 'documentation',
        tags: ['function', 'documentation', 'jsdoc', 'docstring'],
        icon: '📝',
        isBuiltIn: true,
        usageCount: 0,
        variables: [
          {
            name: 'language',
            placeholder: 'javascript',
            description: 'Programming language',
            required: true,
            type: 'select',
            options: ['javascript', 'python', 'java', 'typescript', 'php', 'go', 'rust', 'c++', 'c#', 'other']
          },
          {
            name: 'code',
            placeholder: '// Paste your function here',
            description: 'Function code to document',
            required: true,
            type: 'code'
          },
          {
            name: 'doc_format',
            placeholder: 'JSDoc',
            description: 'Documentation format',
            required: true,
            type: 'select',
            options: ['JSDoc', 'Python Docstring', 'JavaDoc', 'PHPDoc', 'Go Doc', 'Rust Doc', 'Generic']
          },
          {
            name: 'context',
            placeholder: 'Additional context about the function',
            description: 'Additional context',
            required: false,
            type: 'multiline',
            defaultValue: ''
          }
        ]
      },

      // Debugging Templates
      {
        id: 'debug-error',
        title: 'Debug Error',
        description: 'Systematic error debugging template',
        template: `I'm encountering an error and need help debugging:

**Error Message:**
\`\`\`
{error_message}
\`\`\`

**Code:**
\`\`\`{language}
{code}
\`\`\`

**Environment:**
- Language: {language}
- Framework: {framework}
- Version: {version}
- OS: {os}

**Steps to Reproduce:**
{steps}

**Expected vs Actual Behavior:**
- Expected: {expected}
- Actual: {actual}

**Additional Context:**
{context}

Please help me identify the root cause and provide a solution.`,
        category: 'debugging',
        tags: ['debug', 'error', 'troubleshooting', 'fix'],
        icon: '🐛',
        isBuiltIn: true,
        usageCount: 0,
        variables: [
          {
            name: 'error_message',
            placeholder: 'Error message here',
            description: 'Error message or stack trace',
            required: true,
            type: 'multiline'
          },
          {
            name: 'language',
            placeholder: 'javascript',
            description: 'Programming language',
            required: true,
            type: 'select',
            options: ['javascript', 'python', 'java', 'typescript', 'php', 'go', 'rust', 'c++', 'c#', 'other']
          },
          {
            name: 'code',
            placeholder: '// Paste your code here',
            description: 'Code causing the error',
            required: true,
            type: 'code'
          },
          {
            name: 'framework',
            placeholder: 'React, Express, Django, etc.',
            description: 'Framework or library',
            required: false,
            type: 'text',
            defaultValue: 'None'
          },
          {
            name: 'version',
            placeholder: '1.0.0',
            description: 'Version information',
            required: false,
            type: 'text',
            defaultValue: 'Latest'
          },
          {
            name: 'os',
            placeholder: 'Windows 10, macOS, Linux',
            description: 'Operating system',
            required: false,
            type: 'text',
            defaultValue: 'Not specified'
          },
          {
            name: 'steps',
            placeholder: '1. Step one\n2. Step two',
            description: 'Steps to reproduce the error',
            required: true,
            type: 'multiline'
          },
          {
            name: 'expected',
            placeholder: 'What should happen',
            description: 'Expected behavior',
            required: true,
            type: 'text'
          },
          {
            name: 'actual',
            placeholder: 'What actually happens',
            description: 'Actual behavior',
            required: true,
            type: 'text'
          },
          {
            name: 'context',
            placeholder: 'Additional context',
            description: 'Any additional context',
            required: false,
            type: 'multiline',
            defaultValue: ''
          }
        ]
      },

      // Learning Templates
      {
        id: 'learn-concept',
        title: 'Learn New Concept',
        description: 'Structured learning template for new concepts',
        template: `I want to learn about {concept} in {language}. Please provide:

**Learning Objectives:**
- Core concepts and principles
- Key terminology and definitions
- Practical applications
- Common patterns and best practices

**Learning Level:** {level}

**Specific Focus Areas:**
{focus_areas}

**Learning Format:**
- Start with basics and build up complexity
- Include practical examples
- Provide code snippets where relevant
- Explain the "why" behind concepts
- Include common pitfalls to avoid

**My Background:**
{background}

**Questions to Answer:**
- What is {concept} and why is it important?
- How does it work under the hood?
- When should I use it vs alternatives?
- What are the best practices?
- What are common mistakes to avoid?

Please structure this as a comprehensive learning guide.`,
        category: 'learning',
        tags: ['learn', 'concept', 'tutorial', 'education'],
        icon: '🎓',
        isBuiltIn: true,
        usageCount: 0,
        variables: [
          {
            name: 'concept',
            placeholder: 'async/await, closures, recursion',
            description: 'Concept to learn',
            required: true,
            type: 'text'
          },
          {
            name: 'language',
            placeholder: 'JavaScript',
            description: 'Programming language',
            required: true,
            type: 'select',
            options: ['JavaScript', 'Python', 'Java', 'TypeScript', 'PHP', 'Go', 'Rust', 'C++', 'C#', 'Other']
          },
          {
            name: 'level',
            placeholder: 'Beginner',
            description: 'Learning level',
            required: true,
            type: 'select',
            options: ['Beginner', 'Intermediate', 'Advanced']
          },
          {
            name: 'focus_areas',
            placeholder: 'practical applications, performance',
            description: 'Specific areas to focus on',
            required: false,
            type: 'text',
            defaultValue: 'general understanding'
          },
          {
            name: 'background',
            placeholder: 'I have experience with...',
            description: 'Your current background',
            required: false,
            type: 'multiline',
            defaultValue: 'General programming experience'
          }
        ]
      }
    ];
  }

  getAllTemplates(): SmartTemplate[] {
    return [...this.templates];
  }

  getTemplatesByCategory(category: SmartTemplate['category']): SmartTemplate[] {
    return this.templates.filter(template => template.category === category);
  }

  getTemplateById(id: string): SmartTemplate | undefined {
    return this.templates.find(template => template.id === id);
  }

  searchTemplates(query: string): SmartTemplate[] {
    const lowercaseQuery = query.toLowerCase();
    return this.templates.filter(template =>
      template.title.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  getPopularTemplates(limit: number = 6): SmartTemplate[] {
    return this.templates
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  generatePrompt(template: SmartTemplate, variables: Record<string, string>): string {
    let prompt = template.template;

    // Replace all variables in the template
    template.variables.forEach(variable => {
      const value = variables[variable.name] || variable.defaultValue || `{${variable.name}}`;
      const placeholder = `{${variable.name}}`;
      prompt = prompt.replace(new RegExp(placeholder, 'g'), value);
    });

    return prompt;
  }

  incrementUsage(templateId: string): void {
    const template = this.templates.find(t => t.id === templateId);
    if (template) {
      template.usageCount++;
      template.lastUsed = new Date();
    }
  }

  addCustomTemplate(template: Omit<SmartTemplate, 'id' | 'isBuiltIn' | 'usageCount'>): void {
    const newTemplate: SmartTemplate = {
      ...template,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isBuiltIn: false,
      usageCount: 0
    };
    this.templates.push(newTemplate);
  }

  removeCustomTemplate(id: string): boolean {
    const template = this.templates.find(t => t.id === id);
    if (template && !template.isBuiltIn) {
      const index = this.templates.indexOf(template);
      this.templates.splice(index, 1);
      return true;
    }
    return false;
  }

  updateCustomTemplate(id: string, updates: Partial<SmartTemplate>): boolean {
    const template = this.templates.find(t => t.id === id);
    if (template && !template.isBuiltIn) {
      Object.assign(template, updates);
      return true;
    }
    return false;
  }

  getCategories(): Array<{ key: SmartTemplate['category']; label: string; icon: string }> {
    return [
      { key: 'code-review', label: 'Code Review', icon: '👀' },
      { key: 'documentation', label: 'Documentation', icon: '📚' },
      { key: 'debugging', label: 'Debugging', icon: '🐛' },
      { key: 'learning', label: 'Learning', icon: '🎓' },
      { key: 'analysis', label: 'Analysis', icon: '📊' },
      { key: 'writing', label: 'Writing', icon: '✍️' }
    ];
  }
}
