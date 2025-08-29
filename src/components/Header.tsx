import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 relative">
          {/* Logo - Left on desktop, hidden on mobile */}
          <div className="hidden md:flex items-center">
            <Link to="/">
              <Logo className="h-8 md:h-10 w-auto" />
            </Link>
          </div>
          
          {/* Mobile Logo Center */}
          <div className="md:hidden absolute left-1/2 transform -translate-x-1/2">
            <Link to="/">
              <Logo className="h-8 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors duration-200 font-medium ${
                location.pathname === '/' 
                  ? 'text-primary font-semibold' 
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              30 Second Generator
            </Link>
            <Link 
              to="/services" 
              className={`transition-colors duration-200 font-medium ${
                location.pathname === '/services' 
                  ? 'text-primary font-semibold' 
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Our Services
            </Link>
            <Link 
              to="/contact" 
              className={`transition-colors duration-200 font-medium ${
                location.pathname === '/contact' 
                  ? 'text-primary font-semibold' 
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Contact Us
            </Link>
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
              <Link 
                to="/" 
                className={`transition-colors duration-200 font-medium px-2 ${
                  location.pathname === '/' 
                    ? 'text-primary font-semibold' 
                    : 'text-foreground/80 hover:text-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                30 Second Generator
              </Link>
              <Link 
                to="/services" 
                className={`transition-colors duration-200 font-medium px-2 ${
                  location.pathname === '/services' 
                    ? 'text-primary font-semibold' 
                    : 'text-foreground/80 hover:text-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Our Services
              </Link>
              <Link 
                to="/contact" 
                className={`transition-colors duration-200 font-medium px-2 ${
                  location.pathname === '/contact' 
                    ? 'text-primary font-semibold' 
                    : 'text-foreground/80 hover:text-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;