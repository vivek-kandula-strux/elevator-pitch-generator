import React, { useState, useEffect } from 'react';
import { BusinessFormWithSuspense, GenerationResultsWithSuspense } from '@/components/lazy/OptimizedLazyComponents';
import { CriticalSection } from '@/components/performance/CriticalLoader';
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

interface GenerationData extends FormData {
  generatedPitch: string;
  recordId: string;
}

type AppState = 'form' | 'results';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('form');
  const [formData, setFormData] = useState<FormData | null>(null);
  const [generationData, setGenerationData] = useState<GenerationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Automatically scroll to top when transitioning to results page
  useEffect(() => {
    if (currentState === 'results') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentState]);

  const handleFormSubmit = async (data: FormData) => {
    setIsLoading(true);
    setFormData(data);
    
    try {
      const { data: result, error } = await supabase.functions.invoke('generate-elevator-pitch', {
        body: { formData: data }
      });

      if (error) {
        throw error;
      }

      setGenerationData({
        ...data,
        generatedPitch: result.generatedPitch,
        recordId: result.recordId
      });
      setCurrentState('results');
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

  const handleStartOver = () => {
    setCurrentState('form');
    setFormData(null);
    setGenerationData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-12 relative overflow-hidden">
      {/* Background Enhancement */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
      
      <div className="container mx-auto relative z-10">
        {currentState === 'form' && (
          <CriticalSection>
            <BusinessFormWithSuspense 
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
            />
          </CriticalSection>
        )}
        
        {currentState === 'results' && generationData && (
          <CriticalSection>
            <GenerationResultsWithSuspense
              formData={formData}
              generationData={generationData}
              onStartOver={handleStartOver}
            />
          </CriticalSection>
        )}
      </div>
    </div>
  );
};

export default Index;
