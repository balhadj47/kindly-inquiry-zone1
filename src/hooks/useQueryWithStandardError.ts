
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useStandardErrorHandler } from './useStandardErrorHandler';

export function useQueryWithStandardError<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[]
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
    context?: string;
    showErrorToast?: boolean;
  }
): UseQueryResult<TData, TError> {
  const { handleError } = useStandardErrorHandler();
  
  const queryOptions: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> = {
    ...options,
    onError: (error: TError) => {
      if (options.showErrorToast !== false) {
        handleError(error, options.context);
      }
      options.onError?.(error);
    }
  };

  return useQuery(queryOptions);
}
