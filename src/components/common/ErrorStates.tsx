
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Wifi, Shield, AlertCircle, Search } from 'lucide-react';
import { ErrorType } from '@/services/errorHandlingService';

interface BaseErrorStateProps {
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
}

interface ErrorStateProps extends BaseErrorStateProps {
  type: ErrorType;
  message?: string;
  title?: string;
}

const getErrorConfig = (type: ErrorType) => {
  const configs = {
    authentication: {
      icon: Shield,
      title: 'Session expirée',
      message: 'Votre session a expiré. Veuillez vous reconnecter.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    authorization: {
      icon: Shield,
      title: 'Accès refusé',
      message: 'Vous n\'avez pas les permissions nécessaires.',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    validation: {
      icon: AlertCircle,
      title: 'Données invalides',
      message: 'Veuillez vérifier les informations saisies.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    network: {
      icon: Wifi,
      title: 'Problème de connexion',
      message: 'Vérifiez votre connexion internet.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    server: {
      icon: AlertTriangle,
      title: 'Erreur serveur',
      message: 'Le serveur rencontre des difficultés.',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    not_found: {
      icon: Search,
      title: 'Non trouvé',
      message: 'Les données demandées n\'existent pas.',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    unknown: {
      icon: AlertTriangle,
      title: 'Erreur inattendue',
      message: 'Une erreur inattendue s\'est produite.',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  };

  return configs[type] || configs.unknown;
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  type,
  message,
  title,
  onRetry,
  isRetrying,
  className = ''
}) => {
  const config = getErrorConfig(type);
  const Icon = config.icon;

  return (
    <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`mx-auto mb-4 w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${config.color}`} />
          </div>
          <CardTitle className="text-xl">
            {title || config.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {message || config.message}
          </p>
          
          {onRetry && (
            <Button 
              onClick={onRetry} 
              disabled={isRetrying}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Actualisation...' : 'Réessayer'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Specific error states for common scenarios
export const NetworkError: React.FC<BaseErrorStateProps> = (props) => (
  <ErrorState type="network" {...props} />
);

export const PermissionError: React.FC<BaseErrorStateProps> = (props) => (
  <ErrorState type="authorization" {...props} />
);

export const AuthenticationError: React.FC<BaseErrorStateProps> = (props) => (
  <ErrorState type="authentication" {...props} />
);

export const NotFoundError: React.FC<BaseErrorStateProps> = (props) => (
  <ErrorState type="not_found" {...props} />
);
