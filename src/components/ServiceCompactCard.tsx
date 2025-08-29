import { motion } from 'framer-motion';
import { ServiceCategory } from '../types/services';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowRight, TrendingUp } from 'lucide-react';

interface ServiceCompactCardProps {
  category: ServiceCategory;
  onSelect: (category: ServiceCategory) => void;
  index: number;
  badge?: string;
}

export const ServiceCompactCard = ({ category, onSelect, index, badge }: ServiceCompactCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      viewport={{ once: true }}
      whileHover={{ x: 4, scale: 1.01 }}
      className="group cursor-pointer"
      onClick={() => onSelect(category)}
    >
      <Card className="relative overflow-hidden bg-gradient-card border-card-border/30 hover:border-primary/40 transition-all duration-300 backdrop-blur-lg">
        {/* Background Effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
        
        <div className="relative p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              {/* Icon & Title */}
              <div className="flex items-center gap-3">
                <div className="text-2xl">{category.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {category.title}
                    </h4>
                    {badge && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-primary/5 text-primary border-primary/30">
                        {badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Services Count & Best Result */}
              <div className="hidden sm:flex items-center gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-foreground">{category.services.length}</div>
                  <div className="text-xs text-muted-foreground">Services</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-primary">{category.caseStudy.results[0]?.value}</div>
                  <div className="text-xs text-muted-foreground">{category.caseStudy.results[0]?.metric}</div>
                </div>
              </div>

              {/* Arrow */}
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </div>
        </div>

        {/* Subtle Glow Line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Card>
    </motion.div>
  );
};