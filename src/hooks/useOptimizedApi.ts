import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

// Request deduplication and batching
const pendingRequests = new Map<string, Promise<any>>();

export const useBatchedRequest = <T>(
  key: string,
  fetcher: () => Promise<T>,
  enabled: boolean = true
) => {
  const queryClient = useQueryClient();

  const optimizedFetcher = useCallback(async () => {
    // Request deduplication
    if (pendingRequests.has(key)) {
      return pendingRequests.get(key);
    }

    const request = fetcher();
    pendingRequests.set(key, request);

    try {
      const result = await request;
      pendingRequests.delete(key);
      return result;
    } catch (error) {
      pendingRequests.delete(key);
      throw error;
    }
  }, [key, fetcher]);

  return useQuery({
    queryKey: [key],
    queryFn: optimizedFetcher,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
};

// Selective data fetching
export const useSelectiveQuery = <TData, TSelected = TData>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  selector?: (data: TData) => TSelected,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey,
    queryFn,
    select: selector,
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

// Pre-loading hook for critical data
export const usePreloadData = () => {
  const queryClient = useQueryClient();

  const preloadQuery = useCallback(
    (queryKey: readonly unknown[], queryFn: () => Promise<any>) => {
      queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: 5 * 60 * 1000,
      });
    },
    [queryClient]
  );

  return { preloadQuery };
};