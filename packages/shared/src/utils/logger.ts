export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LogContext {
  [key: string]: any;
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private isDevelopment: boolean;

  private constructor() {
    const envLevel = (process.env.LOG_LEVEL || '').toString().toUpperCase();
    const levelMap: Record<string, LogLevel> = {
      ERROR: LogLevel.ERROR,
      WARN: LogLevel.WARN,
      INFO: LogLevel.INFO,
      DEBUG: LogLevel.DEBUG,
    };
    this.logLevel = levelMap[envLevel] ?? LogLevel.INFO;
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  error(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', message, context));
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage('DEBUG', message, context));
    }
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  // Convenience methods for common logging patterns
  logApiRequest(method: string, url: string, statusCode: number, duration: number): void {
    this.info('API Request', {
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
    });
  }

  logWebhookEvent(provider: string, eventType: string, projectId: string): void {
    this.info('Webhook Event Received', {
      provider,
      eventType,
      projectId,
    });
  }

  logNotificationSent(plugin: string, eventType: string, success: boolean): void {
    this.info('Notification Sent', {
      plugin,
      eventType,
      success,
    });
  }
}

// Export a default instance
export const logger = Logger.getInstance(); 