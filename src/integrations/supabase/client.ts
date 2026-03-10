import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://gkcjbcrjnjfibxbxubge.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrY2piY3JqbmpmaWJ4Ynh1YmdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxODE1NDQsImV4cCI6MjA4ODc1NzU0NH0.KmUCkuKm1hnkihaB5t_kdgNzUpXGGrVZJ-zODLbdGh4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);