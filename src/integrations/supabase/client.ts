import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tcwnjdbpwlvtbwsvyuwk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjd25qZGJwd2x2dGJ3c3Z5dXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NDQ4NTIsImV4cCI6MjA3NjQyMDg1Mn0.F7oUJFYt5-k9Pl_e3rsDX6aBEeS9-BccI3SM6WN7O_A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);