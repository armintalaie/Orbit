import { supabase } from '@/lib/supabase';

// import { z } from 'zod';

// const projectSchema = z.object({
//   title: z.string(),
//   description: z.string(),
//   statusid: z.number(),
//   deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
// });

export async function GET(
  req: Request,
  { params }: { params: { pid: string } }
) {
  const { pid } = params;
  console.log(pid);
  const data = await supabase.from('project').select().eq('id', Number(pid));
  console.log(data);
  return Response.json(data.data[0]);
}

export async function DELETE(
  req: Request,
  { params }: { params: { pid: string } }
) {
  const { pid } = params;
  console.log(pid);
  await supabase.from('project').delete().eq('id', Number(pid));
  return Response.json({ message: 'success' });
}

export async function PUT(
  req: Request,
  { params }: { params: { pid: string } }
) {
  try {
    const { pid } = params;
    const newProject = await req.json();
    const project = newProject;
    console.log(pid);
    const data = await supabase
      .from('project')
      .update({ ...project, dateupdated: new Date().toISOString() })
      .eq('id', Number(pid));
    console.log(data);
    return Response.json(data.data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: '' }, { status: 405 });
  }
}
