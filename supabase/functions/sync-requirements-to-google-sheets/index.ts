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
    console.log('[Requirements Sync] Starting...');

    // Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceKey) throw new Error('Missing Supabase credentials');
    const supabase = createClient(supabaseUrl, serviceKey);

    // Fetch requirements
    const { data: requirements, error: fetchError } = await supabase
      .from('requirements')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;
    console.log(`[Requirements Sync] Fetched ${requirements?.length ?? 0} rows`);

    // Google credentials
    const googleClientEmail = Deno.env.get('GOOGLE_SHEETS_CLIENT_EMAIL');
    const googlePrivateKey = Deno.env.get('GOOGLE_SHEETS_PRIVATE_KEY')?.replace(/\\n/g, '\n');
    const googleSheetId = Deno.env.get('GOOGLE_SHEET_ID');

    if (!googleClientEmail || !googlePrivateKey || !googleSheetId) {
      throw new Error('Missing Google Sheets credentials. Ensure GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY, and GOOGLE_SHEET_ID are set.');
    }

    // Access token
    const accessToken = await createGoogleAccessToken(googleClientEmail, googlePrivateKey);

    // Prepare rows
    const headerRow = ['Name', 'Email', 'Company', 'WhatsApp', 'Service Type', 'Message', 'Created Date'];
    const dataRows = (requirements ?? []).map((r: any) => [
      r.name ?? '',
      r.email ?? '',
      r.company ?? '',
      r.whatsapp ?? '',
      r.service_type ?? '',
      r.message ?? '',
      r.created_at ? new Date(r.created_at).toLocaleString() : '',
    ]);
    const values = [headerRow, ...dataRows];

    const sheetName = 'Requirements';

    // Try creating sheet (ignore if exists)
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${googleSheetId}:batchUpdate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests: [{ addSheet: { properties: { title: sheetName } } }] }),
    }).catch(() => {});

    // Clear existing values
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${googleSheetId}/values/${encodeURIComponent(sheetName)}:clear`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    });

    // Write new values
    const putRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${googleSheetId}/values/${encodeURIComponent(sheetName)}?valueInputOption=RAW`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values }),
    });

    if (!putRes.ok) {
      const err = await putRes.text();
      console.error('[Requirements Sync] Sheets update error:', err);
      throw new Error(`Failed to update Google Sheet: ${err}`);
    }

    console.log('[Requirements Sync] Success');

    return new Response(JSON.stringify({ success: true, sheet: sheetName, recordsProcessed: requirements?.length ?? 0 }), {
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
