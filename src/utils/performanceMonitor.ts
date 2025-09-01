import { supabase } from '@/integrations/supabase/client';

// Component load time measurement
export const measureLoadTime = (componentName: string) => {
  const startTime = performance.now();
  return () => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    console.log(`⚡ ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
    
    // Send to GTM if available
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'timing_complete', {
        name: componentName,
        value: Math.round(loadTime)
      });
    }
  };
};

// Lazy chunk logging
export const logBundleSplit = (chunkName: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`📦 Loading lazy chunk: ${chunkName}`);
  }
};

// First Contentful Paint (FCP) measurement
export const measureFCP = () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcpEntry) {
        const fcp = fcpEntry.startTime;
        console.log(`🎨 First Contentful Paint: ${fcp.toFixed(2)}ms`);
        
        // Send to GTM if available
        if (typeof (window as any).gtag !== 'undefined') {
          (window as any).gtag('event', 'timing_complete', {
            name: 'first_contentful_paint',
            value: Math.round(fcp)
          });
        }
        
        observer.disconnect();
      }
    });
    
    observer.observe({ entryTypes: ['paint'] });
  }
};

// Bundle impact estimation
export const estimateBundleImpact = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Estimated bundle sizes:');
    console.log('  • React Query: ~25KB');
    console.log('  • Framer Motion: ~55KB');
    console.log('  • React Router: ~15KB');
    console.log('  • Radix UI components: ~30KB');
    console.log('  • Total lazy chunks: ~150-200KB');
  }
};

export class PerformanceMonitor {
  static async recordMetric(
    metricType: string,
    serviceName: string,
    value: number,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      await supabase
        .from('performance_metrics')
        .insert({
          metric_type: metricType,
          service_name: serviceName,
          value,
          metadata: metadata || {}
        });
    } catch (error) {
      console.error('Failed to record performance metric:', error);
    }
  }

  static async recordAPILatency(
    serviceName: string,
    latencyMs: number,
    endpoint?: string
  ): Promise<void> {
    await this.recordMetric('api_latency', serviceName, latencyMs, { endpoint });
  }

  static async recordQueueSize(serviceName: string, size: number): Promise<void> {
    await this.recordMetric('queue_size', serviceName, size);
  }

  static async recordErrorRate(serviceName: string, errorRate: number): Promise<void> {
    await this.recordMetric('error_rate', serviceName, errorRate);
  }

  static measureLatency<T>(
    serviceName: string,
    operation: () => Promise<T>,
    endpoint?: string
  ): Promise<T> {
    return new Promise(async (resolve, reject) => {
      const startTime = performance.now();
      
      try {
        const result = await operation();
        const endTime = performance.now();
        const latency = endTime - startTime;
        
        await this.recordAPILatency(serviceName, latency, endpoint);
        resolve(result);
      } catch (error) {
        const endTime = performance.now();
        const latency = endTime - startTime;
        
        await this.recordAPILatency(serviceName, latency, endpoint);
        reject(error);
      }
    });
  }

  static async getMetrics(
    serviceName: string,
    metricType: string,
    hours: number = 24
  ): Promise<any[]> {
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - hours);

    const { data, error } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('service_name', serviceName)
      .eq('metric_type', metricType)
      .gte('timestamp', startTime.toISOString())
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Failed to fetch metrics:', error);
      return [];
    }

    return data || [];
  }
}