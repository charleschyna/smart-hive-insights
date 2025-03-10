import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://akwdkurznslhplkqtps.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd2RrdXJ6bmxzd2hwbGtxdHBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTA4MDIsImV4cCI6MjA1NjA4NjgwMn0.iR7boBH24cONY_A8Zk2iqDxZFaxWrOpX1eFnIYWw1G8';

export const supabase = createClient(supabaseUrl, supabaseKey);
