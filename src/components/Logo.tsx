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
      className={`flex items-center space-x-3 cursor-pointer transition-opacity duration-200 hover:opacity-80 ${className}`}
      onClick={handleClick}
    >
      <img 
        src="https://sgggqrcwfcbtyianduyo.supabase.co/storage/v1/object/public/Branding/Skill%20Nerchuko%20.png"
        alt="Strux Digital Logo"
        className="h-10 md:h-12 w-auto"
      />
      <span className="text-xl md:text-2xl font-bold text-foreground">
        Strux Digital
      </span>
    </div>
  );
};

export default Logo;