import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import GenerationResults from '@/components/GenerationResults';
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

const ResultsPage = () => {
  const { recordId } = useParams<{ recordId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData | null>(null);
  const [generationData, setGenerationData] = useState<GenerationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Check if data was passed via navigation state
    if (location.state?.generationData && location.state?.formData) {
      setGenerationData(location.state.generationData);
      setFormData(location.state.formData);
    } else if (recordId) {
      // Fetch data from database using recordId
      fetchDataFromDatabase(recordId);
    } else {
      // No recordId, redirect to form
      navigate('/');
    }
  }, [recordId, location.state, navigate]);

  const fetchDataFromDatabase = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('elevator_pitches')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const formData = {
          name: data.name,
          whatsapp: data.whatsapp,
          company: data.company,
          category: data.category,
          usp: data.usp,
          specificAsk: data.specific_ask
        };

        const generationData = {
          ...formData,
          generatedPitch: data.generated_pitch,
          recordId: data.id
        };

        setFormData(formData);
        setGenerationData(generationData);
      } else {
        throw new Error('No data found');
      }
    } catch (error) {
      console.error('Error fetching pitch data:', error);
      toast({
        variant: "destructive",
        title: "Data Not Found",
        description: "Unable to load the elevator pitch. The link may be invalid or expired.",
      });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

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
        <GenerationResults 
          formData={formData}
          generationData={generationData}
          onStartOver={handleStartOver}
        />
      </div>
    </div>
  );
};

export default ResultsPage;