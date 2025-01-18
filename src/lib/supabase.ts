import { createClient } from '@supabase/supabase-js';

// Default to empty strings if env vars are missing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error(`
    Error: Missing Supabase environment variables
    
    Please set the following environment variables in your .env file:
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    
    You can find these values in your Supabase project settings under Project Settings > API
  `);
  throw new Error('Missing Supabase environment variables. Check console for details.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);