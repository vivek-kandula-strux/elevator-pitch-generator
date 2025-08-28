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
    <img 
      src="/strux-digital-logo.png"
      alt="Strux Digital Logo"
      className={`cursor-pointer transition-opacity duration-200 hover:opacity-80 ${className}`}
      onClick={handleClick}
    />
  );
};

export default Logo;