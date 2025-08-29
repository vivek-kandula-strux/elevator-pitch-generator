import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
interface EnhancedHeroSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onGetStartedClick: () => void;
}
export const EnhancedHeroSection = ({
  searchTerm,
  onSearchChange,
  onGetStartedClick
}: EnhancedHeroSectionProps) => {
  return (
    <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-secondary/5" />
      
      {/* Floating Elements - Optimized for mobile */}
      <div className="absolute top-10 lg:top-20 left-4 lg:left-10 w-12 lg:w-20 h-12 lg:h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-10 lg:bottom-20 right-4 lg:right-10 w-16 lg:w-32 h-16 lg:h-32 bg-secondary/10 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-8 lg:w-16 h-8 lg:h-16 bg-primary/5 rounded-full blur-lg animate-bounce" />
      
      <div className="relative max-w-6xl mx-auto text-center z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          className="mb-6 lg:mb-8"
        >
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary">Trusted by 150+ Businesses</span>
          </div>
          
          {/* Main Headline - Responsive text sizing */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 lg:mb-6 leading-tight">
            Digital Marketing
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Amplified With Results
            </span>
          </h1>
          
          {/* Subheadline - Reduced density for mobile */}
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl lg:max-w-4xl mx-auto leading-relaxed mb-8 lg:mb-12 px-4 sm:px-0">
            Transform your business with comprehensive digital strategies that drive measurable growth.
          </p>
        </motion.div>

        {/* Search and CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.4 }} 
          className="max-w-2xl mx-auto space-y-4 lg:space-y-6 px-4 sm:px-0"
        >
          {/* Enhanced Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 z-10" />
            <Input 
              type="text" 
              placeholder="Search our 60+ specialized services..." 
              value={searchTerm} 
              onChange={e => onSearchChange(e.target.value)} 
              className="pl-12 pr-4 py-3 lg:py-4 text-base lg:text-lg bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 min-h-[48px]" 
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
          
          {/* CTA Button */}
          <div className="flex flex-col gap-4 justify-center items-center">
            <Button 
              onClick={onGetStartedClick} 
              size="lg" 
              className="group w-full sm:w-auto px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-2xl shadow-lg hover:shadow-primary/25 transition-all duration-300 min-h-[48px]"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-4 lg:w-5 h-4 lg:h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex -space-x-1">
                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-primary/20 border-2 border-background" />
                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-secondary/20 border-2 border-background" />
                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-primary/30 border-2 border-background" />
              </div>
              <span className="text-xs lg:text-sm">Trusted by 150+ businesses</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.6 }} 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mt-12 lg:mt-16 pt-8 lg:pt-16 border-t border-border/50 px-4 sm:px-0"
        >
          {[
            { number: "150+", label: "Happy Clients" }, 
            { number: "4.9/5", label: "Client Rating" }, 
            { number: "99%", label: "Success Rate" }, 
            { number: "85+", label: "Projects Delivered" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-primary mb-1 lg:mb-2">{stat.number}</div>
              <div className="text-xs lg:text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};