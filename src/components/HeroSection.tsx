import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary))_0%,transparent_50%)] opacity-10" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <span className="text-sm font-medium text-primary">✨ Trusted by 500+ Growing Businesses</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6"
            >
              MASTERING
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent block">
                SOCIAL MEDIA
              </span>
              <span className="bg-gradient-to-r from-primary/80 to-foreground bg-clip-text text-transparent">
                SUCCESS
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-2xl"
            >
              Transform your brand with data-driven digital marketing strategies. 
              From social media management to performance marketing - we deliver 
              <span className="text-primary font-semibold"> measurable results</span> that scale your business.
            </motion.p>

            {/* Key Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              {[
                "300% Average ROI",
                "60+ Service Solutions",
                "14 Specialized Categories"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground font-medium">{benefit}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-primary text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl hover:shadow-primary/25 transition-all duration-300"
              >
                Get Free Strategy Call
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold rounded-xl border-primary/20 hover:bg-primary/10 transition-all duration-300"
              >
                <PlayCircle className="mr-2 w-5 h-5" />
                Watch Success Stories
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative">
              {/* Floating Stats Cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -top-8 -left-8 bg-card/80 backdrop-blur-lg rounded-2xl p-4 border border-primary/20 shadow-xl"
              >
                <div className="text-2xl font-bold text-primary">500%</div>
                <div className="text-sm text-muted-foreground">Growth Rate</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -bottom-8 -right-8 bg-card/80 backdrop-blur-lg rounded-2xl p-4 border border-primary/20 shadow-xl"
              >
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </motion.div>

              {/* Central Visual Element */}
              <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl p-8 border border-primary/20">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-4">60+</div>
                  <div className="text-lg font-semibold text-foreground mb-2">Digital Solutions</div>
                  <div className="text-muted-foreground">Across 14 Categories</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};