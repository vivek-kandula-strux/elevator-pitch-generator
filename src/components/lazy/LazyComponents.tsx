import { Suspense, lazy } from 'react';
import { SkeletonLoader } from '../loading/SkeletonLoader';

// Lazy load GenerationResults component which contains heavy animations
export const LazyGenerationResults = lazy(() =>
  import('../GenerationResults').then(module => ({ default: module.default }))
);

// Lazy load BusinessForm if it becomes heavy
export const LazyBusinessForm = lazy(() =>
  import('../BusinessForm').then(module => ({ default: module.default }))
);

// Wrapper components with suspense
export const GenerationResultsWithSuspense = (props: any) => (
  <Suspense fallback={
    <div className="space-y-8 p-6">
      <div className="text-center space-y-4">
        <SkeletonLoader className="h-8 w-2/3 mx-auto" />
        <SkeletonLoader className="h-6 w-1/2 mx-auto" />
      </div>
      <div className="glass-card p-8 space-y-6">
        <SkeletonLoader className="h-6 w-1/3" />
        <div className="space-y-4">
          <SkeletonLoader className="h-4 w-full" />
          <SkeletonLoader className="h-4 w-5/6" />
          <SkeletonLoader className="h-4 w-4/5" />
          <SkeletonLoader className="h-4 w-full" />
          <SkeletonLoader className="h-4 w-3/4" />
        </div>
        <div className="flex space-x-4">
          <SkeletonLoader className="h-10 w-32" />
          <SkeletonLoader className="h-10 w-32" />
        </div>
      </div>
    </div>
  }>
    <LazyGenerationResults {...props} />
  </Suspense>
);

export const BusinessFormWithSuspense = (props: any) => (
  <Suspense fallback={
    <div className="max-w-2xl mx-auto">
      <div className="glass-card p-8 space-y-6">
        <div className="text-center space-y-4">
          <SkeletonLoader className="h-10 w-2/3 mx-auto" />
          <SkeletonLoader className="h-6 w-3/4 mx-auto" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonLoader className="h-4 w-1/4" />
            <SkeletonLoader className="h-12 w-full" />
          </div>
        ))}
        <SkeletonLoader className="h-12 w-full" />
      </div>
    </div>
  }>
    <LazyBusinessForm {...props} />
  </Suspense>
);