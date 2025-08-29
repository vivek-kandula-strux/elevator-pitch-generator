import { motion } from 'framer-motion';
import { Service } from '../types/services';

interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
  index: number;
}

export const ServiceCard = ({ service, onSelect, index }: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut" 
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      className="group cursor-pointer"
      onClick={() => onSelect(service)}
    >
      <div className="relative p-6 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-primary/20 group-hover:bg-card/90">
        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10">
          {/* Service Icon */}
          <div className="mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200">
              {service.icon}
            </div>
          </div>
          
          {/* Service Title & Description */}
          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
            {service.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {service.description}
          </p>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {service.shortDesc}
          </p>
          
          {/* Call to Action */}
          <div className="mt-4 flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
            View Case Study
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};