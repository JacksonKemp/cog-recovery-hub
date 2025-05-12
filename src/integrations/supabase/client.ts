import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      fetch: async (url, options: RequestInit = {}) => {
        const accessCode = localStorage.getItem('practitioner_access_code');
        const modifiedOptions: RequestInit = {
          ...options,
          headers: {
            ...(options.headers || {}),
            ...(accessCode && { 'x-practitioner-access-code': accessCode }),
          },
        };
        return fetch(url, modifiedOptions);
      },
    },
  }
);
