import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useVanMutations } from '@/hooks/useVansOptimized';
import { useUserMutations } from '@/hooks/users';

interface UseDataPreloaderProps {
  preloadVans?: boolean;
  preloadUsers?: boolean;
  preloadCompanies?: boolean;
}

export const useDataPreloader = ({
  preloadVans = false,
  preloadUsers = false,
  preloadCompanies = false
}: UseDataPreloaderProps = {}) => {
  const queryClient = useQueryClient();
  const { refreshVans } = useVanMutations();
  const { invalidateUsers } = useUserMutations();

  useEffect(() => {
    const preloadData = async () => {
      console.log('🔄 DataPreloader: Starting data preload...');
      const startTime = performance.now();

      const promises = [];

      if (preloadVans) {
        console.log('🚐 DataPreloader: Preloading vans...');
        promises.push(
          queryClient.prefetchQuery({
            queryKey: ['vans'],
            staleTime: 5 * 60 * 1000, // 5 minutes
          }).catch(err => console.warn('Failed to preload vans:', err))
        );
      }

      if (preloadUsers) {
        console.log('👥 DataPreloader: Preloading users...');
        promises.push(
          queryClient.prefetchQuery({
            queryKey: ['users', 1, 20],
            staleTime: 5 * 60 * 1000, // 5 minutes
          }).catch(err => console.warn('Failed to preload users:', err))
        );
      }

      if (preloadCompanies) {
        console.log('🏢 DataPreloader: Preloading companies...');
        promises.push(
          queryClient.prefetchQuery({
            queryKey: ['companies'],
            staleTime: 5 * 60 * 1000, // 5 minutes
          }).catch(err => console.warn('Failed to preload companies:', err))
        );
      }

      if (promises.length > 0) {
        await Promise.all(promises);
        const endTime = performance.now();
        console.log(`✅ DataPreloader: Completed in ${endTime - startTime}ms`);
      }
    };

    preloadData();
  }, [preloadVans, preloadUsers, preloadCompanies, queryClient, refreshVans, invalidateUsers]);

  return {
    preloadData: () => {
      if (preloadVans) refreshVans();
      if (preloadUsers) invalidateUsers();
    }
  };
};
