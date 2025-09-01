import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedDivProps extends HTMLAttributes<HTMLDivElement> {
  animation?: 'fade-in' | 'slide-up' | 'scale-in' | 'float';
  delay?: number;
  duration?: number;
}

export const AnimatedDiv = forwardRef<HTMLDivElement, AnimatedDivProps>(
  ({ className, animation = 'fade-in', delay = 0, duration, style, children, ...props }, ref) => {
    const animationClasses = {
      'fade-in': 'animate-fade-in',
      'slide-up': 'animate-slide-up', 
      'scale-in': 'animate-scale-in',
      'float': 'animate-float'
    };

    const animationStyle = {
      animationDelay: `${delay}ms`,
      ...(duration && { animationDuration: `${duration}ms` }),
      ...style
    };

    return (
      <div
        ref={ref}
        className={cn(animationClasses[animation], className)}
        style={animationStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AnimatedDiv.displayName = 'AnimatedDiv';

// Optimized hover effects using CSS instead of JavaScript
export const HoverCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'group transition-all duration-200 will-change-transform',
          'hover:scale-[1.02] hover:-translate-y-1',
          'hover:shadow-lg hover:shadow-primary/10',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

HoverCard.displayName = 'HoverCard';