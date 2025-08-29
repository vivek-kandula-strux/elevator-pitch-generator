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
      src="https://sgggqrcwfcbtyianduyo.supabase.co/storage/v1/object/public/Branding/Skill%20Nerchuko%20.png"
      alt="Skill Nerchuko Logo"
      className={`cursor-pointer transition-opacity duration-200 hover:opacity-80 ${className}`}
      onClick={handleClick}
    />
  );
};

export default Logo;