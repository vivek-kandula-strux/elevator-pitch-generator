import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting requirements sync to Google Sheets...');
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all requirements data
    const { data: requirements, error: fetchError } = await supabase
      .from('requirements')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching requirements:', fetchError);
      throw fetchError;
    }

    console.log(`Fetched ${requirements?.length || 0} requirements`);

    // Google Sheets API setup
    const googleClientEmail = Deno.env.get('GOOGLE_SHEETS_CLIENT_EMAIL');
    const googlePrivateKey = Deno.env.get('GOOGLE_SHEETS_PRIVATE_KEY')?.replace(/\\n/g, '\n');
    const googleSheetId = Deno.env.get('GOOGLE_SHEET_ID');

    if (!googleClientEmail || !googlePrivateKey || !googleSheetId) {
      throw new Error('Missing Google Sheets configuration');
    }

    // Create JWT for Google Sheets API
    const header = {
      alg: 'RS256',
      typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: googleClientEmail,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    const encoder = new TextEncoder();
    const importedKey = await crypto.subtle.importKey(
      'pkcs8',
      encoder.encode(googlePrivateKey),
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const jwtData = `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(payload))}`;
    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      importedKey,
      encoder.encode(jwtData)
    );

    const jwt = `${jwtData}.${btoa(String.fromCharCode(...new Uint8Array(signature)))}`;

    // Get access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Prepare requirements data for Google Sheets
    const headerRow = ['Name', 'Email', 'Company', 'WhatsApp', 'Service Type', 'Message', 'Created Date'];
    const dataRows = requirements?.map(req => [
      req.name,
      req.email,
      req.company,
      req.whatsapp,
      req.service_type,
      req.message,
      new Date(req.created_at).toLocaleDateString()
    ]) || [];

    const allRows = [headerRow, ...dataRows];

    // Create or update the "Requirements" sheet
    try {
      // First, try to add the sheet (in case it doesn't exist)
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${googleSheetId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [{
            addSheet: {
              properties: {
                title: 'Requirements'
              }
            }
          }]
        }),
      });
    } catch (error) {
      // Sheet might already exist, continue
      console.log('Sheet might already exist, continuing...');
    }

    // Clear existing data in Requirements sheet
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${googleSheetId}/values/Requirements:clear`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    // Write new data to Requirements sheet
    const updateResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${googleSheetId}/values/Requirements?valueInputOption=RAW`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: allRows,
      }),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Error updating Google Sheets:', errorText);
      throw new Error(`Failed to update Google Sheets: ${errorText}`);
    }

    console.log('Requirements successfully synced to Google Sheets');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Requirements synced to Google Sheets successfully',
        recordsProcessed: requirements?.length || 0
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error in sync-requirements-to-google-sheets function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);