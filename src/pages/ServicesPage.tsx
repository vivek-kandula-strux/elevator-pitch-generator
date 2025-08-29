import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { ServiceCategoryCard } from '../components/ServiceCategoryCard';
import { ServiceCategoryModal } from '../components/ServiceCategoryModal';
import { RequirementForm } from '../components/RequirementForm';
import { HeroSection } from '../components/HeroSection';
import { TrendsSection } from '../components/TrendsSection';
import { TeamSection } from '../components/TeamSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { PricingSection } from '../components/PricingSection';
import { FAQSection } from '../components/FAQSection';
import Header from '../components/Header';
import { serviceCategories } from '../data/serviceCategories';
import { ServiceCategory } from '../types/services';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCategorySelect = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCategory(null), 300);
  };

  const handleRequirementClick = () => {
    setIsModalOpen(false);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const filteredCategories = serviceCategories.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.services.some(service => 
      service.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <HeroSection onGetStarted={() => setIsFormOpen(true)} />

      {/* Trends Section */}
      <TrendsSection />

      {/* Service Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Solutions We Provide
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Comprehensive digital marketing services across 14 specialized categories. 
              Each solution is backed by proven methodologies and measurable results.
            </p>
            
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="max-w-md mx-auto relative"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50"
              />
            </motion.div>
          </motion.div>

          {searchTerm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <p className="text-muted-foreground text-center">
                Showing {filteredCategories.length} of {serviceCategories.length} service categories
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredCategories.map((category, index) => (
              <ServiceCategoryCard
                key={category.id}
                category={category}
                onSelect={handleCategorySelect}
                index={index}
              />
            ))}
          </motion.div>
          
          {filteredCategories.length === 0 && searchTerm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground text-lg">
                No services found matching "{searchTerm}"
              </p>
              <Button
                variant="outline"
                onClick={() => setSearchTerm('')}
                className="mt-4"
              >
                Clear Search
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Team Section */}
      <TeamSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <PricingSection onGetStarted={() => setIsFormOpen(true)} />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 border border-primary/20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Transform Your Digital Presence?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join 500+ businesses that have accelerated their growth with our proven strategies. 
              Let's discuss how we can drive measurable results for your unique goals.
            </p>
            <Button
              onClick={() => setIsFormOpen(true)}
              size="lg"
              className="bg-gradient-primary text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl hover:shadow-primary/25 transition-all duration-300"
            >
              Start Your Growth Journey
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Modals */}
      <ServiceCategoryModal
        category={selectedCategory}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onRequirementClick={handleRequirementClick}
      />
      
      <RequirementForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        preSelectedService={selectedCategory?.id}
      />
    </div>
  );
};

export default ServicesPage;