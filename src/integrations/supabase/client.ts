// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gzfgrjrknyzuauvnzfmb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6ZmdyanJrbnl6dWF1dm56Zm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczMTQwMjYsImV4cCI6MjA1Mjg5MDAyNn0.k4Zl-BjQni1hqjWSfioUCw71HcVIGdLNA3Vx5EVd4Fo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);