import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    console.log('[ElevatorPitches Sync] Starting...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceKey) throw new Error('Missing Supabase credentials');
    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: pitches, error } = await supabase
      .from('elevator_pitches')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;

    console.log(`[ElevatorPitches Sync] Fetched ${pitches?.length ?? 0} rows`);

    const clientEmail = Deno.env.get('GOOGLE_SHEETS_CLIENT_EMAIL');
    const privateKey = Deno.env.get('GOOGLE_SHEETS_PRIVATE_KEY')?.replace(/\\n/g, '\n');
    const sheetId = Deno.env.get('GOOGLE_SHEET_ID');
    if (!clientEmail || !privateKey || !sheetId) {
      throw new Error('Missing Google Sheets credentials. Ensure GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY, and GOOGLE_SHEET_ID are set.');
    }

    const accessToken = await createGoogleAccessToken(clientEmail, privateKey);

    const headerRow = ['Name', 'Company', 'Category', 'WhatsApp', 'USP', 'Specific Ask', 'Generated Pitch', 'Created Date'];
    const dataRows = (pitches ?? []).map((p: ElevatorPitch) => [
      p.name ?? '',
      p.company ?? '',
      p.category ?? '',
      p.whatsapp ?? '',
      p.usp ?? '',
      p.specific_ask ?? '',
      p.generated_pitch ?? '',
      p.created_at ? new Date(p.created_at).toLocaleString() : '',
    ]);
    const values = [headerRow, ...dataRows];

    const sheetName = 'ElevatorPitches';

    // Try creating the sheet if it doesn't exist
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests: [{ addSheet: { properties: { title: sheetName } } }] }),
    }).catch(() => {});

    // Clear existing content
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}:clear`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    });

    // Write new content
    const putRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}?valueInputOption=RAW`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values }),
    });

    if (!putRes.ok) {
      const err = await putRes.text();
      console.error('[ElevatorPitches Sync] Sheets update error:', err);
      throw new Error(`Failed to update Google Sheet: ${err}`);
    }

    console.log('[ElevatorPitches Sync] Success');

    return new Response(
      JSON.stringify({ success: true, sheet: sheetName, recordsProcessed: pitches?.length ?? 0 }),
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
