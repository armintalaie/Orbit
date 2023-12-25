import { supabase } from '@/lib/supabase';

export async function GET(
  req: Request,
  { params }: { params: { iid: string } }
) {
  const { iid } = params;
  const assignees = await supabase
    .from('issue_assignee')
    .select(
      `user_id,
  user:user_id ( id, full_name, email, avatar_url )
  `
    )
    .eq('issue_id', Number(iid));
  const data = await supabase.from('issue').select().eq('id', Number(iid));
  const issue = data.data[0];
  const user = assignees.data.map((assignee: any) => assignee.user);
  issue.assignees = user;
  return Response.json(issue);
}

export async function DELETE(
  req: Request,
  { params }: { params: { iid: string } }
) {
  const { iid } = params;
  await supabase.from('issue').delete().eq('id', iid);
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
    console.log(issue);
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
