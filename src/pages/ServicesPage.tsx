import { useState } from 'react';
import { ServiceCategoryModal } from '../components/ServiceCategoryModal';
import { RequirementForm } from '../components/RequirementForm';
import Header from '../components/Header';
import { serviceCategories } from '../data/serviceCategories';
import { ServiceCategory } from '../types/services';

// Import optimized section components
import { EnhancedHeroSection } from '../components/sections/EnhancedHeroSection';
import { ClientLogoSlider } from '../components/sections/ClientLogoSlider';
import { ModernServicesSection } from '../components/sections/ModernServicesSection';
import { FinalCTASection } from '../components/sections/FinalCTASection';

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  

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


  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Main Content with optimized spacing and rhythm */}
      <main className="pt-16">
        {/* Enhanced Hero Section - Mobile-first with better proportions */}
        <EnhancedHeroSection
          onGetStartedClick={() => setIsFormOpen(true)}
        />
        
        {/* Subtle section divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        
        {/* Client Logo Slider - Trust indicators */}
        <ClientLogoSlider />
        
        {/* Section divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        
        {/* Modern Services Section - Progressive disclosure */}
        <ModernServicesSection
          onGetStartedClick={() => setIsFormOpen(true)}
        />
        
        {/* Section divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        
        {/* Final CTA Section - Conversion focus */}
        <FinalCTASection onGetStartedClick={() => setIsFormOpen(true)} />
      </main>

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