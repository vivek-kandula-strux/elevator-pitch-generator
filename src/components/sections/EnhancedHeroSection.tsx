import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
interface EnhancedHeroSectionProps {
  onGetStartedClick: () => void;
}
export const EnhancedHeroSection = ({
  onGetStartedClick
}: EnhancedHeroSectionProps) => {
  return <section className="relative min-h-[60vh] flex items-center justify-center px-6 sm:px-8 lg:px-12 xl:px-16 overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/8 via-transparent to-secondary/8" />
      
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
      }} className="mb-6">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight mx-0 py-3">
            Digital Marketing
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Amplified With Results
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-foreground/80 max-w-4xl mx-auto leading-relaxed mb-8">
            Transform your business with comprehensive digital strategies that drive measurable growth. 
            From paid media to creative production - we deliver results that matter.
          </p>
        </motion.div>

        {/* CTA Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.4
      }} className="max-w-2xl mx-auto">
          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-2 pb-4 px-4">
            <Button onClick={onGetStartedClick} size="lg" className="group px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-2xl shadow-lg hover:shadow-primary/25 transition-all duration-300">
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-foreground/70">
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
      }} className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 pt-6 pb-8 border-t border-border/50">
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
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-xs sm:text-sm text-foreground/70">{stat.label}</div>
            </div>)}
        </motion.div>
      </div>
    </section>;
};