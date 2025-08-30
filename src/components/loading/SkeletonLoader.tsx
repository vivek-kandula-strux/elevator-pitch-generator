import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  children?: React.ReactNode;
}

export const SkeletonLoader = ({ className, ...props }: SkeletonLoaderProps) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted relative overflow-hidden", className)}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent animate-shimmer" />
    </div>
  );
};

export const SkeletonText = ({ className }: { className?: string }) => (
  <SkeletonLoader className={cn("h-4 bg-muted", className)} />
);

export const SkeletonLine = ({ className }: { className?: string }) => (
  <SkeletonLoader className={cn("h-3 bg-muted", className)} />
);

export const SkeletonCircle = ({ className }: { className?: string }) => (
  <SkeletonLoader className={cn("h-8 w-8 rounded-full bg-muted", className)} />
);

export const SkeletonButton = ({ className }: { className?: string }) => (
  <SkeletonLoader className={cn("h-10 w-24 rounded-lg bg-muted", className)} />
);

export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn("space-y-3", className)}>
    <SkeletonLoader className="h-4 w-3/4" />
    <SkeletonLoader className="h-3 w-1/2" />
    <SkeletonLoader className="h-3 w-2/3" />
  </div>
);