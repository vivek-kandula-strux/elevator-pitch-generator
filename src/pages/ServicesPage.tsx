import { useState } from 'react';
import { ServiceCategoryModal } from '../components/ServiceCategoryModal';
import { RequirementForm } from '../components/RequirementForm';
import Header from '../components/Header';
import { serviceCategories } from '../data/serviceCategories';
import { ServiceCategory } from '../types/services';

// Import optimized section components
import { EnhancedHeroSection } from '../components/sections/EnhancedHeroSection';
import { ClientLogoSlider } from '../components/sections/ClientLogoSlider';
import { EnhancedServicesSection } from '../components/sections/EnhancedServicesSection';
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
      
      {/* Main Content with optimized spacing */}
      <main className="pt-16">
        {/* Enhanced Hero Section - Reduced height for mobile-first design */}
        <EnhancedHeroSection
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onGetStartedClick={() => setIsFormOpen(true)}
        />
        
        {/* Client Logo Slider - Modern trust indicators */}
        <ClientLogoSlider />
        
        {/* Enhanced Services Section - Core service offerings */}
        <EnhancedServicesSection
          filteredCategories={filteredCategories}
          onCategorySelect={handleCategorySelect}
          searchTerm={searchTerm}
          totalCategories={serviceCategories.length}
        />
        
        {/* Final CTA Section - Single conversion point */}
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