import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { pid: string } }
) {
  const { data: projectData, error: projectError } = await supabase
    .from('project')
    .select('teamid')
    .eq('id', Number(params.pid))
    .single();

  if (projectError) {
    throw projectError;
  }

  const { data: teamData, error: teamError } = await supabase
    .from('team_member')
    .select(
      `memberid: memberid,
    profile: profiles (full_name, username, avatar_url)`
    )
    .eq('teamid', projectData.teamid);

  if (teamError) {
    throw teamError;
  }

  if (teamError) {
    return NextResponse.json({ error: teamError.message }, { status: 400 });
  }
  console.log(teamData);

  return NextResponse.json(teamData, {
    headers: { 'Cache-Control': 's-maxage=3, stale-while-revalidate' },
  });
}
