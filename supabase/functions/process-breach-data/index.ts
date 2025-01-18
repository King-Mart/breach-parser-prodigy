import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { fileName } = await req.json()

    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabaseClient
      .storage
      .from('breach-data')
      .download(fileName)

    if (downloadError) throw downloadError

    // Process the file content
    const text = await fileData.text()
    const lines = text.split('\n').filter(line => line.trim())
    
    // Process each line and insert into database
    const processedData = await Promise.all(
      lines.map(async (line) => {
        try {
          const [url, username, password] = line.split(':')
          const urlObj = new URL(url)
          
          const { error } = await supabaseClient
            .from('accounts')
            .insert({
              username,
              domain: urlObj.hostname,
              url_path: urlObj.pathname,
              port: parseInt(urlObj.port) || (urlObj.protocol === 'https:' ? 443 : 80),
              password_hash: password,
              is_accessible: true
            })

          if (error) throw error
          return true
        } catch {
          return false
        }
      })
    )

    return new Response(
      JSON.stringify({
        count: processedData.filter(Boolean).length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})