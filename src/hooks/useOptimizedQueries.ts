import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isValidPhoneNumber } from '@/utils/phoneValidation';

// Query Keys for better cache management and deduplication
export const queryKeys = {
  elevatorPitches: {
    all: ['elevator_pitches'] as const,
    lists: () => [...queryKeys.elevatorPitches.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.elevatorPitches.lists(), { filters }] as const,
    details: () => [...queryKeys.elevatorPitches.all, 'detail'] as const,
    detail: (id: string, token: string) => [...queryKeys.elevatorPitches.details(), id, token] as const,
    recent: (limit: number) => [...queryKeys.elevatorPitches.all, 'recent', limit] as const,
  },
  requirements: {
    all: ['requirements'] as const,
    lists: () => [...queryKeys.requirements.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.requirements.lists(), { filters }] as const,
    recent: (limit: number) => [...queryKeys.requirements.all, 'recent', limit] as const,
  },
} as const;

// Optimized elevator pitch queries with specific column selection
export const useElevatorPitchByToken = (pitchId: string, accessToken: string) => {
  return useQuery({
    queryKey: queryKeys.elevatorPitches.detail(pitchId, accessToken),
    queryFn: async () => {
      if (!pitchId || !accessToken) {
        throw new Error('Pitch ID and access token are required');
      }

      const { data, error } = await supabase
        .rpc('get_elevator_pitch_by_token', {
          pitch_id: pitchId,
          provided_token: accessToken
        });

      if (error) throw error;
      if (!data) throw new Error('No data found');

      return data;
    },
    enabled: !!pitchId && !!accessToken,
    // Cache for 10 minutes since elevator pitches don't change often
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });
};

// Optimized recent elevator pitches query
export const useRecentElevatorPitches = (limit: number = 10) => {
  return useQuery({
    queryKey: queryKeys.elevatorPitches.recent(limit),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('elevator_pitches')
        .select('id, company, category, created_at, generated_pitch')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    // Background refetch every 3 minutes for fresh data
    refetchInterval: 3 * 60 * 1000,
    staleTime: 2 * 60 * 1000, // 2 minutes stale time for recent data
  });
};

// Optimized requirements queries
export const useRecentRequirements = (limit: number = 20) => {
  return useQuery({
    queryKey: queryKeys.requirements.recent(limit),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('requirements')
        .select('id, name, company, service_type, created_at, email')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    // Fresh data every 1 minute for requirements
    refetchInterval: 1 * 60 * 1000,
    staleTime: 30 * 1000, // 30 seconds stale time
  });
};

// Optimized elevator pitch creation mutation
export const useCreateElevatorPitch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: any) => {
      const { data: result, error } = await supabase.functions.invoke('generate-elevator-pitch', {
        body: { formData }
      });

      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      // Invalidate and refetch recent pitches
      queryClient.invalidateQueries({ queryKey: queryKeys.elevatorPitches.recent(10) });
      
      // Add the new pitch to cache
      queryClient.setQueryData(
        queryKeys.elevatorPitches.detail(data.recordId, data.accessToken),
        data
      );
    },
    retry: 1, // Only retry once to avoid spamming the API
  });
};

export const useRegenerateElevatorPitch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ pitchId, accessToken }: { pitchId: string; accessToken: string }) => {
      const { data, error } = await supabase.functions.invoke('regenerate-elevator-pitch', {
        body: { pitchId, accessToken }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error('Failed to regenerate elevator pitch');
      }
      
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate the specific pitch query to refresh the data
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.elevatorPitches.detail(variables.pitchId, variables.accessToken) 
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.elevatorPitches.recent(10) });
    },
  });
};

// Optimized requirement submission mutation
export const useSubmitRequirement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requirementData: any) => {
      // Client-side phone validation
      if (!isValidPhoneNumber(requirementData.whatsapp)) {
        throw new Error('Invalid phone number format. Please provide a valid phone number.');
      }

      // Insert requirement with specific columns only
      const { error } = await supabase
        .from('requirements')
        .insert({
          name: requirementData.name,
          email: requirementData.email,
          company: requirementData.company,
          whatsapp: requirementData.whatsapp,
          service_type: requirementData.serviceType,
          message: requirementData.message
        })
        .select('id')
        .single();

      if (error) throw error;

      return { success: true };
    },
    onSuccess: () => {
      // Invalidate recent requirements to show fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.requirements.recent(20) });
    },
    retry: 1,
  });
};

