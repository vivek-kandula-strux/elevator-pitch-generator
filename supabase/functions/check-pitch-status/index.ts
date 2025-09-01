import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recordId, accessToken } = await req.json();
    console.log('Checking pitch status for record:', recordId);

    if (!recordId || !accessToken) {
      throw new Error('Missing recordId or accessToken');
    }

    // Get the elevator pitch record
    const { data: pitch, error: pitchError } = await supabase
      .from('elevator_pitches')
      .select('*')
      .eq('id', recordId)
      .eq('access_token', accessToken)
      .single();

    if (pitchError || !pitch) {
      console.error('Pitch not found:', pitchError);
      throw new Error('Pitch not found or invalid access token');
    }

    // Check if pitch is generated
    if (pitch.generated_pitch) {
      return new Response(JSON.stringify({
        status: 'completed',
        generatedPitch: pitch.generated_pitch,
        pitch: {
          id: pitch.id,
          name: pitch.name,
          company: pitch.company,
          category: pitch.category,
          usp: pitch.usp,
          specific_ask: pitch.specific_ask,
          created_at: pitch.created_at
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check job queue status
    const { data: jobs, error: jobError } = await supabase
      .from('job_queue')
      .select('*')
      .eq('job_type', 'generate_pitch')
      .contains('payload', { recordId })
      .order('created_at', { ascending: false })
      .limit(1);

    if (jobError) {
      console.error('Error checking job status:', jobError);
    }

    const job = jobs?.[0];
    let jobStatus = 'pending';
    let errorMessage = null;

    if (job) {
      jobStatus = job.status;
      errorMessage = job.error_message;
    }

    return new Response(JSON.stringify({
      status: jobStatus,
      generatedPitch: null,
      pitch: {
        id: pitch.id,
        name: pitch.name,
        company: pitch.company,
        category: pitch.category,
        usp: pitch.usp,
        specific_ask: pitch.specific_ask,
        created_at: pitch.created_at
      },
      jobStatus,
      errorMessage
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error checking pitch status:', error);
    return new Response(JSON.stringify({
      error: error.message || 'An unexpected error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});