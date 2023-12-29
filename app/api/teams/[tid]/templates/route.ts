import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const templateSchema = z.object({
  title: z.string(),
  description: z.string(),
  contents: z.string(),
  teamid: z.any(),
});

export async function POST(
  req: Request,
  { params }: { params: { tid: string } }
) {
  let newTemplate = await req.json();
  const { tid } = params;

  newTemplate = templateSchema.parse({
    ...newTemplate,
    teamid: Number(tid),
  });
  const { data } = await supabase.from('issue_template').insert(newTemplate);
  return Response.json(data);
}

export async function GET(
  req: Request,
  { params }: { params: { tid: string } }
) {
  const { tid } = params;
  const { data } = await supabase
    .from('issue_template')
    .select()
    .eq('teamid', Number(tid));
  return Response.json(data);
}
