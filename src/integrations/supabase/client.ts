
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use the environment variables or fallback to the project specific values
// These values are from the Supabase project that's already connected
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://akwdkurznlswhplkqtps.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd2RrdXJ6bmxzd2hwbGtxdHBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTA4MDIsImV4cCI6MjA1NjA4NjgwMn0.iR7boBH24cONY_A8Zk2iqDxZFaxWrOpX1eFnIYWw1G8";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
