import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGTMTracking } from '@/hooks/useGTMTracking';
import { useIsMobile } from '@/hooks/use-mobile';

export function FloatingWidget() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { trackButtonClick, trackNavigation } = useGTMTracking();
  const isMobile = useIsMobile();

  // Don't show the widget on mobile devices or the services page
  if (isMobile || location.pathname === '/services') {
    return null;
  }

  const handleClick = () => {
    // Track the widget click
    trackButtonClick('Double Your Leads Widget', 'floating-widget');
    trackNavigation('/services', location.pathname);

    // Show toast message
    toast({
      title: "💡 Business Growth Opportunity",
      description: "Would you like to double your leads and sales for your business?",
      duration: 4000,
    });

    // Navigate to services page
    navigate('/services');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Double your leads and sales"
    >
      <div className="relative">
        {/* Main button */}
        <div className="w-14 h-14 bg-gradient-primary rounded-full shadow-primary transition-all duration-300 flex items-center justify-center group-hover:scale-110 group-hover:shadow-xl group-active:scale-105 animate-float">
          <TrendingUp 
            className="w-6 h-6 text-primary-foreground" 
            strokeWidth={2.5}
          />
        </div>
        
        {/* Pulse animation ring */}
        <div className="absolute inset-0 w-14 h-14 bg-primary/20 rounded-full animate-ping opacity-75"></div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 w-14 h-14 bg-gradient-primary rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-card border border-card-border rounded-lg p-3 shadow-lg backdrop-blur-sm whitespace-nowrap">
          <p className="text-sm font-medium text-card-foreground">
            Double your leads & sales
          </p>
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-card-border"></div>
        </div>
      </div>
    </button>
  );
}