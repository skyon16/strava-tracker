import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

const url = env.SUPABASE_URL ?? undefined;
const key = env.SUPABASE_KEY ?? undefined;

export const supabase = createClient(url, key);
