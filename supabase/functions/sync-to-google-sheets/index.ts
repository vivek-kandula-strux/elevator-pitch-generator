import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';
import { format } from 'npm:date-fns@3.6.0';
import { toZonedTime } from 'npm:date-fns-tz@3.2.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// IST timezone utility
const formatIST = (date: Date | string): string => {
  const utcDate = typeof date === 'string' ? new Date(date) : date;
  const istDate = toZonedTime(utcDate, 'Asia/Kolkata');
  return format(istDate, 'dd/MM/yyyy HH:mm:ss');
};

// Helpers
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
  const buf = new ArrayBuffer(raw.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < raw.length; i++) view[i] = raw.charCodeAt(i);
  return buf;
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

interface ElevatorPitch {
  id: string;
  created_at: string;
  name: string;
  company: string;
  category: string;
  whatsapp: string;
  usp: string;
  specific_ask: string;
  generated_pitch: string | null;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    console.log('[ElevatorPitches Sync] Starting incremental sync...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceKey) throw new Error('Missing Supabase credentials');
    const supabase = createClient(supabaseUrl, serviceKey);

    const syncType = 'elevator_pitches';
    
    // Get last sync timestamp
    const { data: syncMeta } = await supabase
      .from('sync_metadata')
      .select('last_sync_timestamp')
      .eq('sync_type', syncType)
      .single();

    const lastSyncTime = syncMeta?.last_sync_timestamp || '1970-01-01T00:00:00Z';
    console.log(`[ElevatorPitches Sync] Last sync: ${lastSyncTime}`);

    // Fetch only new/updated records that haven't been synced yet
    const { data: pitches, error } = await supabase
      .from('elevator_pitches')
      .select('*')
      .or(`created_at.gte.${lastSyncTime},updated_at.gte.${lastSyncTime}`)
      .order('created_at', { ascending: true })
      .limit(100); // Batch limit

    if (error) throw error;

    // Filter out already synced records
    let newPitches = pitches || [];
    if (newPitches.length > 0) {
      const existingRecordIds = await supabase
        .from('sync_record_tracking')
        .select('record_id')
        .eq('sync_type', 'elevator_pitches')
        .in('record_id', newPitches.map(p => p.id));

      const syncedIds = new Set(existingRecordIds.data?.map(r => r.record_id) || []);
      newPitches = newPitches.filter(p => !syncedIds.has(p.id));
    }

    // Early return if no new records
    if (!newPitches || newPitches.length === 0) {
      console.log('[ElevatorPitches Sync] No new records found');
      return new Response(
        JSON.stringify({ success: true, sheet: 'ElevatorPitches', recordsProcessed: 0, syncType: 'incremental' }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log(`[ElevatorPitches Sync] Found ${newPitches.length} new/updated records`);

    const clientEmail = Deno.env.get('GOOGLE_SHEETS_CLIENT_EMAIL');
    const privateKey = Deno.env.get('GOOGLE_SHEETS_PRIVATE_KEY')?.replace(/\\n/g, '\n');
    const sheetId = Deno.env.get('GOOGLE_SHEET_ID');
    if (!clientEmail || !privateKey || !sheetId) {
      throw new Error('Missing Google Sheets credentials. Ensure GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY, and GOOGLE_SHEET_ID are set.');
    }

    const accessToken = await createGoogleAccessToken(clientEmail, privateKey);

    const sheetName = 'ElevatorPitches';
    const isFirstSync = !syncMeta;

    // Create sheet if it doesn't exist
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests: [{ addSheet: { properties: { title: sheetName } } }] }),
    }).catch(() => {});

    let appendRes;
    if (isFirstSync) {
      // First sync: clear and write headers + data
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}:clear`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      });

      const headerRow = ['Name', 'Company', 'Category', 'WhatsApp', 'USP', 'Specific Ask', 'Generated Pitch', 'Created Date'];
      const dataRows = newPitches.map((p: ElevatorPitch) => [
        p.name ?? '',
        p.company ?? '',
        p.category ?? '',
        p.whatsapp ?? '',
        p.usp ?? '',
        p.specific_ask ?? '',
        p.generated_pitch ?? '',
        p.created_at ? formatIST(p.created_at) : '',
      ]);
      const values = [headerRow, ...dataRows];

      appendRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}?valueInputOption=RAW`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      });
    } else {
      // Incremental sync: append only new data
      const dataRows = newPitches.map((p: ElevatorPitch) => [
        p.name ?? '',
        p.company ?? '',
        p.category ?? '',
        p.whatsapp ?? '',
        p.usp ?? '',
        p.specific_ask ?? '',
        p.generated_pitch ?? '',
        p.created_at ? formatIST(p.created_at) : '',
      ]);

      appendRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: dataRows }),
      });
    }

    if (!appendRes.ok) {
      const err = await appendRes.text();
      console.error('[ElevatorPitches Sync] Sheets update error:', err);
      throw new Error(`Failed to update Google Sheet: ${err}`);
    }

    // Record which records have been synced to prevent duplicates
    const trackingData = newPitches.map(p => ({
      sync_type: 'elevator_pitches',
      record_id: p.id,
      table_name: 'elevator_pitches',
      record_timestamp: p.updated_at || p.created_at
    }));

    await supabase.from('sync_record_tracking').upsert(trackingData, { onConflict: 'sync_type,record_id' });

    // Update sync metadata with the latest record timestamp
    const latestTimestamp = newPitches.reduce((latest, pitch) => {
      const recordTime = Math.max(
        new Date(pitch.created_at).getTime(),
        new Date(pitch.updated_at || pitch.created_at).getTime()
      );
      return Math.max(latest, recordTime);
    }, new Date(lastSyncTime).getTime());

    await supabase
      .from('sync_metadata')
      .upsert({
        sync_type: syncType,
        last_sync_timestamp: new Date(latestTimestamp).toISOString(),
        last_sync_row_count: newPitches.length,
        sync_status: 'success'
      });

    console.log(`[ElevatorPitches Sync] Success - ${isFirstSync ? 'Full' : 'Incremental'} sync completed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sheet: sheetName, 
        recordsProcessed: newPitches.length,
        syncType: isFirstSync ? 'full' : 'incremental'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (e: any) {
    console.error('[ElevatorPitches Sync] Error:', e?.message || e);
    return new Response(
      JSON.stringify({ success: false, error: String(e?.message || e) }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
