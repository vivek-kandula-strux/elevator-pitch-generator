import { useState } from 'react';
import { ServiceCategoryModal } from '../components/ServiceCategoryModal';
import { RequirementForm } from '../components/RequirementForm';
import Header from '../components/Header';
import { serviceCategories } from '../data/serviceCategories';
import { ServiceCategory } from '../types/services';

// Import new section components
import { EnhancedHeroSection } from '../components/sections/EnhancedHeroSection';
import { BenefitsSection } from '../components/sections/BenefitsSection';
import { ValuePropositionSection } from '../components/sections/ValuePropositionSection';
import { EnhancedServicesSection } from '../components/sections/EnhancedServicesSection';
import { PricingSection } from '../components/sections/PricingSection';
import { TeamSection } from '../components/sections/TeamSection';
import { FAQSection } from '../components/sections/FAQSection';
import { FinalCTASection } from '../components/sections/FinalCTASection';

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
      
      {/* Enhanced Hero Section */}
      <EnhancedHeroSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onGetStartedClick={() => setIsFormOpen(true)}
      />
      
      {/* Benefits Section */}
      <BenefitsSection />
      
      {/* Value Proposition Section */}
      <ValuePropositionSection />
      
      {/* Enhanced Services Section */}
      <EnhancedServicesSection
        filteredCategories={filteredCategories}
        onCategorySelect={handleCategorySelect}
        searchTerm={searchTerm}
        totalCategories={serviceCategories.length}
      />
      
      {/* Pricing Section */}
      <PricingSection />
      
      {/* Team Section */}
      <TeamSection />
      
      {/* FAQ Section */}
      <FAQSection />
      
      {/* Final CTA Section */}
      <FinalCTASection onGetStartedClick={() => setIsFormOpen(true)} />

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