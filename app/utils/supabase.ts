import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadImageToSupabase(file: File, bucket: string = 'monohall'): Promise<string | null> {
    if (!file || file.size === 0) return null;
    
    const ext = file.name.split('.').pop() || 'png';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${ext}`;
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, buffer, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error("Supabase storage upload error:", error);
        return null;
    }

    const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
}
