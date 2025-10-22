export interface MinifierOptions {
  removeComments?: boolean;
  removeWhitespace?: boolean;
  removeEmptyLines?: boolean;
  preserveStrings?: boolean;
  minifyHtml?: boolean;
  minifyCss?: boolean;
  minifyJs?: boolean;
}

export class CodeMinifierService {
  private static instance: CodeMinifierService;
  private options: MinifierOptions = {
    removeComments: true,
    removeWhitespace: true,
    removeEmptyLines: true,
    preserveStrings: true,
    minifyHtml: true,
    minifyCss: true,
    minifyJs: true
  };

  static getInstance(): CodeMinifierService {
    if (!CodeMinifierService.instance) {
      CodeMinifierService.instance = new CodeMinifierService();
    }
    return CodeMinifierService.instance;
  }

  /**
   * Detect code type from content
   */
  detectCodeType(content: string): string {
    const trimmed = content.trim();

    // HTML detection
    if (trimmed.match(/<[^>]+>/) && (trimmed.includes('<html') || trimmed.includes('<div') || trimmed.includes('<p'))) {
      return 'html';
    }

    // PHP detection
    if (trimmed.includes('<?php') || trimmed.includes('<?=') || trimmed.includes('<?')) {
      return 'php';
    }

    // CSS detection
    if (trimmed.includes('{') && trimmed.includes('}') && trimmed.includes(':')) {
      return 'css';
    }

    // JavaScript/TypeScript detection
    if (trimmed.includes('function') || trimmed.includes('const') || trimmed.includes('let') ||
        trimmed.includes('var') || trimmed.includes('=>') || trimmed.includes('import')) {
      return 'js';
    }

    // Laravel Blade detection
    if (trimmed.includes('@') && (trimmed.includes('@extends') || trimmed.includes('@section') || trimmed.includes('@yield'))) {
      return 'blade';
    }

    // JSON detection
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      return 'json';
    }

