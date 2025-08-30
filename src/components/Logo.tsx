import React, { useCallback } from 'react';

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

const Logo = React.memo(({ className = "", onClick }: LogoProps) => {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    } else {
      window.location.href = '/';
    }
  }, [onClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <div 
      className={`flex items-center space-x-2 sm:space-x-3 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg p-1 -m-1 ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Navigate to home page"
    >
      {/* Logo Image with Enhanced Hover Effect */}
      <div className="relative flex-shrink-0">
        <img 
          src="https://sgggqrcwfcbtyianduyo.supabase.co/storage/v1/object/public/Branding/Skill%20Nerchuko%20.png"
          alt="Strux Digital Logo"
          className="h-8 sm:h-10 md:h-12 w-auto transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-lg"
          loading="lazy"
        />
        <div className="absolute inset-0 rounded-lg bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm" />
      </div>
      
      {/* Enhanced Text with Gradient and Glow - Single Line */}
      <div className="relative">
        <span 
          className="text-lg sm:text-xl md:text-2xl font-display font-bold bg-gradient-primary bg-clip-text text-transparent group-hover:drop-shadow-lg transition-all duration-300 whitespace-nowrap"
          style={{
            textShadow: '0 0 20px hsl(var(--primary) / 0.3)'
          }}
        >
          Strux Digital
        </span>
        {/* Subtle underline effect */}
        <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-primary opacity-0 group-hover:opacity-60 transition-opacity duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left" />
      </div>
    </div>
  );
});

Logo.displayName = 'Logo';

export default Logo;