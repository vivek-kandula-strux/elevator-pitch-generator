import { motion } from 'framer-motion';
import { ServiceCategoryCard } from '../ServiceCategoryCard';
import { ServiceCategory } from '../../types/services';
import { Filter, Grid, List } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';

interface EnhancedServicesSectionProps {
  filteredCategories: ServiceCategory[];
  onCategorySelect: (category: ServiceCategory) => void;
  searchTerm: string;
  totalCategories: number;
}

export const EnhancedServicesSection = ({
  filteredCategories,
  onCategorySelect,
  searchTerm,
  totalCategories
}: EnhancedServicesSectionProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/5 to-background" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-sm font-medium text-primary">Service Categories</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Expertise That Drives
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Quality Results
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Comprehensive digital marketing solutions across 14 specialized categories, 
            each backed by proven methodologies and measurable outcomes.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4"
        >
          {/* Results Counter */}
          <div className="flex items-center gap-2">
            {searchTerm && (
              <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-sm text-primary font-medium">
                  {filteredCategories.length} of {totalCategories} services
                  {searchTerm && ` matching "${searchTerm}"`}
                </span>
              </div>
            )}
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="px-3 py-2"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="px-3 py-2"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Services Grid */}
        {filteredCategories.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1 lg:grid-cols-2'
            }`}
          >
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className={viewMode === 'list' ? 'transform scale-y-75' : ''}
              >
                <ServiceCategoryCard
                  category={category}
                  onSelect={onCategorySelect}
                  index={index}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/20 flex items-center justify-center">
              <Filter className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              No services found
            </h3>
            <p className="text-muted-foreground text-lg mb-6">
              No services match your search for "{searchTerm}"
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="px-6 py-3"
            >
              Clear Search
            </Button>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16 pt-16 border-t border-border/50"
        >
          <p className="text-lg text-muted-foreground mb-6">
            Don't see exactly what you're looking for?
          </p>
          <Button
            size="lg"
            className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-2xl shadow-lg hover:shadow-primary/25 transition-all duration-300"
          >
            Discuss Custom Solutions
          </Button>
        </motion.div>
      </div>
    </section>
  );
};