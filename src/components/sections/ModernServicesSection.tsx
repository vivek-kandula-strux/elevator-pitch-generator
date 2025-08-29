import { motion } from 'framer-motion';
import { ServicePillarAccordion } from '../ServicePillarAccordion';
import { servicePillars } from '../../data/servicePillars';
import { Button } from '../ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ModernServicesSectionProps {
  onGetStartedClick: () => void;
}

export const ModernServicesSection = ({ onGetStartedClick }: ModernServicesSectionProps) => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background" />
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Hero Content */}
          <div className="lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Expert Services</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                Comprehensive Marketing
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Solutions
                </span>
              </h2>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                From growth and advertising to automation and analytics—we provide end-to-end 
                marketing services that scale your business and deliver measurable results.
              </p>

              {/* Key Benefits */}
              <div className="space-y-4 mb-8">
                {[
                  'Proven methodologies across all marketing channels',
                  'Data-driven strategies with transparent reporting',
                  'Dedicated specialists for each service area',
                  'Scalable solutions that grow with your business'
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6 p-6 rounded-2xl bg-gradient-card border border-border/50 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">500+</div>
                  <div className="text-sm text-muted-foreground">Projects Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary mb-1">95%</div>
                  <div className="text-sm text-muted-foreground">Client Retention</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success mb-1">4.8★</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Support Available</div>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                onClick={onGetStartedClick}
                size="lg"
                className="group w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-primary/25 transition-all duration-300"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>

          {/* Right Column - Service Pillars */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Choose Your Growth Path
              </h3>
              <p className="text-muted-foreground">
                Explore our specialized service categories and find the perfect solution for your business needs.
              </p>
            </motion.div>

            {/* Service Pillar Accordions */}
            <div className="space-y-4">
              {servicePillars.map((pillar, index) => (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ServicePillarAccordion
                    pillar={pillar}
                    onGetQuote={onGetStartedClick}
                  />
                </motion.div>
              ))}
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-gradient-card border border-border/50 text-center mt-8"
            >
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Need a Custom Solution?
              </h4>
              <p className="text-muted-foreground mb-4">
                We create tailored marketing strategies that fit your unique business requirements.
              </p>
              <Button
                onClick={onGetStartedClick}
                variant="outline"
                className="border-primary/30 hover:bg-primary/10 hover:border-primary/50"
              >
                Discuss Custom Needs
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};