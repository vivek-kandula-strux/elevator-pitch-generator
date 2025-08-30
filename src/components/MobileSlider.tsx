import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
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
    <div className="block md:hidden bg-card/50 backdrop-blur-sm border border-card-border rounded-2xl p-6 mx-4 mb-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Do you need help marketing your business?
        </h1>
        <p className="text-muted-foreground text-sm">
          Slide to explore our marketing services
        </p>
      </div>

      {/* iOS-style Slider */}
      <div className="relative">
        <div
          ref={sliderRef}
          className="relative h-16 bg-muted/30 rounded-full border-2 border-muted/50 overflow-hidden select-none"
        >
          {/* Progress Background */}
          <div 
            className="absolute inset-0 bg-gradient-primary/20 transition-all duration-200 ease-out rounded-full"
            style={{ 
              width: `${Math.max(progressPercentage, 15)}%`,
              opacity: isSliding ? 0.6 : 0.3
            }}
          />
          
          {/* Slide Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className={`text-sm font-medium transition-opacity duration-200 ${
              progressPercentage > 50 ? 'opacity-0' : 'opacity-100'
            } ${isCompleted ? 'text-primary' : 'text-muted-foreground'}`}>
              {isCompleted ? 'Opening Services...' : 'Slide to explore services'}
            </span>
          </div>
          
          {/* Animated Arrow Hints */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-1 pointer-events-none">
            {[0, 1, 2].map((i) => (
              <ChevronRight
                key={i}
                className={`w-4 h-4 text-muted-foreground/60 animate-pulse`}
                style={{ 
                  animationDelay: `${i * 150}ms`,
                  opacity: progressPercentage > 30 ? 0 : 1
                }}
              />
            ))}
          </div>

          {/* Slider Thumb */}
          <div
            ref={thumbRef}
            className={`absolute left-1 top-1 w-14 h-14 bg-gradient-primary rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-200 ${
              isSliding ? 'scale-110' : 'scale-100'
            } ${isCompleted ? 'bg-green-500' : ''}`}
            style={{ 
              transform: `translateX(${slideOffset}px) ${isSliding ? 'scale(1.1)' : 'scale(1)'}`,
              transition: isSliding ? 'none' : 'transform 0.3s ease-out'
            }}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
          >
            {isCompleted ? (
              <div className="w-5 h-5 border-2 border-white rounded-full bg-white/20 animate-spin" />
            ) : (
              <ChevronRight className="w-6 h-6 text-primary-foreground" />
            )}
          </div>
        </div>

        {/* Helper Text */}
        <div className="text-center mt-3">
          <p className="text-xs text-muted-foreground">
            {isCompleted 
              ? 'Redirecting to services...' 
              : progressPercentage > 50 
                ? 'Keep sliding!' 
                : 'Swipe right to continue'
            }
          </p>
        </div>
      </div>
    </div>
  );
}