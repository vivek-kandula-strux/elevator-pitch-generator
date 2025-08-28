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

    // Generate elevator pitch using OpenAI with proprietary BNI prompt
    const prompt = `Act as a CEO of a Business. Create a 30 Second Elevator pitch which ends with a specific ask.

Context -
Name: ${formData.name}
Company: ${formData.company}
Business Category: ${formData.category}
Unique Selling Point: ${formData.usp}
Specific Ask: ${formData.specificAsk}

Intent: This 30 second goes into a BNI community where other business owners will try to connect us to the Specific Ask audiences in their contact spheres. The intent is not to pitch the room, but the contact sphere/ network of the room.

Example 30-Second Elevator pitch: 
'Good morning everyone! My name is Kartik Vijayvargi and I own Perfect Vaastu Consultancy. We specialize in Vaastu, a traditional Indian practice of architecture and design. Our unique selling point is that we provide practical solutions to our clients. We have successfully completed several projects in the past. I am here today to ask if you can connect us to any new projects in your contact sphere. Thank you for your time and I look forward to hearing from you.'

Instructions:
Tone: Confident + Proud
Style: Informative + Specific + Approachable + Engaging
Voice: Professional + Industry-specific

Return only the elevator pitch text, no additional formatting or explanations.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are an expert business coach specializing in creating compelling elevator pitches. Your pitches are always exactly 30 seconds when spoken naturally.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedPitch = data.choices[0].message.content.trim();

    // Update the database record with the generated pitch
    const { error: updateError } = await supabase
      .from('elevator_pitches')
      .update({ generated_pitch: generatedPitch })
      .eq('id', insertedData.id);

    if (updateError) {
      console.error('Error updating pitch:', updateError);
    }

    console.log('Successfully generated pitch for:', formData.company);

    return new Response(JSON.stringify({ 
      generatedPitch,
      recordId: insertedData.id 
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