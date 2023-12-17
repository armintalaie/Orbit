import { supabase } from '@/lib/supabase';

export async function GET(
  req: Request,
  { params }: { params: { pid: string; iid: string } }
) {
  const { pid, iid } = params;
  const data = await supabase.from('issue').select().eq('id', Number(iid));
  return Response.json(data.data[0]);
}

export async function DELETE(
  req: Request,
  { params }: { params: { iid: string } }
) {
  const { iid } = params;
  await supabase.from('issue').delete().eq('id', Number(iid));
  return Response.json({ message: 'success' });
}

export async function PATCH(
  req: Request,
  { params }: { params: { iid: string } }
) {
  try {
    const { iid } = params;
    const newIssue = await req.json();
    const issue = newIssue;
    const data = await supabase
      .from('issue')
      .update({ ...issue, dateupdated: new Date().toISOString() })
      .eq('id', Number(iid));
    return Response.json(data.data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: '' }, { status: 405 });
  }
}
