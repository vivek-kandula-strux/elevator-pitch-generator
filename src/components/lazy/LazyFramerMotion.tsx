import { Suspense, lazy } from 'react';
import { SkeletonLoader, SkeletonCard } from '../loading/SkeletonLoader';

// Lazy load heavy Framer Motion components
export const LazyRequirementForm = lazy(() =>
  import('../RequirementForm').then(module => ({ default: module.RequirementForm }))
);

export const LazyServiceCategoryModal = lazy(() =>
  import('../ServiceCategoryModal').then(module => ({ default: module.ServiceCategoryModal }))
);

export const LazyServiceModal = lazy(() =>
  import('../ServiceModal').then(module => ({ default: module.ServiceModal }))
);

export const LazyServicePillarAccordion = lazy(() =>
  import('../ServicePillarAccordion').then(module => ({ default: module.ServicePillarAccordion }))
);

// Enhanced section components
export const LazyEnhancedHeroSection = lazy(() =>
  import('../sections/EnhancedHeroSection').then(module => ({ default: module.EnhancedHeroSection }))
);

export const LazyClientLogoSlider = lazy(() =>
  import('../sections/ClientLogoSlider').then(module => ({ default: module.ClientLogoSlider }))
);

export const LazyModernServicesSection = lazy(() =>
  import('../sections/ModernServicesSection').then(module => ({ default: module.ModernServicesSection }))
);

export const LazyEnhancedServicesSection = lazy(() =>
  import('../sections/EnhancedServicesSection').then(module => ({ default: module.EnhancedServicesSection }))
);

export const LazyValuePropositionSection = lazy(() =>
  import('../sections/ValuePropositionSection').then(module => ({ default: module.ValuePropositionSection }))
);

export const LazyTeamSection = lazy(() =>
  import('../sections/TeamSection').then(module => ({ default: module.TeamSection }))
);

export const LazySocialProofSection = lazy(() =>
  import('../sections/SocialProofSection').then(module => ({ default: module.SocialProofSection }))
);

export const LazyFAQSection = lazy(() =>
  import('../sections/FAQSection').then(module => ({ default: module.FAQSection }))
);

export const LazyFinalCTASection = lazy(() =>
  import('../sections/FinalCTASection').then(module => ({ default: module.FinalCTASection }))
);

export const LazyBenefitsSection = lazy(() =>
  import('../sections/BenefitsSection').then(module => ({ default: module.BenefitsSection }))
);

export const LazyPricingSection = lazy(() =>
  import('../sections/PricingSection').then(module => ({ default: module.PricingSection }))
);

// Wrapper components with suspense and proper skeletons
export const RequirementFormWithSuspense = (props: any) => (
  <Suspense fallback={
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="space-y-4">
          <SkeletonLoader className="h-6 w-1/3" />
          <SkeletonLoader className="h-4 w-2/3" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <SkeletonLoader className="h-4 w-1/4" />
              <SkeletonLoader className="h-10 w-full" />
            </div>
          ))}
          <SkeletonLoader className="h-10 w-full" />
        </div>
      </div>
    </div>
  }>
    <LazyRequirementForm {...props} />
  </Suspense>
);

export const ServiceCategoryModalWithSuspense = (props: any) => (
  <Suspense fallback={
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-muted p-6 rounded-t-2xl">
          <SkeletonLoader className="h-8 w-1/3" />
          <SkeletonLoader className="h-4 w-2/3 mt-2" />
        </div>
        <div className="p-6 space-y-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonLoader className="h-10 w-32 mx-auto" />
        </div>
      </div>
    </div>
  }>
    <LazyServiceCategoryModal {...props} />
  </Suspense>
);

export const ServiceModalWithSuspense = (props: any) => (
  <Suspense fallback={
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full p-6">
        <SkeletonCard />
      </div>
    </div>
  }>
    <LazyServiceModal {...props} />
  </Suspense>
);