import { createClient } from '@supabase/supabase-js';

export const initsupabase = () => {
  if (process.env.SUPABASE_URL === undefined || process.env.SUPABASE_ANON_KEY === undefined) {
    throw new Error('Missing env variables SUPABASE_URL and SUPABASE_ANON_KEY');
  }

  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
};
