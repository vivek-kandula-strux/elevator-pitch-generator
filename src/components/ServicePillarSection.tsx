import { motion } from 'framer-motion';
import { useState } from 'react';
import { ServicePillar } from '../data/servicePillars';
import { ServiceCategory } from '../types/services';
import { ServiceHeroCard } from './ServiceHeroCard';
import { ServiceCompactCard } from './ServiceCompactCard';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ServicePillarSectionProps {
  pillar: ServicePillar;
  heroServices: ServiceCategory[];
  allServices: ServiceCategory[];
  onServiceSelect: (service: ServiceCategory) => void;
  index: number;
}

export const ServicePillarSection = ({
  pillar,
  heroServices,
  allServices,
  onServiceSelect,
  index
}: ServicePillarSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const secondaryServices = allServices.filter(service => 
    !pillar.heroServices.includes(service.id)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="mb-20"
    >
      {/* Pillar Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="text-4xl">{pillar.icon}</div>
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {pillar.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {pillar.description}
            </p>
          </div>
        </div>
        
        <div className="flex justify-center gap-2 mt-4">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30">
            {allServices.length} Services Available
          </Badge>
          <Badge variant="outline" className="bg-secondary/5 text-secondary border-secondary/30">
            Featured Solutions
          </Badge>
        </div>
      </div>

      {/* Hero Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {heroServices.map((service, idx) => (
          <ServiceHeroCard
            key={service.id}
            category={service}
            onSelect={onServiceSelect}
            index={idx}
            badge={idx === 0 ? "Most Popular" : "Best ROI"}
          />
        ))}
      </div>

      {/* Expandable Secondary Services */}
      {secondaryServices.length > 0 && (
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-1 gap-3 mb-6">
            {secondaryServices.map((service, idx) => (
              <ServiceCompactCard
                key={service.id}
                category={service}
                onSelect={onServiceSelect}
                index={idx}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Expand/Collapse Button */}
      {secondaryServices.length > 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="group"
          >
            {isExpanded ? (
              <>
                Show Less
                <ChevronUp className="w-4 h-4 ml-2 group-hover:-translate-y-0.5 transition-transform" />
              </>
            ) : (
              <>
                View All {pillar.title} Services ({secondaryServices.length} more)
                <ChevronDown className="w-4 h-4 ml-2 group-hover:translate-y-0.5 transition-transform" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Separator */}
      <div className="mt-16 flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${pillar.color} opacity-60`} />
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>
    </motion.div>
  );
};