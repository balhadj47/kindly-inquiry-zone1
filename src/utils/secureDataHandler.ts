
import { supabase } from '@/integrations/supabase/client';
import { sanitizeInput, sanitizeHtml } from './inputValidation';

export class SecureDataHandler {
  private static instance: SecureDataHandler;
  private requestLog: Map<string, number[]> = new Map();

  static getInstance(): SecureDataHandler {
    if (!SecureDataHandler.instance) {
      SecureDataHandler.instance = new SecureDataHandler();
    }
    return SecureDataHandler.instance;
  }

  // Rate limiting for API calls
  private checkRateLimit(key: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now();
    const requests = this.requestLog.get(key) || [];
    
    // Filter out old requests
    const recentRequests = requests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      console.warn(`Rate limit exceeded for key: ${key}`);
      return false;
    }
    
    recentRequests.push(now);
    this.requestLog.set(key, recentRequests);
    return true;
  }

  // Secure database query with sanitization
  async secureQuery<T>(
    table: string,
    operation: 'select' | 'insert' | 'update' | 'delete',
    data?: any,
    filters?: Record<string, any>
  ): Promise<{ data: T[] | null; error: any }> {
    try {
      // Rate limiting
      const userId = (await supabase.auth.getUser()).data.user?.id || 'anonymous';
      if (!this.checkRateLimit(`${userId}-${table}-${operation}`)) {
        return { data: null, error: { message: 'Rate limit exceeded' } };
      }

      let query = supabase.from(table);

      // Sanitize data if provided
      if (data) {
        const sanitizedData = this.sanitizeObject(data);
        
        switch (operation) {
          case 'insert':
            return await query.insert(sanitizedData).select();
          case 'update':
            if (!filters) {
              return { data: null, error: { message: 'Update requires filters' } };
            }
            return await query.update(sanitizedData).match(filters).select();
          case 'delete':
            if (!filters) {
              return { data: null, error: { message: 'Delete requires filters' } };
            }
            return await query.delete().match(filters);
        }
      }

      // Select operation
      if (filters) {
        Object.keys(filters).forEach(key => {
          query = query.eq(key, filters[key]);
        });
      }

      return await query.select();
    } catch (error) {
      console.error('Secure query error:', error);
      return { data: null, error };
    }
  }

  // Sanitize object recursively
  private sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
      return sanitizeHtml(sanitizeInput(obj));
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      Object.keys(obj).forEach(key => {
        sanitized[key] = this.sanitizeObject(obj[key]);
      });
      return sanitized;
    }
    
    return obj;
  }

  // Secure file upload with validation
  async secureFileUpload(
    file: File,
    bucket: string,
    path: string,
    maxSize: number = 5 * 1024 * 1024 // 5MB
  ): Promise<{ data: any; error: any }> {
    try {
      // Validate file size
      if (file.size > maxSize) {
        return { data: null, error: { message: 'File too large' } };
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        return { data: null, error: { message: 'File type not allowed' } };
      }

      // Sanitize file name
      const sanitizedPath = sanitizeInput(path);
      
      return await supabase.storage
        .from(bucket)
        .upload(sanitizedPath, file);
    } catch (error) {
      console.error('Secure file upload error:', error);
      return { data: null, error };
    }
  }

  // Audit logging
  async auditLog(action: string, details: any): Promise<void> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      const logEntry = {
        user_id: user?.id || 'anonymous',
        action: sanitizeInput(action),
        details: this.sanitizeObject(details),
        timestamp: new Date().toISOString(),
        ip_address: 'unknown', // Would need server-side logging for real IP
      };
      
      console.log('Audit Log:', logEntry);
      // In production, you would save this to a secure audit table
    } catch (error) {
      console.error('Audit logging error:', error);
    }
  }
}

export const secureDataHandler = SecureDataHandler.getInstance();
