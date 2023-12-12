import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { z } from "zod";

export const projectSchema = z.object({
    title : z.string(),
    description : z.string(),
    statusid : z.number(),
    deadline : z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    datestarted : z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});


export async function POST(req: Request) {
    try {
        const newProject = await req.json()
    const project = projectSchema.parse(newProject);

    const { data, error } = await supabase.from('project').insert(project);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data);
} catch (error) {
    console.log(error);
    return NextResponse.json({ error: "" }, { status: 405 })

  }
}

export async function GET(req: Request) {
    const data = await supabase.from('project').select();
    return NextResponse.json(data.data);
}
