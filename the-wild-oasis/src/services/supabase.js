import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://xpukqzmmtkftwruwlmqh.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwdWtxem1tdGtmdHdydXdsbXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyODQ3MjQsImV4cCI6MjA1NDg2MDcyNH0.IAY6Z0-9TQjiZ9ks2lYtz4CccSqf7lUMRs7rUz0pzsk';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;