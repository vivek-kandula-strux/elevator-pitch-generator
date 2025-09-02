import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pitchId, accessToken } = await req.json();
    
    if (!pitchId || !accessToken) {
      return new Response(
        JSON.stringify({ error: 'Missing pitchId or accessToken' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch existing pitch data using access token validation
    const { data: existingPitch, error: fetchError } = await supabase
      .from('elevator_pitches')
      .select('*')
      .eq('id', pitchId)
      .eq('access_token', accessToken)
      .single();

    if (fetchError || !existingPitch) {
      console.error('Error fetching pitch:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Pitch not found or access denied' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create variation prompts
    const variationPrompts = [
      `Create a compelling elevator pitch focused on PROBLEM-SOLVING approach. The pitch should emphasize how the company identifies and solves specific problems for their target audience.`,
      `Create a compelling elevator pitch focused on UNIQUE VALUE PROPOSITION. The pitch should highlight what makes this company distinctly different from competitors and why that matters.`,
      `Create a compelling elevator pitch focused on RESULTS AND OUTCOMES. The pitch should emphasize concrete benefits, measurable results, and positive outcomes clients can expect.`
    ];

    const randomVariation = variationPrompts[Math.floor(Math.random() * variationPrompts.length)];

    const prompt = `${randomVariation}

Company Information:
- Company Name: ${existingPitch.company}
- Business Category: ${existingPitch.category}
- Unique Selling Proposition: ${existingPitch.usp}
- Specific Ask/Goal: ${existingPitch.specific_ask}

Requirements:
1. MUST be exactly 30 seconds when spoken (approximately 75-85 words)
2. MUST follow BNI (Business Network International) format
3. MUST include the specific ask at the end
4. Use confident, professional tone
5. Make it memorable and engaging
6. Include a clear call-to-action
7. Create a DIFFERENT variation from previous versions - use fresh language and approach

BNI Format Structure:
- Hook (attention grabber)
- What you do (service/product)
- Target audience 
- Unique value/benefit
- Specific ask

Generate a single, polished elevator pitch that flows naturally when spoken aloud.`;

    // Call OpenAI API
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating pitch variation with OpenAI...');
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert business pitch coach and copywriter specializing in creating compelling elevator pitches for networking events, particularly BNI meetings. You understand how to craft memorable, results-driven pitches that generate referrals and business opportunities.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.8, // Higher temperature for more variation
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate pitch variation' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIData = await openAIResponse.json();
    const generatedPitch = openAIData.choices[0].message.content.trim();

    // Update the pitch in the database
    const { data: updatedPitch, error: updateError } = await supabase
      .from('elevator_pitches')
      .update({ 
        generated_pitch: generatedPitch,
        updated_at: new Date().toISOString()
      })
      .eq('id', pitchId)
      .eq('access_token', accessToken)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating pitch:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to save pitch variation' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Pitch variation generated successfully');
    return new Response(
      JSON.stringify({ 
        success: true,
        generatedPitch,
        pitchId: updatedPitch.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in regenerate-elevator-pitch function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});