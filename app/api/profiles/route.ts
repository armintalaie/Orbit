import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { data } = await supabase.from('profiles').select();
  return NextResponse.json(data);
}