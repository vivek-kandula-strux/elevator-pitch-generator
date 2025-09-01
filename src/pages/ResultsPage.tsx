import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { GenerationResultsWithSuspense } from '@/components/lazy/LazyComponents';
import { useElevatorPitchByToken } from '@/hooks/useOptimizedQueries';
import { useToast } from '@/hooks/use-toast';

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

interface GenerationData extends FormData {
  generatedPitch: string;
  recordId: string;
}

const ResultsPage = () => {
  const { recordId } = useParams<{ recordId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get access token from URL params
  const urlParams = new URLSearchParams(location.search);
  const accessToken = urlParams.get('token');
  
  const [formData, setFormData] = useState<FormData | null>(null);
  const [generationData, setGenerationData] = useState<GenerationData | null>(null);

  // Use optimized query with caching
  const { data: pitchData, isLoading, error } = useElevatorPitchByToken(
    recordId || '', 
    accessToken || ''
  );

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Check if data was passed via navigation state
    if (location.state?.generationData && location.state?.formData) {
      setGenerationData(location.state.generationData);
      setFormData(location.state.formData);
    } else if (pitchData) {
      // Use data from optimized query (type assertion for JSON response)
      const pitchDataTyped = pitchData as any;
      const formData = {
        name: pitchDataTyped.name,
        whatsapp: pitchDataTyped.whatsapp,
        company: pitchDataTyped.company,
        category: pitchDataTyped.category,
        usp: pitchDataTyped.usp,
        specificAsk: pitchDataTyped.specific_ask
      };

      const generationData = {
        ...formData,
        generatedPitch: pitchDataTyped.generated_pitch,
        recordId: pitchDataTyped.id
      };

      setFormData(formData);
      setGenerationData(generationData);
    } else if (!recordId) {
      // No recordId, redirect to form
      navigate('/');
    }
  }, [recordId, location.state, navigate, pitchData]);

  useEffect(() => {
    // Handle query errors
    if (error) {
      console.error('Error fetching pitch data:', error);
      toast({
        variant: "destructive",
        title: "Data Not Found",
        description: "Unable to load the elevator pitch. The link may be invalid or expired.",
      });
      navigate('/');
    }
  }, [error, navigate, toast]);

  const handleStartOver = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none"></div>
        <div className="container mx-auto relative z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your elevator pitch...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!generationData || !formData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle py-12 relative overflow-hidden">
      {/* Background Enhancement */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
      
      <div className="container mx-auto relative z-10">
        <GenerationResultsWithSuspense 
          formData={formData}
          generationData={generationData}
          onStartOver={handleStartOver}
        />
        
        {/* Mobile Marketing Slider */}
        <Suspense fallback={<div className="h-32" />}>
          <LazyMobileSlider />
        </Suspense>
      </div>
    </div>
  );
};

export default ResultsPage;