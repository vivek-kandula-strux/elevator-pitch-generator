import { Suspense, lazy } from 'react';
import { SkeletonLoader } from '../loading/SkeletonLoader';

// Lazy load UI library components that are not currently used
export const LazyChart = lazy(() =>
  import('../ui/chart').then(module => ({ default: module.ChartContainer }))
);

export const LazyCalendar = lazy(() =>
  import('../ui/calendar').then(module => ({ default: module.Calendar }))
);

export const LazyCarousel = lazy(() =>
  import('../ui/carousel').then(module => ({
    default: module.Carousel,
    CarouselContent: module.CarouselContent,
    CarouselItem: module.CarouselItem,
    CarouselNext: module.CarouselNext,
    CarouselPrevious: module.CarouselPrevious,
  }))
);

// Wrapper components with suspense for UI components
export const ChartWithSuspense = (props: any) => (
  <Suspense fallback={
    <div className="space-y-4">
      <SkeletonLoader className="h-64 w-full" />
      <div className="flex justify-center space-x-4">
        <SkeletonLoader className="h-4 w-16" />
        <SkeletonLoader className="h-4 w-16" />
        <SkeletonLoader className="h-4 w-16" />
      </div>
    </div>
  }>
    <LazyChart {...props} />
  </Suspense>
);

export const CalendarWithSuspense = (props: any) => (
  <Suspense fallback={
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <SkeletonLoader className="h-6 w-24" />
        <div className="flex space-x-2">
          <SkeletonLoader className="h-8 w-8" />
          <SkeletonLoader className="h-8 w-8" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <SkeletonLoader key={i} className="h-8 w-8" />
        ))}
      </div>
    </div>
  }>
    <LazyCalendar {...props} />
  </Suspense>
);

export const CarouselWithSuspense = ({ children, ...props }: any) => (
  <Suspense fallback={
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <SkeletonLoader className="h-8 w-8 rounded-full" />
        <SkeletonLoader className="h-8 w-8 rounded-full" />
      </div>
      <div className="flex space-x-4 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonLoader key={i} className="h-48 w-64 flex-shrink-0" />
        ))}
      </div>
    </div>
  }>
    <LazyCarousel {...props}>
      {children}
    </LazyCarousel>
  </Suspense>
);