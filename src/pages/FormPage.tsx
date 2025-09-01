import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessForm from '@/components/BusinessForm';
import Header from '@/components/Header';
import { FormSkeleton } from '@/components/loading/PageSkeleton';
import { useToast } from '@/hooks/use-toast';
import { useGTMTracking } from '@/hooks/useGTMTracking';
import { useAsyncElevatorPitch } from '@/hooks/useAsyncElevatorPitch';

// Lazy load MobileSlider since it contains animations
const LazyMobileSlider = React.lazy(() => 
  import('@/components/MobileSlider').then(module => ({ default: module.MobileSlider }))
);
interface FormData {
  name: string;
  whatsapp: string;
  company: string;
  category: string;
  usp: string;
  specificAsk: string;
}

const FormPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackPitchGeneration } = useGTMTracking();
  
  // Use async pitch generation with polling
  const { submitForm, loading, status, recordId, accessToken } = useAsyncElevatorPitch();

  const handleFormSubmit = async (data: FormData) => {
    try {
      await submitForm(data);
      
      // Track pitch generation start
      trackPitchGeneration(data.company, data.category, recordId || 'pending');

      // Navigate to results page immediately with processing state
      if (recordId && accessToken) {
        navigate(`/results/${recordId}?token=${accessToken}`, {
          state: {
            formData: data,
            status: 'processing'
          }
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Error handling is done in the hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle relative overflow-hidden">
      <Header />
      <div className="py-12 pt-24">
      {/* Background Enhancement */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
      
        <div className="container mx-auto relative z-10">
          <BusinessForm 
            onSubmit={handleFormSubmit}
            isLoading={loading}
          />
          
          {/* Mobile Marketing Slider */}
          <Suspense fallback={<div className="h-32" />}>
            <LazyMobileSlider />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default FormPage;