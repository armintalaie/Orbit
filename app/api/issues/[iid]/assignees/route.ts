import { supabase } from '@/lib/supabase';

export async function DELETE(
  req: Request,
  { params }: { params: { iid: string } }
) {
  const { iid } = params;
  const { user_id } = await req.json();
  await supabase
    .from('issue_assignee')
    .delete()
    .eq('user_id', user_id)
    .eq('issue_id', Number(iid));
  return Response.json({ message: 'success' });
}

export async function PUT(
  req: Request,
  { params }: { params: { iid: string } }
) {
  try {
    const { iid } = params;
    const { user_id } = await req.json();
    await supabase
      .from('issue_assignee')
      .delete()
      // .neq('user_id', user_id)
      .eq('issue_id', iid);
    const data = await supabase
      .from('issue_assignee')
      .insert({
        dateassigned: new Date().toISOString(),
        user_id: user_id,
        issue_id: Number(iid),
      });

    return Response.json(data.data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: '' }, { status: 405 });
  }
}

export async function POST(req: any) {
  const { data } = await supabase.from('issue_assignee').insert({
    user_id: req.body.user_id,
    issue_id: req.body.issue_id,
    dateassigned: new Date().toISOString(),
  });
  return Response.json(data);
}




export async function GET(req: any) {
   
    return Response.json("data");
  }
  