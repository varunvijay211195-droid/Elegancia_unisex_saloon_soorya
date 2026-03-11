import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface InstagramPost {
    id: string;
    caption: string | null;
    image_url: string;
    post_url: string | null;
    type: string;
    is_featured: boolean;
    created_at: string;
}

export async function GET() {
    try {
        // Fetch Instagram posts from Supabase
        const { data: posts, error } = await supabase
            .from('instagram_posts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(12);

        if (error) {
            console.error('Error fetching Instagram posts from Supabase:', error);
            return NextResponse.json({
                data: [],
                caption: "Latest posts from @elegancia_unisex_salon",
                error: error.message
            });
        }

        // Transform the data to match the expected format for the frontend
        const transformedPosts = (posts || []).map((post: InstagramPost) => ({
            id: post.id,
            caption: post.caption || '',
            media_url: post.image_url,
            permalink: post.post_url || `https://www.instagram.com/elegancia_unisex_salon/`,
            media_type: post.type === 'reel' ? 'VIDEO' : 'IMAGE',
            is_reel: post.type === 'reel',
            is_featured: post.is_featured,
            timestamp: post.created_at
        }));

        return NextResponse.json({
            data: transformedPosts,
            caption: "Latest posts from @elegancia_unisex_salon"
        });
    } catch (error) {
        console.error('Error in Instagram API:', error);
        return NextResponse.json({
            data: [],
            caption: "Latest posts from @elegancia_unisex_salon",
            error: 'Failed to fetch posts'
        });
    }
}
