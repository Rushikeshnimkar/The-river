import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Default to placeholder if env not set
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

if (SUPABASE_URL.includes('placeholder')) {
    console.error('⚠️  WARNING: Using placeholder Supabase URL. Realtime will fail.');
    console.error('   Please create a .env file in d:\\terminal chat app\\ with valid keys.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Schema for validation
export const MessageSchema = z.object({
    id: z.union([z.string(), z.number()]).transform(String),
    user: z.string(),
    text: z.string(),
    timestamp: z.number(),
});

export type Message = z.infer<typeof MessageSchema>;
