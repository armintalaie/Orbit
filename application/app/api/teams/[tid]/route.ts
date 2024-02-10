import { supabase } from '@/lib/supabase';

// import { z } from 'zod';

// const teamSchema = z.object({
//   name: z.string(),
//   description: z.string(),
// });

export async function GET(
  req: Request,
  { params }: { params: { tid: string } }
) {
  const { tid } = params;
  const data = await supabase.from('team').select().eq('id', Number(tid));
  return Response.json(data.data[0]);
}

export async function DELETE(
  req: Request,
  { params }: { params: { tid: string } }
) {
  const { tid } = params;
  const data = await supabase.from('team').delete().eq('id', Number(tid));
  return Response.json({ message: 'success' });
}
