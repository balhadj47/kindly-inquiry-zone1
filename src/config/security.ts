
export const SECURITY_CONFIG = {
  // Rate limiting
  RATE_LIMITS: {
    API_CALLS: {
      MAX_REQUESTS: 100,
      WINDOW_MS: 60000, // 1 minute
    },
    LOGIN_ATTEMPTS: {
      MAX_ATTEMPTS: 5,
      WINDOW_MS: 300000, // 5 minutes
    },
    PASSWORD_RESET: {
      MAX_ATTEMPTS: 3,
      WINDOW_MS: 3600000, // 1 hour
    },
  },

  // File upload limits
  FILE_UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain',
    ],
    MAX_FILES_PER_UPLOAD: 5,
  },

  // Input validation
  INPUT_LIMITS: {
    NAME_MAX_Length: 100,
    EMAIL_MAX_LENGTH: 255,
    NOTES_MAX_LENGTH: 1000,
    DESCRIPTION_MAX_LENGTH: 500,
  },

  // Session management
  SESSION: {
    TIMEOUT_MS: 8 * 60 * 60 * 1000, // 8 hours
    REFRESH_THRESHOLD_MS: 30 * 60 * 1000, // 30 minutes before expiry
  },

  // Audit logging
  AUDIT: {
    ENABLED: true,
    LOG_SENSITIVE_DATA: false,
    RETENTION_DAYS: 90,
  },

  // Content Security Policy
  CSP: {
    SCRIPT_SRC: ["'self'", "'unsafe-inline'"],
    STYLE_SRC: ["'self'", "'unsafe-inline'"],
    IMG_SRC: ["'self'", "data:", "https:"],
    CONNECT_SRC: ["'self'", "https://upaxlykqpbpvwsprcrtu.supabase.co"],
  },

  // Sensitive data patterns to exclude from logs
  SENSITIVE_PATTERNS: [
    /password/i,
    /secret/i,
    /token/i,
    /key/i,
    /credential/i,
  ],
};

// Helper function to check if a field contains sensitive data
export const isSensitiveField = (fieldName: string): boolean => {
  return SECURITY_CONFIG.SENSITIVE_PATTERNS.some(pattern => 
    pattern.test(fieldName)
  );
};

// Helper function to mask sensitive data in logs
export const maskSensitiveData = (obj: any): any => {
  if (typeof obj === 'string') {
    return obj.replace(/./g, '*');
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => maskSensitiveData(item));
  }
  
  if (obj && typeof obj === 'object') {
    const masked: any = {};
    Object.keys(obj).forEach(key => {
      if (isSensitiveField(key)) {
        masked[key] = '***MASKED***';
      } else {
        masked[key] = maskSensitiveData(obj[key]);
      }
    });
    return masked;
  }
  
  return obj;
};
