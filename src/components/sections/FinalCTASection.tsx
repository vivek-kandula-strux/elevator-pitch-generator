import { motion } from 'framer-motion';
import { ArrowRight, Rocket, Calendar } from 'lucide-react';
import { Button } from '../ui/button';

interface FinalCTASectionProps {
  onGetStartedClick: () => void;
}

export const FinalCTASection = ({
  onGetStartedClick
}: FinalCTASectionProps) => {
  return (
    <section className="py-16 lg:py-24 px-6 sm:px-8 lg:px-12 xl:px-16 mb-8 lg:mb-12 relative overflow-hidden bg-gradient-to-br from-primary/15 via-background to-secondary/15 border-t border-primary/20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/80 to-secondary/20" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-primary/15 to-secondary/15 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-gradient-glow opacity-25" />
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-secondary/10 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-primary/20 rounded-full animate-bounce" />
      <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-secondary/20 rounded-full animate-bounce delay-500" />
      
      <div className="relative max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          viewport={{ once: true }} 
          className="text-center"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.6, delay: 0.2 }} 
            viewport={{ once: true }} 
            className="inline-flex items-center gap-2 px-6 py-3 mb-8 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 backdrop-blur-sm"
          >
            <Rocket className="w-5 h-5 text-primary" />
            <span className="font-semibold text-primary">Ready to Transform?</span>
          </motion.div>
          
          {/* Main Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
            Let's Turn Your Vision
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Into Digital Reality
            </span>
          </h2>
          
          {/* Description */}
          <p className="text-lg sm:text-xl md:text-2xl text-foreground/80 max-w-4xl mx-auto leading-relaxed mb-12">
            Join 150+ successful businesses who've transformed their digital presence with our 
            comprehensive strategies. Your growth story starts with a single conversation.
          </p>

          {/* Value Props */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.4 }} 
            viewport={{ once: true }} 
            className="flex flex-wrap justify-center items-center gap-8 mb-12 text-foreground/75"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Quick 48hr Response</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-primary" />
              <span>Custom Strategy</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.6 }} 
            viewport={{ once: true }} 
            className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center mb-8 lg:mb-12"
          >
            <Button 
              onClick={onGetStartedClick} 
              size="lg" 
              className="group text-base lg:text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-2xl shadow-xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 px-6 lg:px-8 py-3 lg:py-4 min-h-[48px]"
            >
              Start Your Transformation
              <ArrowRight className="ml-2 lg:ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <div className="text-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base font-semibold rounded-2xl border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 min-h-[48px]"
              >
                View Our Portfolio
              </Button>
              <p className="text-xs text-foreground/70 mt-2">
                See real results from real clients
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};