import { motion } from 'framer-motion';
import { ServiceCategory } from '../types/services';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowRight, TrendingUp, Users, Star } from 'lucide-react';

interface ServiceHeroCardProps {
  category: ServiceCategory;
  onSelect: (category: ServiceCategory) => void;
  index: number;
  badge?: string;
}

export const ServiceHeroCard = ({ category, onSelect, index, badge }: ServiceHeroCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="group cursor-pointer h-full"
      onClick={() => onSelect(category)}
    >
      <Card className="relative overflow-hidden h-full bg-gradient-card border-card-border/50 hover:border-primary/30 transition-all duration-500 backdrop-blur-xl">
        {/* Background Gradient Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
        
        {/* Content */}
        <div className="relative p-8 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{category.icon}</div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  {badge && (
                    <Badge variant="secondary" className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/20">
                      {badge}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  {category.description}
                </p>
              </div>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-foreground/80 text-base leading-relaxed mb-6 flex-grow">
            {category.shortDesc}
          </p>

          {/* Key Services Preview */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-muted-foreground mb-3">Key Services Include:</p>
            <div className="grid grid-cols-1 gap-2">
              {category.services.slice(0, 3).map((service, idx) => (
                <div key={service.id} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  <span className="text-sm text-foreground/70">{service.title}</span>
                </div>
              ))}
              {category.services.length > 3 && (
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                  <span className="text-sm text-muted-foreground">
                    +{category.services.length - 3} more services
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Case Study Preview */}
          <div className="bg-muted/30 rounded-xl p-4 mb-6 border border-muted-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Success Story</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {category.caseStudy.client}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {category.caseStudy.results.slice(0, 2).map((result, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-lg font-bold text-primary">{result.value}</div>
                  <div className="text-xs text-muted-foreground">{result.metric}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Button 
            className="w-full group-hover:shadow-primary/25 transition-all duration-300"
            size="lg"
          >
            <span>Explore {category.title}</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </Card>
    </motion.div>
  );
};