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
  console.log(tid);
  const data = await supabase.from('team').select().eq('id', Number(tid));
  console.log(data);
  return Response.json(data.data[0]);
}

export async function DELETE(
  req: Request,
  { params }: { params: { tid: string } }
) {
  const { tid } = params;
  console.log(tid);
  console.log('kwoejwnownowrngwrogno');
  const data = await supabase.from('team').delete().eq('id', Number(tid));
  console.log(data);
  return Response.json({ message: 'success' });
}

// export async function PUT(
//   req: Request,
//   { params }: { params: { pid: string } }
// ) {
//   try {
//     const { pid } = params;
//     const newProject = await req.json();
//     const project = newProject;
//     console.log(pid);
//     const data = await supabase
//       .from('project')
//       .update({ ...project, dateupdated: new Date().toISOString() })
//       .eq('id', Number(pid));
//     console.log(data);
//     return Response.json(data.data);
//   } catch (error) {
//     console.log(error);
//     return Response.json({ error: '' }, { status: 405 });
//   }
// }
