import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { data } = await supabase.from('profiles').select();
  const m = await supabase.auth.getSession();

  console.log('m', m);

  return NextResponse.json(data, {
    headers: { 'Cache-Control': 's-maxage=3, stale-while-revalidate' },
  });
}
