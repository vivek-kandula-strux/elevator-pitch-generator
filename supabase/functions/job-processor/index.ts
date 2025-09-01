import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface Job {
  id: string;
  job_type: string;
  payload: any;
  status: string;
  retry_count: number;
  max_retries: number;
  priority: number;
}

// Circuit breaker states
const circuitBreakers = new Map<string, {
  state: 'closed' | 'open' | 'half_open';
  failureCount: number;
  lastFailureTime: number;
  failureThreshold: number;
  recoveryTimeout: number;
}>();

// Rate limiting
const rateLimits = new Map<string, {
  count: number;
  windowStart: number;
  limit: number;
  windowMs: number;
}>();

function checkCircuitBreaker(service: string): boolean {
  const breaker = circuitBreakers.get(service);
  if (!breaker) {
    circuitBreakers.set(service, {
      state: 'closed',
      failureCount: 0,
      lastFailureTime: 0,
      failureThreshold: 5,
      recoveryTimeout: 5 * 60 * 1000 // 5 minutes
    });
    return true;
  }

  const now = Date.now();
  
  if (breaker.state === 'open') {
    if (now - breaker.lastFailureTime > breaker.recoveryTimeout) {
      breaker.state = 'half_open';
      return true;
    }
    return false;
  }
  
  return true;
}

function recordSuccess(service: string): void {
  const breaker = circuitBreakers.get(service);
  if (breaker) {
    breaker.failureCount = 0;
    breaker.state = 'closed';
  }
}

function recordFailure(service: string): void {
  const breaker = circuitBreakers.get(service);
  if (breaker) {
    breaker.failureCount++;
    breaker.lastFailureTime = Date.now();
    
    if (breaker.failureCount >= breaker.failureThreshold) {
      breaker.state = 'open';
    }
  }
}

function checkRateLimit(service: string, limit: number = 60, windowMs: number = 60000): boolean {
  const now = Date.now();
  const rateLimit = rateLimits.get(service);
  
  if (!rateLimit || now - rateLimit.windowStart > windowMs) {
    rateLimits.set(service, {
      count: 1,
      windowStart: now,
      limit,
      windowMs
    });
    return true;
  }
  
  if (rateLimit.count >= limit) {
    return false;
  }
  
  rateLimit.count++;
  return true;
}

