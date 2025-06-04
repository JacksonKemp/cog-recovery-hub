import { createClient } from '@supabase/supabase-js';

// Use import.meta.env instead of process.env for Vite projects
export const supabase = createClient(
  "https://mllyovnjqxhppqvdphqu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sbHlvdm5qcXhocHBxdmRwaHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NjczMjksImV4cCI6MjA2MjE0MzMyOX0.hHBZ2LMpZFOg-N6lM3aYFdT9pyEwhtcu4dClAgiegMY",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: {
        getItem: async () => null,
        setItem: async () => {},
        removeItem: async () => {}
      }
    },
    global: {
      headers: {
        'apikey': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sbHlvdm5qcXhocHBxdmRwaHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NjczMjksImV4cCI6MjA2MjE0MzMyOX0.hHBZ2LMpZFOg-N6lM3aYFdT9pyEwhtcu4dClAgiegMY"
      },
      fetch: async (url, options: RequestInit = {}) => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          console.log("Auth session check:", session ? "Session exists" : "No session");
          
          const accessCode = localStorage.getItem('practitioner_access_code');
          const modifiedOptions: RequestInit = {
            ...options,
            headers: {
              ...(options.headers || {}),
              ...(accessCode && { 'x-practitioner-access-code': accessCode }),
            },
          };
          
          console.log("Fetch request to:", url);
          return fetch(url, modifiedOptions);
        } catch (error) {
          console.error("Error in Supabase fetch wrapper:", error);
          return fetch(url, options);
        }
      },
    },
  }
);
