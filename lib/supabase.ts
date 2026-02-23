import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if we have the required environment variables
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder-url.supabase.co');

if (!isSupabaseConfigured && process.env.NODE_ENV === 'production') {
    console.warn('Supabase credentials missing. Client not fully initialized.');
}

export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl!, supabaseAnonKey!)
    : null;
