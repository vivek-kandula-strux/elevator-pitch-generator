import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGTMTracking } from '@/hooks/useGTMTracking';

export function MobileSlider() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { trackButtonClick, trackNavigation } = useGTMTracking();
  
  const [isSliding, setIsSliding] = useState(false);
  const [slideOffset, setSlideOffset] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  
  const SLIDE_THRESHOLD = 0.85; // 85% of the way to complete
  const THUMB_SIZE = 60;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isSliding || !sliderRef.current || !thumbRef.current) return;
      
      const rect = sliderRef.current.getBoundingClientRect();
      const maxSlide = rect.width - THUMB_SIZE;
      const newOffset = Math.min(Math.max(0, e.clientX - rect.left - THUMB_SIZE / 2), maxSlide);
      
      setSlideOffset(newOffset);
      
      // Check if we've reached the threshold
      if (newOffset / maxSlide >= SLIDE_THRESHOLD && !isCompleted) {
        handleSlideComplete();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSliding || !sliderRef.current || !thumbRef.current) return;
      
      const rect = sliderRef.current.getBoundingClientRect();
      const maxSlide = rect.width - THUMB_SIZE;
      const touch = e.touches[0];
      const newOffset = Math.min(Math.max(0, touch.clientX - rect.left - THUMB_SIZE / 2), maxSlide);
      
      setSlideOffset(newOffset);
      
      // Check if we've reached the threshold
      if (newOffset / maxSlide >= SLIDE_THRESHOLD && !isCompleted) {
        handleSlideComplete();
      }
    };

    const handleEnd = () => {
      if (!isCompleted) {
        // Snap back if not completed
        setSlideOffset(0);
      }
      setIsSliding(false);
    };

    if (isSliding) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isSliding, isCompleted]);

  const handleSlideComplete = () => {
    setIsCompleted(true);
    
    // Track the action
    trackButtonClick('Mobile Slider Complete', 'mobile-marketing-slider');
    trackNavigation('/services', location.pathname);

    // Show toast
    toast({
      title: "🚀 Let's grow your business!",
      description: "Would you like to double your leads and sales for your business?",
      duration: 3000,
    });

    // Navigate after a short delay
    setTimeout(() => {
      navigate('/services');
    }, 800);
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isCompleted) {
      setIsSliding(true);
    }
  };

  const progressPercentage = sliderRef.current 
    ? (slideOffset / (sliderRef.current.offsetWidth - THUMB_SIZE)) * 100
    : 0;

  return (
    <div className="block md:hidden px-6 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-3">
          Do you need help marketing your business?
        </h1>
        <p className="text-muted-foreground/80 text-sm">
          Slide to explore our marketing services
        </p>
      </div>

      {/* Clean iOS-style Slider */}
      <div className="relative max-w-sm mx-auto">
        <div
          ref={sliderRef}
          className="relative h-[60px] bg-muted/20 rounded-full overflow-hidden select-none border border-border/20"
        >
          {/* Progress Background */}
          <div 
            className="absolute inset-0 bg-primary/10 transition-all duration-200 ease-out rounded-full"
            style={{ 
              width: `${Math.max(progressPercentage, 0)}%`,
            }}
          />
          
          {/* Slide Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none pr-16">
            <span className={`text-sm font-medium transition-all duration-300 ${
              progressPercentage > 40 ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'
            } ${isCompleted ? 'text-primary' : 'text-muted-foreground/70'}`}>
              {isCompleted ? 'Opening Services...' : 'Slide to explore'}
            </span>
          </div>

          {/* Slider Thumb */}
          <div
            ref={thumbRef}
            className={`absolute left-0 top-0 w-[60px] h-[60px] bg-primary rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-200 ${
              isSliding ? 'scale-105' : 'scale-100'
            } ${isCompleted ? 'bg-green-500' : ''}`}
            style={{ 
              transform: `translateX(${slideOffset}px) ${isSliding ? 'scale(1.05)' : 'scale(1)'}`,
              transition: isSliding ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
          >
            {isCompleted ? (
              <div className="w-5 h-5 border-2 border-primary-foreground rounded-full border-t-transparent animate-spin" />
            ) : (
              <ChevronRight className="w-6 h-6 text-primary-foreground" />
            )}
          </div>
        </div>

        {/* Helper Text */}
        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground/60">
            {isCompleted 
              ? 'Taking you to our services...' 
              : progressPercentage > 50 
                ? 'Almost there!' 
                : 'Swipe right to continue'
            }
          </p>
        </div>
      </div>
    </div>
  );
}