
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = "Chargement des utilisateurs..." }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Loader2 className="h-8 w-8 animate-spin" />
    <span className="ml-2">{message}</span>
  </div>
);

interface ErrorStateProps {
  title: string;
  message: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ title, message }) => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
    <Card>
      <CardContent className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{message}</p>
      </CardContent>
    </Card>
  </div>
);
