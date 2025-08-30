import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ArrowRight } from 'lucide-react';
import { ServiceCategory } from '../types/services';
import { Button } from './ui/button';
import { useGTMTracking } from '../hooks/useGTMTracking';

interface ServiceCategoryModalProps {
  category: ServiceCategory | null;
  isOpen: boolean;
  onClose: () => void;
  onRequirementClick: () => void;
}

export const ServiceCategoryModal = ({ category, isOpen, onClose, onRequirementClick }: ServiceCategoryModalProps) => {
  const { trackModalOpen, trackButtonClick, trackServiceSelection } = useGTMTracking();
  
  if (!category) return null;

  const handleModalOpen = () => {
    trackModalOpen('service_category');
    trackServiceSelection(category.id, category.title);
  };

  const handleRequirementClick = () => {
    trackButtonClick('Discuss Your Requirements', 'service-requirement-cta');
    onRequirementClick();
  };

  const handleClose = () => {
    trackButtonClick('Close modal', 'service-modal-close');
    onClose();
  };

  // Track modal open when it opens
  React.useEffect(() => {
    if (isOpen && category) {
      handleModalOpen();
    }
  }, [isOpen, category]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${category.color} p-6 rounded-t-2xl`}>
              <div className="flex justify-between items-start text-white">
                <div>
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h2 className="text-2xl font-bold mb-1">{category.title}</h2>
                  <p className="text-white/90">{category.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
          onClick={handleClose}
                  className="text-white hover:bg-white/10 -mr-2 -mt-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6">
              {/* Services List */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Services Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {category.services.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30"
                    >
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-foreground text-sm">{service.title}</h4>
                        {service.description && (
                          <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Case Study */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Success Story</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Client Overview</h4>
                      <p className="text-sm text-muted-foreground mb-4">{category.caseStudy.brief}</p>
                      
                      <h4 className="font-medium text-foreground mb-2">Challenge</h4>
                      <p className="text-sm text-muted-foreground">{category.caseStudy.challenge}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Solution</h4>
                      <p className="text-sm text-muted-foreground">{category.caseStudy.solution}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Results Achieved</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {category.caseStudy.results.map((result, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + index * 0.1 }}
                          className="text-center p-4 bg-muted/30 rounded-lg"
                        >
                          <div className="text-2xl font-bold text-primary mb-1">{result.value}</div>
                          <div className="text-sm font-medium text-foreground mb-1">{result.metric}</div>
                          <div className="text-xs text-muted-foreground">{result.description}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex justify-center">
                <Button
                  onClick={handleRequirementClick}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                >
                  Discuss Your Requirements
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};