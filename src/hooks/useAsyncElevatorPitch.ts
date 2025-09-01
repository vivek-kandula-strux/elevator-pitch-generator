import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AsyncPitchState {
  loading: boolean;
  status: 'idle' | 'processing' | 'completed' | 'failed';
  pitch?: any;
  recordId?: string;
  accessToken?: string;
  error?: string;
}

export const useAsyncElevatorPitch = () => {
  const { toast } = useToast();
  const [state, setState] = useState<AsyncPitchState>({
    loading: false,
    status: 'idle'
  });

  const submitForm = useCallback(async (formData: any) => {
    setState(prev => ({ ...prev, loading: true, status: 'processing' }));

    try {
      const { data, error } = await supabase.functions.invoke('generate-elevator-pitch', {
        body: { formData }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setState(prev => ({
        ...prev,
        recordId: data.recordId,
        accessToken: data.accessToken,
        status: 'processing'
      }));

      // Trigger job processor immediately
      try {
        await fetch('https://sgggqrcwfcbtyianduyo.supabase.co/functions/v1/trigger-job-processor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.log('Job processor trigger failed:', error);
      }

      // Start polling for completion
      pollForCompletion(data.recordId, data.accessToken);

      toast({
        title: "Processing Started",
        description: "Your elevator pitch is being generated. This usually takes 10-30 seconds.",
      });

    } catch (error: any) {
      console.error('Submit error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        status: 'failed',
        error: error.message || 'Failed to submit form'
      }));

      toast({
        title: "Submission Failed",
        description: error.message || 'Failed to submit form. Please try again.',
        variant: "destructive",
      });
    }
  }, [toast]);

  const pollForCompletion = useCallback(async (recordId: string, accessToken: string) => {
    const maxAttempts = 60; // 5 minutes max (5-second intervals)
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setState(prev => ({
          ...prev,
          loading: false,
          status: 'failed',
          error: 'Generation timed out. Please try again.'
        }));
        toast({
          title: "Generation Timeout",
          description: "Pitch generation took too long. Please try again.",
          variant: "destructive",
        });
        return;
      }

      attempts++;

      try {
        const { data, error } = await supabase.functions.invoke('check-pitch-status', {
          body: { recordId, accessToken }
        });

        if (error) {
          throw error;
        }

        if (data.error) {
          throw new Error(data.error);
        }

        if (data.status === 'completed' && data.generatedPitch) {
          setState(prev => ({
            ...prev,
            loading: false,
            status: 'completed',
            pitch: {
              ...data.pitch,
              generatedPitch: data.generatedPitch
            }
          }));

          toast({
            title: "Pitch Generated!",
            description: "Your elevator pitch has been successfully created.",
          });
          return;
        }

        if (data.status === 'failed') {
          throw new Error(data.errorMessage || 'Generation failed');
        }

        // Continue polling
        setTimeout(poll, 5000);

      } catch (error: any) {
        console.error('Polling error:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          status: 'failed',
          error: error.message || 'Failed to check status'
        }));

        toast({
          title: "Status Check Failed",
          description: error.message || 'Failed to check generation status.',
          variant: "destructive",
        });
      }
    };

    // Start polling after initial delay
    setTimeout(poll, 2000);
  }, [toast]);

  const reset = useCallback(() => {
    setState({
      loading: false,
      status: 'idle'
    });
  }, []);

  return {
    ...state,
    submitForm,
    reset
  };
};