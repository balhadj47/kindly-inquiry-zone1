
import { toast } from '@/hooks/use-toast';

export type ErrorType = 
  | 'authentication'
  | 'authorization'
  | 'validation'
  | 'network'
  | 'server'
  | 'not_found'
  | 'unknown';

export interface StandardError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: any;
  context?: string;
}

export class ErrorHandlingService {
  private static instance: ErrorHandlingService;

  static getInstance(): ErrorHandlingService {
    if (!ErrorHandlingService.instance) {
      ErrorHandlingService.instance = new ErrorHandlingService();
    }
    return ErrorHandlingService.instance;
  }

  classifyError(error: unknown, context?: string): StandardError {
    console.error(`🔴 Error in ${context || 'unknown context'}:`, error);

    // Handle string errors
    if (typeof error === 'string') {
      return {
        type: 'unknown',
        message: error,
        context
      };
    }

    // Handle Error objects
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      
      if (message.includes('auth') || message.includes('login') || message.includes('token')) {
        return {
          type: 'authentication',
          message: 'Votre session a expiré. Veuillez vous reconnecter.',
          code: 'AUTH_ERROR',
          context
        };
      }

      if (message.includes('permission') || message.includes('unauthorized') || message.includes('forbidden')) {
        return {
          type: 'authorization',
          message: 'Vous n\'avez pas les permissions nécessaires pour cette action.',
          code: 'PERMISSION_ERROR',
          context
        };
      }

      if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
        return {
          type: 'validation',
          message: 'Les données saisies ne sont pas valides. Veuillez vérifier et réessayer.',
          code: 'VALIDATION_ERROR',
          context
        };
      }

      if (message.includes('network') || message.includes('connection') || message.includes('timeout')) {
        return {
          type: 'network',
          message: 'Problème de connexion. Vérifiez votre connexion internet et réessayez.',
          code: 'NETWORK_ERROR',
          context
        };
      }

      if (message.includes('not found') || message.includes('404')) {
        return {
          type: 'not_found',
          message: 'Les données demandées n\'ont pas été trouvées.',
          code: 'NOT_FOUND',
          context
        };
      }

      return {
        type: 'server',
        message: error.message || 'Une erreur serveur s\'est produite.',
        code: 'SERVER_ERROR',
        context
      };
    }

    // Handle unknown errors
    return {
      type: 'unknown',
      message: 'Une erreur inattendue s\'est produite.',
      code: 'UNKNOWN_ERROR',
      context
    };
  }

  handleError(error: unknown, context?: string): StandardError {
    const standardError = this.classifyError(error, context);
    
    this.showErrorToast(standardError);
    
    return standardError;
  }

  private showErrorToast(error: StandardError) {
    const titles: Record<ErrorType, string> = {
      authentication: 'Erreur d\'authentification',
      authorization: 'Accès refusé',
      validation: 'Erreur de validation',
      network: 'Erreur de connexion',
      server: 'Erreur serveur',
      not_found: 'Non trouvé',
      unknown: 'Erreur'
    };

    toast({
      title: titles[error.type],
      description: error.message,
      variant: 'destructive',
    });
  }

  // Method for handling async operations with consistent error handling
  async handleAsyncOperation<T>(
    operation: () => Promise<T>,
    context?: string,
    showToast = true
  ): Promise<{ data?: T; error?: StandardError }> {
    try {
      const data = await operation();
      return { data };
    } catch (error) {
      const standardError = showToast 
        ? this.handleError(error, context)
        : this.classifyError(error, context);
      
      return { error: standardError };
    }
  }
}

export const errorHandler = ErrorHandlingService.getInstance();
