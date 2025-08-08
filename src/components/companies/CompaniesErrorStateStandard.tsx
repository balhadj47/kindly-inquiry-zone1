
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ErrorState } from '@/components/common/ErrorStates';
import { ErrorType } from '@/services/errorHandlingService';

interface CompaniesErrorStateProps {
  onAdd?: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  error?: Error;
}

const CompaniesErrorStateStandard: React.FC<CompaniesErrorStateProps> = ({
  onAdd,
  onRefresh,
  isRefreshing,
  error
}) => {
  const { t } = useLanguage();

  // Determine error type
  let errorType: ErrorType = 'server';
  if (error?.message?.includes('permission') || error?.message?.includes('Authentication required')) {
    errorType = 'authorization';
  } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
    errorType = 'network';
  }

  const isPermissionError = errorType === 'authorization';

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-full max-w-md space-y-4">
        <ErrorState
          type={errorType}
          onRetry={onRefresh}
          isRetrying={isRefreshing}
        />
        
        {onAdd && !isPermissionError && (
          <div className="text-center">
            <Button onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              {t.addNewCompany}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesErrorStateStandard;
