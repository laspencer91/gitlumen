export class Validators {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isValidGitLabUrl(url: string): boolean {
    if (!this.isValidUrl(url)) return false;
    
    const gitlabDomains = [
      'gitlab.com',
      'gitlab.org',
      'gitlab.io',
    ];
    
    const urlObj = new URL(url);
    return gitlabDomains.some(domain => urlObj.hostname.includes(domain));
  }

  static isValidWebhookSecret(secret: string): boolean {
    return secret.length >= 16 && secret.length <= 255;
  }

  static isValidApiKey(apiKey: string): boolean {
    // API key should be at least 32 characters and contain only alphanumeric characters and hyphens
    const apiKeyRegex = /^[a-zA-Z0-9-]{32,}$/;
    return apiKeyRegex.test(apiKey);
  }

  static isValidProjectName(name: string): boolean {
    // Project name should be 1-100 characters, alphanumeric, spaces, hyphens, underscores
    const nameRegex = /^[a-zA-Z0-9\s\-_]{1,100}$/;
    return nameRegex.test(name);
  }

  static isValidBranchName(branch: string): boolean {
    // Branch name should not contain special characters that could cause issues
    const branchRegex = /^[a-zA-Z0-9\/\-_\.]+$/;
    return branchRegex.test(branch) && branch.length <= 255;
  }

  static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove potential JavaScript
      .substring(0, 1000); // Limit length
  }

  static validateObject(obj: any, requiredFields: string[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    for (const field of requiredFields) {
      if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
        errors.push(`Missing required field: ${field}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validatePaginationParams(page: number, limit: number): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (page < 1) {
      errors.push('Page must be greater than 0');
    }
    
    if (limit < 1 || limit > 100) {
      errors.push('Limit must be between 1 and 100');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
} 