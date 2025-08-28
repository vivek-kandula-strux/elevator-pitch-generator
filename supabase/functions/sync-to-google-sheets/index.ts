import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ElevatorPitch {
  id: string
  created_at: string
  name: string
  company: string
  category: string
  whatsapp: string
  usp: string
  specific_ask: string
  generated_pitch: string | null
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting Google Sheets sync...')
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials')
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get Google Sheets credentials from environment
    const clientEmail = Deno.env.get('GOOGLE_SHEETS_CLIENT_EMAIL')
    const rawPrivateKey = Deno.env.get('GOOGLE_SHEETS_PRIVATE_KEY')
    const sheetId = Deno.env.get('GOOGLE_SHEET_ID')

    if (!clientEmail || !rawPrivateKey || !sheetId) {
      throw new Error('Missing Google Sheets credentials. Please ensure GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY, and GOOGLE_SHEET_ID are set.')
    }

    console.log('Credentials found, processing private key...')

    // Clean and format the private key
    let privateKey: string
    try {
      // Remove quotes if present and handle escaped newlines
      privateKey = rawPrivateKey
        .replace(/^"|"$/g, '') // Remove surrounding quotes
        .replace(/\\n/g, '\n') // Convert escaped newlines to actual newlines
        .trim()
      
      // Validate private key format
      if (!privateKey.includes('-----BEGIN PRIVATE KEY-----') || !privateKey.includes('-----END PRIVATE KEY-----')) {
        throw new Error('Invalid private key format - must be a valid PEM formatted private key')
      }
      
      console.log('Private key processed successfully')
    } catch (keyError) {
      console.error('Private key processing error:', keyError)
      throw new Error(`Failed to process private key: ${keyError.message}`)
    }

    // Fetch all elevator pitches from database
    const { data: pitches, error: fetchError } = await supabase
      .from('elevator_pitches')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Error fetching pitches:', fetchError)
      throw new Error(`Failed to fetch pitches: ${fetchError.message}`)
    }

    console.log(`Found ${pitches?.length || 0} pitches to sync`)

    // Create JWT for Google Sheets API authentication
    const now = Math.floor(Date.now() / 1000)
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    }

    const payload = {
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    }

    // Create JWT token manually (simplified version)
    const encoder = new TextEncoder()
    const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    
    const signatureInput = `${headerB64}.${payloadB64}`
    
    // Import the private key for signing
    let binaryKey: Uint8Array
    try {
      const privateKeyFormatted = privateKey
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/\s/g, '')
      
      console.log('Attempting to decode private key...')
      binaryKey = Uint8Array.from(atob(privateKeyFormatted), c => c.charCodeAt(0))
      console.log('Private key decoded successfully')
    } catch (decodeError) {
      console.error('Base64 decode error:', decodeError)
      throw new Error(`Failed to decode private key: ${decodeError.message}. Please ensure the private key is properly formatted.`)
    }
    
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      binaryKey,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256'
      },
      false,
      ['sign']
    )

    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      encoder.encode(signatureInput)
    )

    const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    
    const jwt = `${signatureInput}.${signatureB64}`

    // Get access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    })

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text()
      console.error('Token error:', tokenError)
      throw new Error(`Failed to get access token: ${tokenError}`)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    console.log('Successfully obtained access token')

    // Prepare data for Google Sheets
    const sheetData = [
      // Header row
      ['Name', 'Company', 'Category', 'WhatsApp', 'USP', 'Specific Ask', 'Generated Pitch', 'Created Date'],
      // Data rows
      ...(pitches || []).map((pitch: ElevatorPitch) => [
        pitch.name,
        pitch.company,
        pitch.category,
        pitch.whatsapp,
        pitch.usp,
        pitch.specific_ask,
        pitch.generated_pitch || '',
        new Date(pitch.created_at).toLocaleDateString()
      ])
    ]

    // Clear existing data and add new data
    const clearResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1:clear`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!clearResponse.ok) {
      const clearError = await clearResponse.text()
      console.error('Clear error:', clearError)
      throw new Error(`Failed to clear sheet: ${clearError}`)
    }

    // Add new data
    const updateResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: sheetData
        })
      }
    )

    if (!updateResponse.ok) {
      const updateError = await updateResponse.text()
      console.error('Update error:', updateError)
      throw new Error(`Failed to update sheet: ${updateError}`)
    }

    const updateResult = await updateResponse.json()
    console.log('Successfully synced to Google Sheets:', updateResult)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully synced ${pitches?.length || 0} elevator pitches to Google Sheets`,
        syncedCount: pitches?.length || 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Sync error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})