import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

// Standard CORS headers for web invocation
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- Helpers: base64url + PEM → ArrayBuffer + JWT signer ---
const base64urlEncode = (input: string | ArrayBuffer): string => {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : new Uint8Array(input);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const pemToArrayBuffer = (pem: string): ArrayBuffer => {
  const cleaned = pem
    .replace(/-----BEGIN [A-Z ]+-----/g, '')
    .replace(/-----END [A-Z ]+-----/g, '')
    .replace(/\s+/g, '');
  const raw = atob(cleaned);
  const buffer = new ArrayBuffer(raw.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) view[i] = raw.charCodeAt(i);
  return buffer;
};

const createGoogleAccessToken = async (clientEmail: string, privateKeyPem: string): Promise<string> => {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const signingInput = `${base64urlEncode(JSON.stringify(header))}.${base64urlEncode(JSON.stringify(payload))}`;
  const keyData = pemToArrayBuffer(privateKeyPem);
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyData,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(signingInput));
  const jwt = `${signingInput}.${base64urlEncode(signature)}`;

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!tokenResponse.ok) {
    const err = await tokenResponse.text();
    throw new Error(`Google OAuth token exchange failed: ${err}`);
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token as string;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[Requirements Sync] Starting incremental sync...');

    // Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceKey) throw new Error('Missing Supabase credentials');
    const supabase = createClient(supabaseUrl, serviceKey);

    const syncType = 'requirements';
    
    // Get last sync timestamp
    const { data: syncMeta } = await supabase
      .from('sync_metadata')
      .select('last_sync_timestamp')
      .eq('sync_type', syncType)
      .single();

    const lastSyncTime = syncMeta?.last_sync_timestamp || '1970-01-01T00:00:00Z';
    console.log(`[Requirements Sync] Last sync: ${lastSyncTime}`);

    // Fetch only new/updated records that haven't been synced yet
    const { data: requirements, error: fetchError } = await supabase
      .from('requirements')
      .select('*')
      .or(`created_at.gte.${lastSyncTime},updated_at.gte.${lastSyncTime}`)
      .order('created_at', { ascending: true })
      .limit(100); // Batch limit

    if (fetchError) throw fetchError;

    // Filter out already synced records
    let newRequirements = requirements || [];
    if (newRequirements.length > 0) {
      const existingRecordIds = await supabase
        .from('sync_record_tracking')
        .select('record_id')
        .eq('sync_type', 'requirements')
        .in('record_id', newRequirements.map(r => r.id));

      const syncedIds = new Set(existingRecordIds.data?.map(r => r.record_id) || []);
      newRequirements = newRequirements.filter(r => !syncedIds.has(r.id));
    }

    // Early return if no new records
    if (!newRequirements || newRequirements.length === 0) {
      console.log('[Requirements Sync] No new records found');
      return new Response(JSON.stringify({ 
        success: true, 
        sheet: 'Requirements', 
        recordsProcessed: 0, 
        syncType: 'incremental' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log(`[Requirements Sync] Found ${newRequirements.length} new/updated records`);

    // Google credentials
    const googleClientEmail = Deno.env.get('GOOGLE_SHEETS_CLIENT_EMAIL');
    const googlePrivateKey = Deno.env.get('GOOGLE_SHEETS_PRIVATE_KEY')?.replace(/\\n/g, '\n');
    const googleSheetId = Deno.env.get('GOOGLE_SHEET_ID');

    if (!googleClientEmail || !googlePrivateKey || !googleSheetId) {
      throw new Error('Missing Google Sheets credentials. Ensure GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY, and GOOGLE_SHEET_ID are set.');
    }

    // Access token
    const accessToken = await createGoogleAccessToken(googleClientEmail, googlePrivateKey);

    const sheetName = 'Requirements';
    const isFirstSync = !syncMeta;

    // Create sheet if it doesn't exist
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${googleSheetId}:batchUpdate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests: [{ addSheet: { properties: { title: sheetName } } }] }),
    }).catch(() => {});

    let appendRes;
    if (isFirstSync) {
      // First sync: clear and write headers + data
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${googleSheetId}/values/${encodeURIComponent(sheetName)}:clear`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      });

      const headerRow = ['Name', 'Email', 'Company', 'WhatsApp', 'Service Type', 'Message', 'Created Date'];
      const dataRows = newRequirements.map((r: any) => [
        r.name ?? '',
        r.email ?? '',
        r.company ?? '',
        r.whatsapp ?? '',
        r.service_type ?? '',
        r.message ?? '',
        r.created_at ? new Date(r.created_at).toLocaleString() : '',
      ]);
      const values = [headerRow, ...dataRows];

      appendRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${googleSheetId}/values/${encodeURIComponent(sheetName)}?valueInputOption=RAW`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      });
    } else {
      // Incremental sync: append only new data
      const dataRows = newRequirements.map((r: any) => [
        r.name ?? '',
        r.email ?? '',
        r.company ?? '',
        r.whatsapp ?? '',
        r.service_type ?? '',
        r.message ?? '',
        r.created_at ? new Date(r.created_at).toLocaleString() : '',
      ]);

      appendRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${googleSheetId}/values/${encodeURIComponent(sheetName)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: dataRows }),
      });
    }

    if (!appendRes.ok) {
      const err = await appendRes.text();
      console.error('[Requirements Sync] Sheets update error:', err);
      throw new Error(`Failed to update Google Sheet: ${err}`);
    }

    // Record which records have been synced to prevent duplicates
    const trackingData = newRequirements.map(r => ({
      sync_type: 'requirements',
      record_id: r.id,
      table_name: 'requirements',
      record_timestamp: r.updated_at || r.created_at
    }));

    await supabase.from('sync_record_tracking').upsert(trackingData, { onConflict: 'sync_type,record_id' });

    // Update sync metadata with the latest record timestamp
    const latestTimestamp = newRequirements.reduce((latest, req) => {
      const recordTime = Math.max(
        new Date(req.created_at).getTime(),
        new Date(req.updated_at || req.created_at).getTime()
      );
      return Math.max(latest, recordTime);
    }, new Date(lastSyncTime).getTime());

    await supabase
      .from('sync_metadata')
      .upsert({
        sync_type: syncType,
        last_sync_timestamp: new Date(latestTimestamp).toISOString(),
        last_sync_row_count: newRequirements.length,
        sync_status: 'success'
      });

    console.log(`[Requirements Sync] Success - ${isFirstSync ? 'Full' : 'Incremental'} sync completed`);

    return new Response(JSON.stringify({ 
      success: true, 
      sheet: sheetName, 
      recordsProcessed: newRequirements.length,
      syncType: isFirstSync ? 'full' : 'incremental'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error: any) {
    console.error('[Requirements Sync] Error:', error?.message || error);
    return new Response(JSON.stringify({ success: false, error: String(error?.message || error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

serve(handler);