// Prefetch function for elevator pitch data
export const prefetchElevatorPitchData = (queryClient: any) => {
  // Prefetch recent elevator pitches on app load
  queryClient.prefetchQuery({
    queryKey: queryKeys.elevatorPitches.recent(5),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('elevator_pitches')
        .select('id, company, category, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Analytics query for dashboard performance
export const useElevatorPitchAnalytics = () => {
  return useQuery({
    queryKey: ['elevator_pitch_analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('elevator_pitches')
        .select('category, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Process analytics data
      const categoryStats = data?.reduce((acc: Record<string, number>, pitch) => {
        acc[pitch.category] = (acc[pitch.category] || 0) + 1;
        return acc;
      }, {}) || {};

      return {
        totalPitches: data?.length || 0,
        categoryStats,
        recentActivity: data?.slice(0, 10) || [],
      };
    },
    // Cache analytics for 5 minutes since it's not critical real-time data
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Hook to handle data prefetching on app initialization
export const useDataPrefetching = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch elevator pitch data on app load
    prefetchElevatorPitchData(queryClient);
    
    // Prefetch service categories for forms
    queryClient.prefetchQuery({
      queryKey: ['service_categories'],
      queryFn: async () => {
        // This would normally come from Supabase, but for now we'll use local data
        const { serviceCategories } = await import('@/data/serviceCategories');
        return serviceCategories;
      },
      staleTime: 60 * 60 * 1000, // 1 hour - service categories don't change often
      gcTime: 2 * 60 * 60 * 1000, // 2 hours
    });

  }, [queryClient]);
};

// Ultra-optimized background sync with intelligent scheduling
export const useBackgroundSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    let visibilityTimer: NodeJS.Timeout;
    let isUserActive = true;
    
    // Track user activity to avoid unnecessary syncs
    const handleUserActivity = () => {
      isUserActive = true;
    };

    // Debounced visibility change handler
    const handleVisibilityChange = () => {
      clearTimeout(visibilityTimer);
      
      visibilityTimer = setTimeout(() => {
        if (document.visibilityState === 'visible' && isUserActive) {
          // Only invalidate if data is stale (older than 8 minutes)
          const staleThreshold = 8 * 60 * 1000;
          const now = Date.now();
          
          queryClient.getQueryCache().getAll().forEach(query => {
            const lastFetch = query.state.dataUpdatedAt;
            if (now - lastFetch > staleThreshold) {
              queryClient.invalidateQueries({ 
                queryKey: query.queryKey, 
                refetchType: 'active' 
              });
            }
          });
          
          isUserActive = false; // Reset activity flag
        }
      }, 1500); // Debounce for 1.5 seconds
    };

    // Listen for user interactions
    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Ultra-conservative interval - 10 minutes and only for critical data
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && isUserActive) {
        // Only sync truly critical queries
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.elevatorPitches.recent(5), // Reduced from 10
          refetchType: 'active',
          exact: true
        });
      }
    }, 10 * 60 * 1000); // Every 10 minutes

    return () => {
      clearTimeout(visibilityTimer);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [queryClient]);
};

// Performance monitoring for queries
export const useQueryPerformanceMonitor = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const cache = queryClient.getQueryCache();
      
      const unsubscribe = cache.subscribe((event) => {
        if (event?.type === 'updated') {
          // Simple performance logging
          console.log(`🔍 Query cache updated`);
          
          // Track cache hit rate
          const cacheStats = queryClient.getQueryCache().getAll().reduce((acc, query) => {
            const isCached = query.state.dataUpdatedAt > 0;
            acc.total += 1;
            if (isCached) acc.hits += 1;
            return acc;
          }, { hits: 0, total: 0 });
          
          if (cacheStats.total > 0) {
            const hitRate = (cacheStats.hits / cacheStats.total * 100).toFixed(1);
            console.log(`📊 Cache hit rate: ${hitRate}%`);
          }
        }
      });

      return unsubscribe;
    }
  }, [queryClient]);
};