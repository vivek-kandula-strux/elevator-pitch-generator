import React from 'react';

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

const Logo = ({ className = "", onClick }: LogoProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div 
      className={`flex items-center space-x-2 sm:space-x-3 cursor-pointer group ${className}`}
      onClick={handleClick}
    >
      {/* Logo Image with Enhanced Hover Effect */}
      <div className="relative">
        <img 
          src="https://sgggqrcwfcbtyianduyo.supabase.co/storage/v1/object/public/Branding/Skill%20Nerchuko%20.png"
          alt="Strux Digital Logo"
          className="h-8 sm:h-10 md:h-12 w-auto transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-lg"
        />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
      </div>
      
      {/* Enhanced Text with Gradient and Glow */}
      <div className="flex flex-col">
        <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-display font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent group-hover:from-primary-glow group-hover:via-primary group-hover:to-primary-glow transition-all duration-300">
          Strux Digital
        </span>
        <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1" />
      </div>
    </div>
  );
};

export default Logo;