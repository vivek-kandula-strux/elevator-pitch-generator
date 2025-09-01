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

    // Get last sync metadata for requirements
    const { data: syncMetadata } = await supabase
      .from('sync_metadata')
      .select('*')
      .eq('sync_type', 'requirements')
      .single();
    
    console.log('Last requirements sync metadata:', syncMetadata);
    
    // Determine sync strategy for requirements
    let requirements: any[] = [];
    let isIncrementalSync = false;
    const BATCH_SIZE = 100;
    
    if (syncMetadata?.last_sync_timestamp) {
      // Incremental sync
      const { data: newRequirements, error: fetchError } = await supabase
        .from('requirements')
        .select('*')
        .or(`created_at.gt.${syncMetadata.last_sync_timestamp},updated_at.gt.${syncMetadata.last_sync_timestamp}`)
        .order('created_at', { ascending: false })
        .limit(BATCH_SIZE);

      if (fetchError) {
        console.error('Error fetching new requirements:', fetchError);
        throw fetchError;
      }
      
      requirements = newRequirements || [];
      isIncrementalSync = true;
      console.log(`Incremental sync: Found ${requirements.length} new/updated requirements`);
      
      // Early return if no new records
      if (requirements.length === 0) {
        console.log('No new requirements to sync, returning early');
        return new Response(
          JSON.stringify({
            success: true,
            message: 'No new requirements to sync',
            recordsProcessed: 0,
            isIncremental: true
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }
    } else {
      // First-time sync
      const { data: allRequirements, error: fetchError } = await supabase
        .from('requirements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(BATCH_SIZE);

      if (fetchError) {
        console.error('Error fetching all requirements:', fetchError);
        throw fetchError;
      }
      
      requirements = allRequirements || [];
      console.log(`First-time sync: Found ${requirements.length} requirements`);
    }

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
    const dataRows = requirements.map(req => [
      req.name,
      req.email,
      req.company,
      req.whatsapp,
      req.service_type,
      req.message,
      new Date(req.created_at).toLocaleDateString()
    ]);

    // Handle sheet creation and data sync
    if (isIncrementalSync && requirements.length > 0) {
      // Incremental sync: append new data to Requirements sheet
      console.log('Performing incremental requirements sync - appending data');
      
      const appendResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${googleSheetId}/values/Requirements:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: dataRows,
        }),
      });

      if (!appendResponse.ok) {
        const errorText = await appendResponse.text();
        console.error('Error appending to Google Sheets:', errorText);
        throw new Error(`Failed to append to Google Sheets: ${errorText}`);
      }
    } else {
      // First-time sync: create sheet if needed and write all data
      console.log('Performing first-time requirements sync');
      
      // Try to add the sheet (in case it doesn't exist)
      try {
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
        console.log('Requirements sheet might already exist, continuing...');
      }

      // Clear existing data in Requirements sheet
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${googleSheetId}/values/Requirements:clear`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Write header and data to Requirements sheet
      const headerRow = ['Name', 'Email', 'Company', 'WhatsApp', 'Service Type', 'Message', 'Created Date'];
      const allRows = [headerRow, ...dataRows];
      
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
    }

    // Update sync metadata for requirements
    const currentTimestamp = new Date().toISOString();
    const upsertResult = await supabase
      .from('sync_metadata')
      .upsert({
        sync_type: 'requirements',
        last_sync_timestamp: currentTimestamp,
        last_sync_row_count: requirements.length,
        sync_status: 'success',
        error_details: null,
        updated_at: currentTimestamp
      }, {
        onConflict: 'sync_type'
      });

    if (upsertResult.error) {
      console.error('Error updating requirements sync metadata:', upsertResult.error);
    } else {
      console.log('Updated requirements sync metadata successfully');
    }

    console.log('Requirements successfully synced to Google Sheets');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Requirements synced to Google Sheets successfully',
        recordsProcessed: requirements.length,
        isIncremental: isIncrementalSync,
        syncType: isIncrementalSync ? 'incremental' : 'full'
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
    
    // Update sync metadata with error for requirements
    try {
      await supabase
        .from('sync_metadata')
        .upsert({
          sync_type: 'requirements',
          sync_status: 'failed',
          error_details: { 
            message: error.message, 
            timestamp: new Date().toISOString() 
          },
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'sync_type'
        });
    } catch (metaError) {
      console.error('Failed to update requirements error metadata:', metaError);
    }
    
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