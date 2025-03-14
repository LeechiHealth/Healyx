import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pcchbqtpynltsmjgzhzg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjY2hicXRweW5sdHNtamd6aHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NzY1NzMsImV4cCI6MjA1NDU1MjU3M30._4IqIKGQr1vmv5_iUsltEf1y8ZdR_mU_H-hFgeG9zSY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey) ;
