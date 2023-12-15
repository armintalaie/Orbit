import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const teamSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export async function POST(req: Request) {
  try {
    const newTeam = await req.json();
    const team = teamSchema.parse(newTeam);
    const { data } = await supabase.from('team').insert(team);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.member}, { status: 405 });
  }
}

export async function GET(req: Request) {
  const data = await supabase.from('team').select();
  return NextResponse.json(data.data);
}
