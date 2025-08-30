import { SkeletonLoader, SkeletonText, SkeletonButton } from './SkeletonLoader';

export const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <SkeletonLoader className="h-8 w-32" />
          <div className="flex space-x-4">
            <SkeletonButton />
            <SkeletonButton />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <SkeletonLoader className="h-12 w-3/4 mx-auto" />
          <SkeletonLoader className="h-6 w-2/3 mx-auto" />
          <SkeletonLoader className="h-6 w-1/2 mx-auto" />
          <div className="flex justify-center space-x-4 mt-6">
            <SkeletonButton className="w-32" />
            <SkeletonButton className="w-32" />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4 p-6 border border-border rounded-lg">
              <SkeletonLoader className="h-12 w-12 rounded-lg" />
              <SkeletonText className="h-6 w-3/4" />
              <SkeletonLoader className="h-3 w-full" />
              <SkeletonLoader className="h-3 w-5/6" />
              <SkeletonButton className="w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ServicesSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <SkeletonLoader className="h-8 w-32" />
          <SkeletonButton />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 text-center space-y-6">
          <SkeletonLoader className="h-16 w-2/3 mx-auto" />
          <SkeletonLoader className="h-6 w-1/2 mx-auto" />
          <SkeletonButton className="w-40 h-12" />
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 space-y-4">
          <SkeletonLoader className="h-8 w-1/3 mx-auto" />
          <SkeletonLoader className="h-6 w-2/3 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="glass-card p-6 space-y-4">
              <SkeletonLoader className="h-16 w-16 rounded-xl" />
              <SkeletonText className="h-6 w-3/4" />
              <SkeletonLoader className="h-4 w-full" />
              <SkeletonLoader className="h-4 w-5/6" />
              <SkeletonLoader className="h-4 w-4/5" />
              <SkeletonButton className="w-full h-10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FormSkeleton = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <SkeletonLoader className="h-6 w-1/3" />
        <SkeletonLoader className="h-4 w-2/3" />
      </div>
      
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <SkeletonLoader className="h-4 w-1/4" />
          <SkeletonLoader className="h-10 w-full rounded-lg" />
        </div>
      ))}
      
      <SkeletonButton className="w-full h-12" />
    </div>
  );
};