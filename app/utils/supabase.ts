import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import fs from 'fs';
import path from 'path';

export async function uploadImageToSupabase(file: File, bucket: string = 'monohall'): Promise<string | null> {
    if (!file || file.size === 0) return null;
    
    try {
        const ext = file.name.split('.').pop() || 'png';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${ext}`;
        
        // Write the file locally to public/uploads
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const filePath = path.join(uploadDir, fileName);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(filePath, buffer);
        
        return `/uploads/${fileName}`;
    } catch (error) {
        console.error("Local file upload error:", error);
        return null;
    }
}
