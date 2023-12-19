import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const discordChannelSchema = z.object({
    project_id: z.string(),
    channel_id: z.string(),
    channel_name: z.string(),
    project_name: z.string(),
});

export async function GET(req: NextRequest) {
    const channelId = req.nextUrl.searchParams.get('channelId');
    const { data } = await supabase.from('discord_channels').select().eq('channel_id', channelId);
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const discord = discordChannelSchema.parse(body);
        const channel = await supabase.from('discord_channels').select().eq('channel_id', discord.channel_id).eq('project_id', discord.project_id);
        if (channel.data?.length) {
            return NextResponse.json(channel.data);
        }
        const { data } = await supabase.from('discord_channels').insert(discord);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 405 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get('id');
        const { data } = await supabase.from('discord_channels').delete().eq('id', id);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 405 });
    }
}