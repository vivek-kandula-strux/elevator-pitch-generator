import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, Star, Award } from 'lucide-react';
import { Button } from './ui/button';
import { ServicePillar } from '../data/servicePillars';

interface ServicePillarAccordionProps {
  pillar: ServicePillar;
  onGetQuote: () => void;
}

export const ServicePillarAccordion = ({ pillar, onGetQuote }: ServicePillarAccordionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const coreServices = pillar.services.filter(service => service.isCore);
  const additionalServices = pillar.services.filter(service => !service.isCore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-card backdrop-blur-sm hover:border-border transition-all duration-300"
    >

      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 lg:p-6 text-left focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-2xl transition-all duration-200 min-h-[44px]"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 lg:gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0 w-10 lg:w-12 h-10 lg:h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-lg lg:text-2xl">
              {pillar.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {pillar.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {pillar.description}
              </p>
              
              {/* Core Services Preview */}
              <div className="mt-3 flex flex-wrap gap-1.5 lg:gap-2">
                {coreServices.slice(0, 2).map((service) => (
                  <span
                    key={service.id}
                    className="inline-flex items-center px-2 lg:px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium"
                  >
                    {service.title}
                  </span>
                ))}
                {pillar.services.length > 2 && (
                  <span className="text-xs text-muted-foreground px-2 lg:px-2.5 py-1">
                    +{pillar.services.length - 2} more
                  </span>
                )}
              </div>
            </div>
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 ml-2 lg:ml-4"
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </motion.div>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 lg:px-6 pb-4 lg:pb-6">
              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4 lg:mb-6" />

              {/* All Services */}
              <div className="space-y-2 lg:space-y-3 mb-4 lg:mb-6">
                {pillar.services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-start gap-3 p-2 lg:p-3 rounded-xl hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5 lg:mt-2" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground mb-1">
                        {service.title}
                        {service.isCore && (
                          <Award className="w-3 h-3 text-primary ml-1 inline" />
                        )}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Case Study */}
              <div className="p-3 lg:p-4 rounded-xl bg-muted/10 border border-border/30 mb-4 lg:mb-6">
                <div className="flex items-center gap-2 mb-2 lg:mb-3">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-xs font-medium text-success">Success Story</span>
                </div>
                <p className="text-sm text-foreground font-medium mb-2">
                  {pillar.caseStudy.client}
                </p>
                <div className="flex flex-col gap-2 lg:gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base lg:text-lg font-bold text-primary">{pillar.caseStudy.result}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>•</span>
                    <span>{pillar.caseStudy.metric}</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Button
                onClick={onGetQuote}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium rounded-xl h-11 lg:h-12 transition-all duration-300 min-h-[44px]"
              >
                Get Quote for {pillar.title}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};