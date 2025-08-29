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
  return <section className="relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-secondary/5" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary/5 rounded-full blur-lg animate-bounce" />
      
      <div className="relative max-w-7xl mx-auto text-center z-10">
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} className="mb-8">
          {/* Badge */}
          
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight mx-0 py-[27px]">
            Digital Marketing
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Amplified With Results
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
            Transform your business with comprehensive digital strategies that drive measurable growth. 
            From paid media to creative production - we deliver results that matter.
          </p>
        </motion.div>

        {/* Search and CTA Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.4
      }} className="max-w-2xl mx-auto space-y-6">
          {/* Enhanced Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 z-10" />
            <Input type="text" placeholder="Search our 60+ specialized services..." value={searchTerm} onChange={e => onSearchChange(e.target.value)} className="pl-12 pr-4 py-4 text-sm md:text-lg bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
          
          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button onClick={onGetStartedClick} size="lg" className="group px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-2xl shadow-lg hover:shadow-primary/25 transition-all duration-300">
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background" />
                <div className="w-8 h-8 rounded-full bg-secondary/20 border-2 border-background" />
                
              </div>
              <span>Trusted by 150+ businesses</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.6
      }} className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border/50">
          {[{
          number: "150+",
          label: "Happy Clients"
        }, {
          number: "4.9/5",
          label: "Client Rating"
        }, {
          number: "99%",
          label: "Success Rate"
        }, {
          number: "85+",
          label: "Projects Delivered"
        }].map((stat, index) => <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>)}
        </motion.div>
      </div>
    </section>;
};