
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zvdkhchpmdhhokjzlfyu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2ZGtoY2hwbWRoaG9ranpsZnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MzIxMTEsImV4cCI6MjA2MDAwODExMX0.zb18jKAzh6c6k4U69L2CKu2vZ1R5gXP5hRcvlqBZccI";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2ZGtoY2hwbWRoaG9ranpsZnl1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDQzMjExMSwiZXhwIjoyMDYwMDA4MTExfQ.-yTT2QYi1An0hWUhFlIsRyEDssHry9fTAZTuv2xE7wQ";

// Create two clients: one for public operations and one for admin operations
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
export const supabaseAdmin = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
