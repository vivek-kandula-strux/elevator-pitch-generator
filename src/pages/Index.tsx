import React, { useState } from 'react';
import BusinessForm from '@/components/BusinessForm';
import GenerationProgress from '@/components/GenerationProgress';
import GenerationResults from '@/components/GenerationResults';

interface FormData {
  name: string;
  whatsapp: string;
  company: string;
  category: string;
  usp: string;
  specificAsk: string;
}

type AppState = 'form' | 'generating' | 'results';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('form');
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setCurrentState('generating');
  };

  const handleGenerationComplete = () => {
    setCurrentState('results');
  };

  const handleStartOver = () => {
    setCurrentState('form');
    setFormData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-8 px-4">
      <div className="container mx-auto">
        {currentState === 'form' && (
          <BusinessForm 
            onSubmit={handleFormSubmit}
            isLoading={false}
          />
        )}
        
        {currentState === 'generating' && (
          <GenerationProgress 
            onComplete={handleGenerationComplete}
          />
        )}
        
        {currentState === 'results' && formData && (
          <GenerationResults 
            formData={formData}
            onStartOver={handleStartOver}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
