
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  "https://mllyovnjqxhppqvdphqu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sbHlvdm5qcXhocHBxdmRwaHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NjczMjksImV4cCI6MjA2MjE0MzMyOX0.hHBZ2LMpZFOg-N6lM3aYFdT9pyEwhtcu4dClAgiegMY",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
);
