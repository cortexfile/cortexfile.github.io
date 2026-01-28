import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bliloriabkhrcdoywiwf.supabase.co';
const supabaseKey = 'sb_publishable_ybhLRZIkPljw5-MHl9pX-w_ex-EGZcP';

export const supabase = createClient(supabaseUrl, supabaseKey);
