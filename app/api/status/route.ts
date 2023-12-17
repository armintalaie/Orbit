import { supabase } from "@/lib/supabase";

type ResponseData = {
  message: string;
};

export async function GET(req: any) {
  const {data, error} = await supabase.from('status').select().order('id', { ascending: true });
  return Response.json(data);
}


export async function POST(req: any) {
  const {data, error} = await supabase.from('status').insert(req.body);
  return Response.json(data);
}

