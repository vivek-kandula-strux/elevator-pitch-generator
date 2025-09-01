import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGTMTracking } from '@/hooks/useGTMTracking';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/Logo';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { trackNavigation, trackButtonClick } = useGTMTracking();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    trackButtonClick(isMobileMenuOpen ? 'Close menu' : 'Open menu', 'mobile-menu-toggle');
  };

  const handleNavClick = (destination: string) => {
    trackNavigation(destination, 'header_navigation');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left on desktop, center on mobile */}
          <div className="flex items-center md:flex-none flex-1 md:flex-initial justify-center md:justify-start">
            <Link to="/" className="focus-visible:outline-none">
              <Logo />
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
              onClick={() => handleNavClick('/')}
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
              onClick={() => handleNavClick('/services')}
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
              onClick={() => handleNavClick('/contact')}
            >
              Contact Us
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-foreground/60">
                  Welcome, {user.email?.split('@')[0]}
                </span>
                <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden flex-shrink-0"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
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
              {user ? (
                <div className="flex flex-col space-y-2 px-2">
                  <span className="text-sm text-foreground/60">
                    Welcome, {user.email?.split('@')[0]}
                  </span>
                  <Button variant="outline" onClick={handleSignOut} className="w-fit">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth" className="px-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button>Sign In</Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;