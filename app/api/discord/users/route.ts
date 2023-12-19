import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const discordUserSchema = z.object({
    email: z.string(),
    discord_id: z.string(),
    discord_username: z.string(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const discord = discordUserSchema.parse(body);
        const profile = await supabase.from('profiles').select().eq('email', discord.email);
        if (!profile.data?.length) {
            return NextResponse.json({ error: 'No Orbit account found' }, { status: 400 });
        }
        const { data } = await supabase.from('discord_users').upsert(discord);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 405 });
    }
}