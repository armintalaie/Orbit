import { supabase } from '@/lib/supabase';

export async function PUT(req: any, { params }: { params: { sid: string } }) {
  const { data } = await supabase
    .from('status')
    .update(req.body)
    .match({ id: params.sid });
  return Response.json(data);
}

export async function DELETE(
  req: any,
  { params }: { params: { sid: string } }
) {
  const { data } = await supabase
    .from('status')
    .delete()
    .match({ id: params.sid });
  return Response.json(data);
}
