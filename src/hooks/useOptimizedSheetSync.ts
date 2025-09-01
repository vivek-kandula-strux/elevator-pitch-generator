import { useCallback, useRef } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface SyncOptions {
  minInterval?: number // Minimum time between syncs in ms
  maxRetries?: number
  retryDelay?: number // Base delay for exponential backoff
}

export const useOptimizedSheetSync = (options: SyncOptions = {}) => {
  const {
    minInterval = 5 * 60 * 1000, // 5 minutes default
    maxRetries = 3,
    retryDelay = 1000
  } = options

  const lastSyncRef = useRef<number>(0)
  const isRunningRef = useRef<boolean>(false)
  const retryCountRef = useRef<number>(0)

  const canSync = useCallback(() => {
    const now = Date.now()
    const timeSinceLastSync = now - lastSyncRef.current
    
    // Check minimum interval and if not already running
    return timeSinceLastSync >= minInterval && !isRunningRef.current
  }, [minInterval])

  const syncToSheets = useCallback(async (force: boolean = false): Promise<boolean> => {
    // Check if we can sync (unless forced)
    if (!force && !canSync()) {
      console.log('Sync skipped: minimum interval not met or sync already running')
      return false
    }

    // Check page visibility to avoid unnecessary syncs
    if (!force && document.hidden) {
      console.log('Sync skipped: page not visible')
      return false
    }

    isRunningRef.current = true
    
    try {
      console.log('Starting optimized Google Sheets sync...')
      
      // Sync elevator pitches
      const pitchResult = await supabase.functions.invoke('sync-to-google-sheets')
      
      if (pitchResult.error) {
        throw new Error(`Elevator pitches sync failed: ${pitchResult.error.message}`)
      }

      // Sync requirements
      const requirementResult = await supabase.functions.invoke('sync-requirements-to-google-sheets')
      
      if (requirementResult.error) {
        throw new Error(`Requirements sync failed: ${requirementResult.error.message}`)
      }

      // Success - reset retry count and update last sync time
      retryCountRef.current = 0
      lastSyncRef.current = Date.now()
      
      console.log('Optimized sync completed successfully:', {
        pitches: pitchResult.data,
        requirements: requirementResult.data
      })
      
      return true
    } catch (error) {
      console.error('Sync failed:', error)
      
      // Implement exponential backoff for retries
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++
        const delay = retryDelay * Math.pow(2, retryCountRef.current - 1)
        
        console.log(`Retrying sync in ${delay}ms (attempt ${retryCountRef.current}/${maxRetries})`)
        
        setTimeout(() => {
          syncToSheets(force)
        }, delay)
      } else {
        console.error('Max retries reached, giving up on sync')
        retryCountRef.current = 0 // Reset for next time
      }
      
      return false
    } finally {
      isRunningRef.current = false
    }
  }, [canSync, maxRetries, retryDelay])

  const queueSync = useCallback(() => {
    // Queue a sync to run when interval allows
    if (canSync()) {
      syncToSheets()
    } else {
      // Schedule for later when minimum interval is met
      const timeUntilNextSync = minInterval - (Date.now() - lastSyncRef.current)
      if (timeUntilNextSync > 0) {
        setTimeout(() => {
          if (canSync()) {
            syncToSheets()
          }
        }, timeUntilNextSync)
      }
    }
  }, [syncToSheets, canSync, minInterval])

  const forcSync = useCallback(() => {
    return syncToSheets(true)
  }, [syncToSheets])

  return {
    syncToSheets: queueSync, // Regular sync respects intervals
    forceSync: forcSync, // Force sync ignores intervals
    canSync,
    isRunning: () => isRunningRef.current,
    getLastSyncTime: () => lastSyncRef.current
  }
}