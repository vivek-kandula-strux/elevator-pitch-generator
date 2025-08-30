import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessForm from '@/components/BusinessForm';
import Header from '@/components/Header';
import { MobileSlider } from '@/components/MobileSlider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useGTMTracking } from '@/hooks/useGTMTracking';

interface FormData {
  name: string;
  whatsapp: string;
  company: string;
  category: string;
  usp: string;
  specificAsk: string;
}

const FormPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackPitchGeneration } = useGTMTracking();

  const handleFormSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      const { data: result, error } = await supabase.functions.invoke('generate-elevator-pitch', {
        body: { formData: data }
      });

      if (error) {
        throw error;
      }

      // Track successful pitch generation
      trackPitchGeneration(data.company, data.category, result.recordId);

      // Navigate to results page with the record ID and access token
      navigate(`/results/${result.recordId}?token=${result.accessToken}`, {
        state: {
          formData: data,
          generationData: {
            ...data,
            generatedPitch: result.generatedPitch,
            recordId: result.recordId
          }
        }
      });
    } catch (error) {
      console.error('Error generating pitch:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Unable to generate your elevator pitch. Please try again.",
      });
    } finally {
      setIsLoading(false);
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
            isLoading={isLoading}
          />
          
          {/* Mobile Marketing Slider */}
          <MobileSlider />
        </div>
      </div>
    </div>
  );
};

export default FormPage;