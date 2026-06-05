import { NextResponse } from 'next/server';
import { supabase } from '@/app/utils/supabase';
import bcrypt from 'bcryptjs';

import { getFeaturedEvents } from '@/app/admin/events/actions';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const featured = await getFeaturedEvents();
        const { data: users, error: usersError } = await supabase.from('users').select('username, role');
        const { data: events, error: eventsError } = await supabase.from('events').select('id, artist, is_featured');
        const { data: brands, error: brandsError } = await supabase.from('brands').select('id, name');

        return NextResponse.json({
            status: "ok",
            supabase_connection: !usersError && !eventsError && !brandsError,
            featured_shows: featured,
            database_stats: {
                users_count: users?.length || 0,
                events_count: events?.length || 0,
                brands_count: brands?.length || 0,
            },
            events_data: events,
            users_list: users
        });
    } catch (error: any) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({ success: false, message: "Missing username or password" }, { status: 400 });
        }

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !user) {
            return NextResponse.json({ success: false, message: "User not found in Supabase" }, { status: 404 });
        }

        const isMatch = bcrypt.compareSync(password, user.password);

        return NextResponse.json({
            success: isMatch,
            message: isMatch ? "Password matches!" : "Invalid password",
            user: { username: user.username, role: user.role }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