async function processElevatorPitchJob(payload: any): Promise<void> {
  console.log('Processing elevator pitch job:', payload);
  
  if (!checkCircuitBreaker('openai')) {
    throw new Error('OpenAI circuit breaker is open');
  }
  
  if (!checkRateLimit('openai', 50, 60000)) {
    throw new Error('OpenAI rate limit exceeded');
  }

  const prompt = `Act as a CEO of a Business. Create a 30 Second Elevator pitch which ends with a specific ask.

Context -
Name: ${payload.formData.name}
Company: ${payload.formData.company}
Business Category: ${payload.formData.category}
Unique Selling Point: ${payload.formData.usp}
Specific Ask: ${payload.formData.specificAsk}

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
    recordFailure('openai');
    const errorData = await response.json();
    console.error('OpenAI API error:', errorData);
    throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  recordSuccess('openai');
  const data = await response.json();
  const generatedPitch = data.choices[0].message.content.trim();

  // Update the database record with the generated pitch
  const { error: updateError } = await supabase
    .from('elevator_pitches')
    .update({ generated_pitch: generatedPitch })
    .eq('id', payload.recordId);

  if (updateError) {
    console.error('Error updating pitch:', updateError);
    throw updateError;
  }

  // Queue background sync job with lower priority
  await supabase
    .from('job_queue')
    .insert({
      job_type: 'sync_sheets',
      payload: { trigger: 'pitch_generated', recordId: payload.recordId },
      priority: 8 // Lower priority
    });

  console.log('Successfully processed elevator pitch job');
}

async function processSyncSheetsJob(payload: any): Promise<void> {
  console.log('Processing sync sheets job:', payload);
  
  if (!checkCircuitBreaker('google_sheets')) {
    throw new Error('Google Sheets circuit breaker is open');
  }
  
  if (!checkRateLimit('google_sheets', 30, 60000)) {
    throw new Error('Google Sheets rate limit exceeded');
  }

  try {
    const { error } = await supabase.functions.invoke('sync-to-google-sheets');
    
    if (error) {
      recordFailure('google_sheets');
      throw error;
    }
    
    recordSuccess('google_sheets');
    console.log('Successfully processed sync sheets job');
  } catch (error) {
    recordFailure('google_sheets');
    throw error;
  }
}

async function processJob(job: Job): Promise<void> {
  const startTime = Date.now();
  
  try {
    // Mark job as processing
    await supabase
      .from('job_queue')
      .update({
        status: 'processing',
        started_at: new Date().toISOString()
      })
      .eq('id', job.id);

    // Process based on job type
    switch (job.job_type) {
      case 'generate_pitch':
        await processElevatorPitchJob(job.payload);
        break;
      case 'sync_sheets':
        await processSyncSheetsJob(job.payload);
        break;
      default:
        throw new Error(`Unknown job type: ${job.job_type}`);
    }

    // Mark job as completed
    await supabase
      .from('job_queue')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', job.id);

    // Record performance metrics
    const duration = Date.now() - startTime;
    await supabase
      .from('performance_metrics')
      .insert({
        metric_type: 'job_duration',
        service_name: job.job_type,
        value: duration,
        metadata: { job_id: job.id, priority: job.priority }
      });

  } catch (error) {
    console.error(`Job ${job.id} failed:`, error);
    
    const newRetryCount = job.retry_count + 1;
    const shouldRetry = newRetryCount < job.max_retries;
    
    if (shouldRetry) {
      // Schedule retry with exponential backoff
      const retryDelay = Math.min(1000 * Math.pow(2, newRetryCount), 300000); // Max 5 minutes
      const scheduledAt = new Date(Date.now() + retryDelay);
      
      await supabase
        .from('job_queue')
        .update({
          status: 'retrying',
          retry_count: newRetryCount,
          scheduled_at: scheduledAt.toISOString(),
          error_message: error.message
        })
        .eq('id', job.id);
    } else {
      // Mark as failed
      await supabase
        .from('job_queue')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: error.message
        })
        .eq('id', job.id);
    }
    
    // Record error metrics
    await supabase
      .from('performance_metrics')
      .insert({
        metric_type: 'job_error',
        service_name: job.job_type,
        value: 1,
        metadata: { 
          job_id: job.id, 
          error: error.message,
          retry_count: newRetryCount,
          will_retry: shouldRetry
        }
      });
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Job processor started');
    
    // Get pending jobs ordered by priority and schedule time
    const { data: jobs, error } = await supabase
      .from('job_queue')
      .select('*')
      .in('status', ['pending', 'retrying'])
      .lte('scheduled_at', new Date().toISOString())
      .order('priority', { ascending: true })
      .order('scheduled_at', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }

    console.log(`Found ${jobs?.length || 0} jobs to process`);

    if (jobs && jobs.length > 0) {
      // Process jobs concurrently with a limit
      const maxConcurrent = 3;
      const chunks = [];
      
      for (let i = 0; i < jobs.length; i += maxConcurrent) {
        chunks.push(jobs.slice(i, i + maxConcurrent));
      }

      for (const chunk of chunks) {
        const promises = chunk.map(job => processJob(job));
        await Promise.allSettled(promises);
      }
    }

    // Record queue size metric
    const { count } = await supabase
      .from('job_queue')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'retrying']);

    await supabase
      .from('performance_metrics')
      .insert({
        metric_type: 'queue_size',
        service_name: 'job_processor',
        value: count || 0
      });

    return new Response(JSON.stringify({ 
      success: true, 
      processedJobs: jobs?.length || 0,
      queueSize: count || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Job processor error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Job processor failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});