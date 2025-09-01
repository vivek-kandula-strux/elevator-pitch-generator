import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formData } = await req.json();
    console.log('Processing elevator pitch request for:', formData.company);

    // Store form data in database first
    const { data: insertedData, error: insertError } = await supabase
      .from('elevator_pitches')
      .insert({
        name: formData.name,
        whatsapp: formData.whatsapp,
        company: formData.company,
        category: formData.category,
        usp: formData.usp,
        specific_ask: formData.specificAsk
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting data:', insertError);
      throw new Error('Failed to store form data');
    }

    // Queue the job for async processing instead of blocking the user
    const { error: queueError } = await supabase
      .from('job_queue')
      .insert({
        job_type: 'generate_pitch',
        payload: { 
          formData,
          recordId: insertedData.id 
        },
        priority: 1, // High priority for user-facing requests
        max_retries: 3
      });

    if (queueError) {
      console.error('Error queuing job:', queueError);
      throw new Error('Failed to queue job for processing');
    } else {
      console.log('Job queued successfully for:', formData.company);
    }

    // Return immediately with the record info - pitch will be generated async
    return new Response(JSON.stringify({ 
      recordId: insertedData.id,
      accessToken: insertedData.access_token,
      status: 'processing',
      message: 'Your elevator pitch is being generated. You will receive it shortly.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-elevator-pitch function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});