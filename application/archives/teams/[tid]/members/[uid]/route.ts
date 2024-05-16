import { supabase } from '@/lib/supabase';

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      tid: string;
      uid: string;
    };
  }
) {
  const { tid, uid } = params;
  const { count, error } = await supabase
    .from('team_member')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq('teamid', tid)
    .eq('memberid', uid);

  if (error) {
    return Response.json(
      {
        error: error.message,
      },
      {
        status: 400,
      }
    );
  }

  if (count !== 1) {
    return Response.json(
      {
        error: 'not found',
      },
      {
        status: 404,
      }
    );
  }

  return Response.json({
    message: 'is a member',
  });
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      tid: string;
      uid: string;
    };
  }
) {
  const { tid, uid } = params;
  await supabase.from('team_member').delete().eq('teamid', tid).eq('memberid', uid);
  return Response.json({
    message: 'success',
  });
}

//
export async function POST(
  req: Request,
  {
    params,
  }: {
    params: {
      tid: string;
      uid: string;
    };
  }
) {
  try {
    const { tid, uid } = params;
    const data = await supabase.from('team_member').insert({
      teamid: tid,
      memberid: uid,
    });
    return Response.json(data.data);
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        error: error.message,
      },
      {
        status: 405,
      }
    );
  }
}
