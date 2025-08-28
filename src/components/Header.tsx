import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        

        {/* Mobile Navigation */}
        {isMobileMenuOpen && <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-4 py-4">
              <a href="/" className="text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium px-2" onClick={() => setIsMobileMenuOpen(false)}>
                30 Second Generator
              </a>
              <a href="#services" className="text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium px-2" onClick={() => setIsMobileMenuOpen(false)}>
                Our Services
              </a>
              <a href="#support" className="text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium px-2" onClick={() => setIsMobileMenuOpen(false)}>
                Support
              </a>
            </nav>
          </div>}
      </div>
    </header>;
};
export default Header;