    return 'text';
  }

  /**
   * Minify HTML content
   */
  minifyHtml(content: string): string {
    return content
      .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/>\s+</g, '><') // Remove whitespace between tags
      .replace(/\s+>/g, '>') // Remove whitespace before closing tags
      .replace(/>\s+/g, '>') // Remove whitespace after opening tags
      .trim();
  }

  /**
   * Minify CSS content
   */
  minifyCss(content: string): string {
    return content
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove CSS comments
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/\s*{\s*/g, '{') // Remove spaces around opening braces
      .replace(/\s*}\s*/g, '}') // Remove spaces around closing braces
      .replace(/\s*;\s*/g, ';') // Remove spaces around semicolons
      .replace(/\s*:\s*/g, ':') // Remove spaces around colons
      .replace(/\s*,\s*/g, ',') // Remove spaces around commas
      .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
      .trim();
  }

  /**
   * Minify JavaScript/TypeScript content
   */
  minifyJs(content: string): string {
    return content
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\/\/.*$/gm, '') // Remove line comments
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/\s*{\s*/g, '{') // Remove spaces around opening braces
      .replace(/\s*}\s*/g, '}') // Remove spaces around closing braces
      .replace(/\s*;\s*/g, ';') // Remove spaces around semicolons
      .replace(/\s*:\s*/g, ':') // Remove spaces around colons
      .replace(/\s*,\s*/g, ',') // Remove spaces around commas
      .replace(/\s*\(\s*/g, '(') // Remove spaces around opening parentheses
      .replace(/\s*\)\s*/g, ')') // Remove spaces around closing parentheses
      .replace(/\s*\[\s*/g, '[') // Remove spaces around opening brackets
      .replace(/\s*\]\s*/g, ']') // Remove spaces around closing brackets
      .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
      .replace(/\s*=\s*/g, '=') // Remove spaces around equals
      .replace(/\s*\+\s*/g, '+') // Remove spaces around plus
      .replace(/\s*-\s*/g, '-') // Remove spaces around minus
      .replace(/\s*\*\s*/g, '*') // Remove spaces around multiply
      .replace(/\s*\/\s*/g, '/') // Remove spaces around divide
      .replace(/\s*&&\s*/g, '&&') // Remove spaces around logical AND
      .replace(/\s*\|\|\s*/g, '||') // Remove spaces around logical OR
      .replace(/\s*==\s*/g, '==') // Remove spaces around equality
      .replace(/\s*!=\s*/g, '!=') // Remove spaces around inequality
      .replace(/\s*<=\s*/g, '<=') // Remove spaces around less than or equal
      .replace(/\s*>=\s*/g, '>=') // Remove spaces around greater than or equal
      .replace(/\s*<\s*/g, '<') // Remove spaces around less than
      .replace(/\s*>\s*/g, '>') // Remove spaces around greater than
      .trim();
  }

  /**
   * Minify PHP content
   */
  minifyPhp(content: string): string {
    return content
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\/\/.*$/gm, '') // Remove line comments
      .replace(/#.*$/gm, '') // Remove hash comments
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/\s*{\s*/g, '{') // Remove spaces around opening braces
      .replace(/\s*}\s*/g, '}') // Remove spaces around closing braces
      .replace(/\s*;\s*/g, ';') // Remove spaces around semicolons
      .replace(/\s*:\s*/g, ':') // Remove spaces around colons
      .replace(/\s*,\s*/g, ',') // Remove spaces around commas
      .replace(/\s*\(\s*/g, '(') // Remove spaces around opening parentheses
      .replace(/\s*\)\s*/g, ')') // Remove spaces around closing parentheses
      .replace(/\s*\[\s*/g, '[') // Remove spaces around opening brackets
      .replace(/\s*\]\s*/g, ']') // Remove spaces around closing brackets
      .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
      .replace(/\s*=\s*/g, '=') // Remove spaces around equals
      .replace(/\s*->\s*/g, '->') // Remove spaces around object operator
      .replace(/\s*::\s*/g, '::') // Remove spaces around scope resolution operator
      .replace(/\s*\.\s*/g, '.') // Remove spaces around concatenation operator
      .trim();
  }

  /**
   * Minify Laravel Blade content
   */
  minifyBlade(content: string): string {
    return content
      .replace(/\{\{--[\s\S]*?--\}\}/g, '') // Remove Blade comments
      .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/>\s+</g, '><') // Remove whitespace between tags
      .replace(/\s+>/g, '>') // Remove whitespace before closing tags
      .replace(/>\s+/g, '>') // Remove whitespace after opening tags
      .replace(/\s*@\s*/g, '@') // Remove spaces around Blade directives
      .trim();
  }

  /**
   * Minify JSON content
   */
  minifyJson(content: string): string {
    try {
      const parsed = JSON.parse(content);
      return JSON.stringify(parsed);
    } catch {
      // If not valid JSON, just remove extra whitespace
      return content.replace(/\s+/g, ' ').trim();
    }
  }

  /**
   * Main minify function
   */
  minify(content: string, options?: Partial<MinifierOptions>): string {
    if (!content || content.trim().length === 0) {
      return content;
    }

    const mergedOptions = { ...this.options, ...options };
    const codeType = this.detectCodeType(content);

    let minified = content;

    // Apply type-specific minification
    switch (codeType) {
      case 'html':
        if (mergedOptions.minifyHtml) {
          minified = this.minifyHtml(content);
        }
        break;
      case 'css':
        if (mergedOptions.minifyCss) {
          minified = this.minifyCss(content);
        }
        break;
      case 'js':
        if (mergedOptions.minifyJs) {
          minified = this.minifyJs(content);
        }
        break;
      case 'php':
        minified = this.minifyPhp(content);
        break;
      case 'blade':
        minified = this.minifyBlade(content);
        break;
      case 'json':
        minified = this.minifyJson(content);
        break;
      default:
        // Generic minification for unknown types
        if (mergedOptions.removeComments) {
          minified = minified.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
        }
        if (mergedOptions.removeWhitespace) {
          minified = minified.replace(/\s+/g, ' ');
        }
        if (mergedOptions.removeEmptyLines) {
          minified = minified.replace(/^\s*[\r\n]/gm, '');
        }
        minified = minified.trim();
    }

    return minified;
  }

  /**
   * Get minification statistics
   */
  getMinificationStats(original: string, minified: string): {
    originalSize: number;
    minifiedSize: number;
    reduction: number;
    reductionPercentage: number;
  } {
    const originalSize = original.length;
    const minifiedSize = minified.length;
    const reduction = originalSize - minifiedSize;
    const reductionPercentage = originalSize > 0 ? (reduction / originalSize) * 100 : 0;

    return {
      originalSize,
      minifiedSize,
      reduction,
      reductionPercentage: Math.round(reductionPercentage * 100) / 100
    };
  }

  /**
   * Update minifier options
   */
  updateOptions(options: Partial<MinifierOptions>): void {
    this.options = { ...this.options, ...options };
  }
}
