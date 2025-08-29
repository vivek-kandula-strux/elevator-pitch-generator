import { motion } from 'framer-motion';
import { ChevronRight, Users } from 'lucide-react';
import { ServiceCategory } from '../types/services';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ServiceCategoryCardProps {
  category: ServiceCategory;
  onSelect: (category: ServiceCategory) => void;
  index: number;
}

export const ServiceCategoryCard = ({ category, onSelect, index }: ServiceCategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card 
        className="h-full cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 group"
        onClick={() => onSelect(category)}
      >
        <CardHeader className="pb-4">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center text-2xl mb-3`}>
            {category.icon}
          </div>
          <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {category.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {category.description}
          </p>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {category.shortDesc}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-muted-foreground">
              <Users className="w-3 h-3 mr-1" />
              {category.services.length} Services
            </div>
            <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
              Learn More
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};