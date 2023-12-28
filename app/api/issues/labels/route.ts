import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data } = await supabase.from('label').select('*');

  return NextResponse.json(data);
}
