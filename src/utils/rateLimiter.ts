import { supabase } from '@/integrations/supabase/client';

interface RateLimit {
  key: string;
  maxRequests: number;
  windowMinutes: number;
}

export class RateLimiter {
  static async checkRateLimit(
    key: string,
    maxRequests: number = 60,
    windowMinutes: number = 1
  ): Promise<{ allowed: boolean; remaining: number; resetTime: Date }> {
    try {
      const windowStart = new Date();
      windowStart.setSeconds(0, 0); // Round to minute
      windowStart.setMinutes(windowStart.getMinutes() - (windowStart.getMinutes() % windowMinutes));

      // Try to get existing rate limit record
      const { data: existing, error: selectError } = await supabase
        .from('rate_limits')
        .select('*')
        .eq('key', key)
        .eq('window_start', windowStart.toISOString())
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Rate limit check error:', selectError);
        return { allowed: true, remaining: maxRequests - 1, resetTime: new Date(windowStart.getTime() + windowMinutes * 60000) };
      }

      const resetTime = new Date(windowStart.getTime() + windowMinutes * 60000);

      if (existing) {
        if (existing.request_count >= maxRequests) {
          return { allowed: false, remaining: 0, resetTime };
        }

        // Increment counter
        const { error: updateError } = await supabase
          .from('rate_limits')
          .update({ request_count: existing.request_count + 1 })
          .eq('id', existing.id);

        if (updateError) {
          console.error('Rate limit update error:', updateError);
        }

        return {
          allowed: true,
          remaining: maxRequests - existing.request_count - 1,
          resetTime
        };
      } else {
        // Create new rate limit record
        const { error: insertError } = await supabase
          .from('rate_limits')
          .insert({
            key,
            request_count: 1,
            window_start: windowStart.toISOString(),
            window_duration_minutes: windowMinutes,
            max_requests: maxRequests
          });

        if (insertError) {
          console.error('Rate limit insert error:', insertError);
        }

        return {
          allowed: true,
          remaining: maxRequests - 1,
          resetTime
        };
      }
    } catch (error) {
      console.error('Rate limiter error:', error);
      // Allow request on error to prevent blocking users
      return { allowed: true, remaining: maxRequests - 1, resetTime: new Date() };
    }
  }

  static async getUserKey(userId?: string, ipAddress?: string): Promise<string> {
    if (userId) return `user:${userId}`;
    if (ipAddress) return `ip:${ipAddress}`;
    return 'anonymous';
  }
}