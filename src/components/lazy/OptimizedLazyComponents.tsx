import { lazy, Suspense, ComponentType } from 'react';
import { measureLoadTime } from '@/utils/performanceMonitor';
import { SkeletonLoader } from '@/components/loading/SkeletonLoader';

// High-performance lazy wrapper with performance monitoring
const createOptimizedLazy = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  componentName: string,
  priority: 'high' | 'medium' | 'low' = 'medium'
) => {
  return lazy(async () => {
    const endTimer = measureLoadTime(componentName);
    
    // Use different loading strategies based on priority
    const loadPromise = priority === 'high' 
      ? importFn() // Immediate load for critical components
      : new Promise<{ default: T }>(resolve => {
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => importFn().then(resolve));
          } else {
            setTimeout(() => importFn().then(resolve), 0);
          }
        });

    const module = await loadPromise;
    endTimer();
    return module;
  });
};

// Critical components (load immediately)
export const LazyBusinessForm = createOptimizedLazy(
  () => import('@/components/BusinessForm'),
  'BusinessForm',
  'high'
);

export const LazyGenerationResults = createOptimizedLazy(
  () => import('@/components/GenerationResults'),
  'GenerationResults',
  'high'
);

export const LazyHeader = createOptimizedLazy(
  () => import('@/components/Header'),
  'Header',
  'high'
);

// Secondary components (load when needed)
export const LazyServiceModal = createOptimizedLazy(
  () => import('@/components/ServiceModal').then(m => ({ default: m.ServiceModal })),
  'ServiceModal',
  'medium'
);

export const LazyServiceCategoryModal = createOptimizedLazy(
  () => import('@/components/ServiceCategoryModal').then(m => ({ default: m.ServiceCategoryModal })),
  'ServiceCategoryModal',
  'medium'
);

export const LazyRequirementForm = createOptimizedLazy(
  () => import('@/components/RequirementForm').then(m => ({ default: m.RequirementForm })),
  'RequirementForm',
  'medium'
);

// Deferred components (load on idle)
export const LazyFloatingWidget = createOptimizedLazy(
  () => import('@/components/FloatingWidget').then(m => ({ default: m.FloatingWidget })),
  'FloatingWidget',
  'low'
);

// Section components with optimized loading
export const LazyEnhancedHeroSection = createOptimizedLazy(
  () => import('@/components/sections/EnhancedHeroSection').then(m => ({ default: m.EnhancedHeroSection })),
  'EnhancedHeroSection',
  'high'
);

export const LazyModernServicesSection = createOptimizedLazy(
  () => import('@/components/sections/ModernServicesSection').then(m => ({ default: m.ModernServicesSection })),
  'ModernServicesSection',
  'medium'
);

export const LazyClientLogoSlider = createOptimizedLazy(
  () => import('@/components/sections/ClientLogoSlider').then(m => ({ default: m.ClientLogoSlider })),
  'ClientLogoSlider',
  'low'
);

export const LazyFinalCTASection = createOptimizedLazy(
  () => import('@/components/sections/FinalCTASection').then(m => ({ default: m.FinalCTASection })),
  'FinalCTASection',
  'low'
);

// Optimized suspense wrappers with appropriate fallbacks
export const BusinessFormWithSuspense = (props: any) => (
  <Suspense fallback={
    <div className="space-y-6 p-8">
      <SkeletonLoader className="h-8 w-1/2" />
      <div className="space-y-4">
        <SkeletonLoader className="h-12 w-full" />
        <SkeletonLoader className="h-12 w-full" />
        <SkeletonLoader className="h-32 w-full" />
      </div>
      <SkeletonLoader className="h-12 w-32" />
    </div>
  }>
    <LazyBusinessForm {...props} />
  </Suspense>
);

export const GenerationResultsWithSuspense = (props: any) => (
  <Suspense fallback={
    <div className="space-y-6 p-8">
      <SkeletonLoader className="h-12 w-3/4" />
      <SkeletonLoader className="h-40 w-full" />
      <div className="flex gap-4">
        <SkeletonLoader className="h-10 w-24" />
        <SkeletonLoader className="h-10 w-24" />
      </div>
    </div>
  }>
    <LazyGenerationResults {...props} />
  </Suspense>
);

export const ServiceModalWithSuspense = (props: any) => (
  <Suspense fallback={<div className="fixed inset-0 bg-black/50 backdrop-blur" />}>
    <LazyServiceModal {...props} />
  </Suspense>
);

export const RequirementFormWithSuspense = (props: any) => (
  <Suspense fallback={
    <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center">
      <div className="bg-card p-8 rounded-lg max-w-md w-full mx-4">
        <SkeletonLoader className="h-6 w-1/2 mb-4" />
        <div className="space-y-3">
          <SkeletonLoader className="h-10 w-full" />
          <SkeletonLoader className="h-10 w-full" />
          <SkeletonLoader className="h-20 w-full" />
        </div>
      </div>
    </div>
  }>
    <LazyRequirementForm {...props} />
  </Suspense>
);