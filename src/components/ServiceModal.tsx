import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Service } from '../types/services';
import { Button } from './ui/button';

interface ServiceModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onRequirementClick: () => void;
}

export const ServiceModal = ({ service, isOpen, onClose, onRequirementClick }: ServiceModalProps) => {
  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              duration: 0.3,
              ease: "easeOut"
            }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background border border-border hover:border-primary/20 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="p-8 pb-6 border-b border-border/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
                  {service.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {service.title} Case Study
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Case Study Content */}
            <div className="p-8">
              {/* Client & Brief */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-3">Client Overview</h3>
                <div className="bg-muted/30 rounded-xl p-6">
                  <h4 className="font-medium text-foreground mb-2">{service.caseStudy.client}</h4>
                  <p className="text-muted-foreground leading-relaxed">{service.caseStudy.brief}</p>
                </div>
              </div>

              {/* Challenge & Solution */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Challenge</h3>
                  <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
                    <p className="text-foreground leading-relaxed">{service.caseStudy.challenge}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Solution</h3>
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                    <p className="text-foreground leading-relaxed">{service.caseStudy.solution}</p>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Results Achieved</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {service.caseStudy.results.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 text-center"
                    >
                      <div className="text-3xl font-bold text-primary mb-2">{result.value}</div>
                      <div className="font-medium text-foreground mb-1">{result.metric}</div>
                      <div className="text-sm text-muted-foreground">{result.description}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Ready to achieve similar results?
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Let's discuss your specific requirements and create a custom strategy that drives real results for your business.
                  </p>
                  <Button 
                    onClick={onRequirementClick}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                  >
                    Have a Requirement?
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};