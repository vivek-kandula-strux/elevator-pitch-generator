import { SkeletonLoader, SkeletonText, SkeletonButton, SkeletonCard } from './SkeletonLoader';

export const HeroSkeleton = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4 text-center space-y-8">
        <div className="space-y-4">
          <SkeletonLoader className="h-16 w-3/4 mx-auto" />
          <SkeletonLoader className="h-6 w-2/3 mx-auto" />
          <SkeletonLoader className="h-6 w-1/2 mx-auto" />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <SkeletonButton className="w-48 h-12" />
          <SkeletonButton className="w-40 h-12" />
        </div>
        
        <div className="flex justify-center items-center space-x-6 pt-8">
          <SkeletonLoader className="h-6 w-32" />
          <div className="flex space-x-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonLoader key={i} className="h-8 w-8 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const ServicesSectionSkeleton = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <SkeletonLoader className="h-10 w-1/3 mx-auto" />
          <SkeletonLoader className="h-6 w-2/3 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <SkeletonLoader className="h-12 w-12 rounded-lg" />
                <SkeletonText className="h-6 w-2/3" />
              </div>
              <SkeletonLoader className="h-4 w-full" />
              <SkeletonLoader className="h-4 w-5/6" />
              <SkeletonLoader className="h-4 w-4/5" />
              <SkeletonButton className="w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const TestimonialsSkeleton = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <SkeletonLoader className="h-10 w-1/3 mx-auto" />
          <SkeletonLoader className="h-6 w-1/2 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <SkeletonLoader className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <SkeletonText className="h-4 w-24" />
                  <SkeletonLoader className="h-3 w-20" />
                </div>
              </div>
              <SkeletonLoader className="h-4 w-full" />
              <SkeletonLoader className="h-4 w-5/6" />
              <SkeletonLoader className="h-4 w-4/5" />
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <SkeletonLoader key={j} className="h-4 w-4" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const FAQSkeleton = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16 space-y-4">
          <SkeletonLoader className="h-10 w-1/3 mx-auto" />
          <SkeletonLoader className="h-6 w-2/3 mx-auto" />
        </div>
        
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-border rounded-lg p-6 space-y-3">
              <SkeletonText className="h-6 w-3/4" />
              <SkeletonLoader className="h-4 w-full" />
              <SkeletonLoader className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const CTASkeleton = () => {
  return (
    <section className="py-20 bg-gradient-primary text-white">
      <div className="container mx-auto px-4 text-center space-y-8">
        <div className="space-y-4">
          <SkeletonLoader className="h-12 w-2/3 mx-auto bg-white/20" />
          <SkeletonLoader className="h-6 w-1/2 mx-auto bg-white/20" />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <SkeletonButton className="w-48 h-12 bg-white/20" />
          <SkeletonButton className="w-40 h-12 bg-white/20" />
        </div>
      </div>
    </section>
  );
};