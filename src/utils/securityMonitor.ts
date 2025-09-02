/**
 * Security Monitoring and Event Logging
 * Tracks security-related events and suspicious activities
 */

interface SecurityEvent {
  type: 'auth_attempt' | 'token_access' | 'api_error' | 'rate_limit' | 'input_validation';
  level: 'info' | 'warn' | 'error';
  message: string;
  metadata?: Record<string, any>;
  timestamp: number;
  userAgent?: string;
  ip?: string;
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private maxEvents = 1000;

  /**
   * Log a security event
   */
  logEvent(
    type: SecurityEvent['type'],
    level: SecurityEvent['level'],
    message: string,
    metadata?: Record<string, any>
  ): void {
    const event: SecurityEvent = {
      type,
      level,
      message,
      metadata,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    };

    this.events.push(event);

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      const logMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'info';
      console[logMethod](`[SECURITY] ${type}: ${message}`, metadata);
    }

    // In production, you could send critical events to your monitoring service
    if (level === 'error' && !import.meta.env.DEV) {
      this.reportCriticalEvent(event);
    }
  }

  /**
   * Get recent security events
   */
  getEvents(type?: SecurityEvent['type'], limit = 50): SecurityEvent[] {
    let filteredEvents = this.events;
    
    if (type) {
      filteredEvents = this.events.filter(event => event.type === type);
    }

    return filteredEvents
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Check for suspicious patterns
   */
  detectSuspiciousActivity(): boolean {
    const recentEvents = this.events.filter(
      event => Date.now() - event.timestamp < 5 * 60 * 1000 // Last 5 minutes
    );

    // Check for rapid error events
    const errorEvents = recentEvents.filter(event => event.level === 'error');
    if (errorEvents.length > 10) {
      this.logEvent('rate_limit', 'warn', 'High error rate detected', {
        errorCount: errorEvents.length,
        timeWindow: '5 minutes'
      });
      return true;
    }

    // Check for repeated failed auth attempts
    const authErrors = recentEvents.filter(
      event => event.type === 'auth_attempt' && event.level === 'error'
    );
    if (authErrors.length > 5) {
      this.logEvent('auth_attempt', 'error', 'Multiple failed authentication attempts', {
        attempts: authErrors.length
      });
      return true;
    }

    return false;
  }

  /**
   * Clear old events
   */
  clearOldEvents(olderThanHours = 24): void {
    const cutoff = Date.now() - (olderThanHours * 60 * 60 * 1000);
    this.events = this.events.filter(event => event.timestamp > cutoff);
  }

  /**
   * Report critical security events (implement based on your needs)
   */
  private reportCriticalEvent(event: SecurityEvent): void {
    // In a real application, you might send this to your security monitoring service
    // Example: Sentry, DataDog, custom endpoint, etc.
    console.error('[CRITICAL SECURITY EVENT]', event);
  }
}

// Export singleton instance
export const securityMonitor = new SecurityMonitor();

/**
 * Hook for React components to access security monitoring
 */
export function useSecurityMonitor() {
  return {
    logEvent: securityMonitor.logEvent.bind(securityMonitor),
    getEvents: securityMonitor.getEvents.bind(securityMonitor),
    detectSuspiciousActivity: securityMonitor.detectSuspiciousActivity.bind(securityMonitor),
  };
}
