import { useState, Suspense } from 'react';
import Header from '../components/Header';
import { ServiceCategory } from '../types/services';
import { 
  LazyEnhancedHeroSection,
  LazyClientLogoSlider,
  LazyModernServicesSection,
  LazyFinalCTASection,
  ServiceCategoryModalWithSuspense,
  RequirementFormWithSuspense
} from '../components/lazy/LazyFramerMotion';
import { 
  HeroSkeleton, 
  ServicesSectionSkeleton, 
  CTASkeleton 
} from '../components/loading/SectionSkeleton';

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
        <Suspense fallback={<HeroSkeleton />}>
          <LazyEnhancedHeroSection
            onGetStartedClick={() => setIsFormOpen(true)}
          />
        </Suspense>
        
        {/* Subtle section divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        
        {/* Client Logo Slider - Trust indicators */}
        <Suspense fallback={<ServicesSectionSkeleton />}>
          <LazyClientLogoSlider />
        </Suspense>
        
        {/* Section divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        
        {/* Modern Services Section - Progressive disclosure */}
        <Suspense fallback={<ServicesSectionSkeleton />}>
          <LazyModernServicesSection
            onGetStartedClick={() => setIsFormOpen(true)}
          />
        </Suspense>
        
        {/* Section divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        
        {/* Final CTA Section - Conversion focus */}
        <Suspense fallback={<CTASkeleton />}>
          <LazyFinalCTASection onGetStartedClick={() => setIsFormOpen(true)} />
        </Suspense>
      </main>

      {/* Modals */}
      <ServiceCategoryModalWithSuspense
        category={selectedCategory}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onRequirementClick={handleRequirementClick}
      />
      
      <RequirementFormWithSuspense
        isOpen={isFormOpen}
        onClose={handleFormClose}
        preSelectedService={selectedCategory?.id}
      />
    </div>
  );
};

export default ServicesPage;