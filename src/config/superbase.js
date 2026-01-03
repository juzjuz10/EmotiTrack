import { createClient } from '@supabase/supabase-js';

 const superbaseul ='https://dkwrwrcaqbdvzmhwhdib.supabase.co'
    const superbasekey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrd3J3cmNhcWJkdnptaHdoZGliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MDEyOTEsImV4cCI6MjA4Mjk3NzI5MX0.EYexq3vF_Fqb84taOmCgtwMh28ANiTKmbS9fsJ0ARxI'
export const supabase = createClient(superbaseul,superbasekey);
