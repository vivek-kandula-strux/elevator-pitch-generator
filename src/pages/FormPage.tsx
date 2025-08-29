import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessForm from '@/components/BusinessForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  const handleFormSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      const { data: result, error } = await supabase.functions.invoke('generate-elevator-pitch', {
        body: { formData: data }
      });

      if (error) {
        throw error;
      }

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
    <div className="min-h-screen bg-gradient-subtle py-12 relative overflow-hidden">
      {/* Background Enhancement */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
      
      <div className="container mx-auto relative z-10">
        <BusinessForm 
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default FormPage;