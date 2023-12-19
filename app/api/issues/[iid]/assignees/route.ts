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
    await notifyUsersDiscord(user_id, iid);
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
  await notifyUsersDiscord(req.body.user_id, req.body.issue_id);
  return Response.json(data);
}




export async function GET(req: any) {
  notifyUsersDiscord('testing', '7');
  return Response.json("data");
}
  
async function notifyUsersDiscord(userId: string, issueId: string) {
  const test_id = '23868b49-aa78-4ff9-bdd5-100e01202910';
  // TODO: remove userId check
  const discord = (await supabase.from('discord_users').select(`discord_id, profiles(id, email)`).eq('profiles.id', userId === 'testing' ? test_id : userId)).data;
  const user = discord.find((d: any) => d.profiles !== null);
  console.log(user);
  if (user) {
    const issue = (await supabase.from('issue').select().eq('id', issueId)).data[0];
    const project = (await supabase.from('project').select().eq('id', issue.projectid)).data[0];
    const res = await fetch("http://localhost:8080/orbit/issue-assigned", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        discord_id: user.discord_id,
        email: user.profiles.email,
        issue_title: issue.title,
        issue_url: `https://orbit-production.up.railway.app/projects/${issue.projectid}/issues/${issue.id}`,
        issue_id: issue.id,
        project_id: project.id,
        project_title: project.title,
        project_description: project.description,
      }),
    });
  }
}