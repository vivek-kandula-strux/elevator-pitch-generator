import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 relative">
          {/* Logo - Left on desktop, hidden on mobile */}
          <div className="hidden md:flex items-center">
            <Logo className="h-8 md:h-10 w-auto" />
          </div>
          
          {/* Mobile Logo Center */}
          <div className="md:hidden absolute left-1/2 transform -translate-x-1/2">
            <Logo className="h-8 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="/" 
              className="text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium"
            >
              30 Second Generator
            </a>
            <a 
              href="#services" 
              className="text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium"
            >
              Our Services
            </a>
            <a 
              href="#support" 
              className="text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium"
            >
              Support
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden absolute right-0"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-4 py-4">
              <a 
                href="/" 
                className="text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium px-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                30 Second Generator
              </a>
              <a 
                href="#services" 
                className="text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium px-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Our Services
              </a>
              <a 
                href="#support" 
                className="text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium px-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Support
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;