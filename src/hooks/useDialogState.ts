
import { useState, useCallback } from 'react';

interface DialogState<T = any> {
  isOpen: boolean;
  data: T | null;
  type: string | null;
}

export const useDialogState = <T = any>(initialState?: Partial<DialogState<T>>) => {
  const [dialogState, setDialogState] = useState<DialogState<T>>({
    isOpen: false,
    data: null,
    type: null,
    ...initialState
  });

  const openDialog = useCallback((data: T, type?: string) => {
    setDialogState({
      isOpen: true,
      data,
      type: type || null
    });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogState({
      isOpen: false,
      data: null,
      type: null
    });
  }, []);

  const updateDialogData = useCallback((data: T) => {
    setDialogState(prev => ({
      ...prev,
      data
    }));
  }, []);

  return {
    dialogState,
    openDialog,
    closeDialog,
    updateDialogData,
    isOpen: dialogState.isOpen,
    data: dialogState.data,
    type: dialogState.type
  };
};
