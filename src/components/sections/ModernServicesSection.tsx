import { motion } from 'framer-motion';
import { useState } from 'react';
import { ServiceCategory } from '../../types/services';
import { servicePillars, getServicesByPillar, getHeroServices, getPopularServices } from '../../data/servicePillars';
import { ServicePillarSection } from '../ServicePillarSection';
import { ServiceHeroCard } from '../ServiceHeroCard';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Search, Filter, Sparkles, Target, Zap } from 'lucide-react';

interface ModernServicesSectionProps {
  onCategorySelect: (category: ServiceCategory) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const ModernServicesSection = ({
  onCategorySelect,
  searchTerm,
  onSearchChange
}: ModernServicesSectionProps) => {
  const [viewMode, setViewMode] = useState<'pillars' | 'popular' | 'all'>('pillars');
  const popularServices = getPopularServices();

  // Filter services based on search
  const filteredPillars = servicePillars.map(pillar => ({
    ...pillar,
    services: getServicesByPillar(pillar.id).filter(service =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.shortDesc.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(pillar => pillar.services.length > 0);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-subtle" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
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
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Service Excellence</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Expertise That
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Drives Results
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Discover our comprehensive digital marketing solutions organized into strategic service pillars, 
            each designed to deliver measurable outcomes for your business.
          </p>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 h-12 bg-card/50 border-card-border/50 focus:border-primary/50"
              />
            </div>
            
            {/* View Mode Toggles */}
            <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-lg border border-muted-border/50">
              <Button
                variant={viewMode === 'pillars' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('pillars')}
                className="px-4"
              >
                <Target className="w-4 h-4 mr-2" />
                By Category
              </Button>
              <Button
                variant={viewMode === 'popular' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('popular')}
                className="px-4"
              >
                <Zap className="w-4 h-4 mr-2" />
                Most Popular
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Search Results Info */}
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30">
              {filteredPillars.reduce((acc, pillar) => acc + pillar.services.length, 0)} services found
              {searchTerm && ` for "${searchTerm}"`}
            </Badge>
          </motion.div>
        )}

        {/* Popular Services View */}
        {viewMode === 'popular' && !searchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-foreground mb-4">Most Popular Services</h3>
              <p className="text-muted-foreground">Our highest-performing solutions trusted by industry leaders</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {popularServices.map((service, index) => (
                <div key={service.id} className="lg:col-span-1">
                  <ServiceHeroCard
                    category={service}
                    onSelect={onCategorySelect}
                    index={index}
                    badge="Most Popular"
                  />
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                variant="outline"
                onClick={() => setViewMode('pillars')}
                size="lg"
              >
                Explore All Services
              </Button>
            </div>
          </motion.div>
        )}

        {/* Service Pillars View */}
        {(viewMode === 'pillars' || searchTerm) && (
          <div className="space-y-20">
            {filteredPillars.map((pillar, index) => (
              <ServicePillarSection
                key={pillar.id}
                pillar={pillar}
                heroServices={getHeroServices(pillar.id).filter(service =>
                  pillar.services.some(s => s.id === service.id)
                )}
                allServices={pillar.services}
                onServiceSelect={onCategorySelect}
                index={index}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {searchTerm && filteredPillars.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
              onClick={() => onSearchChange('')}
            >
              Clear Search
            </Button>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-24 pt-16 border-t border-border/50"
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to Transform Your Business?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Don't see exactly what you're looking for? Let's discuss a custom solution 
            tailored to your specific needs and objectives.
          </p>
          <Button
            size="lg"
            className="px-8 py-4 text-lg font-semibold bg-gradient-primary hover:shadow-primary/25 transition-all duration-300"
          >
            Schedule Strategy Call
          </Button>
        </motion.div>
      </div>
    </section>
  );
};