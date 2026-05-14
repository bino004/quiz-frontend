import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://ddnpfniebuwlynibvnhj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkbnBmbmllYnV3bHluaWJ2bmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MzM0NTgsImV4cCI6MjA5MzMwOTQ1OH0.52BwITEb_qAkYt_BJsaSmdMFksywiGfASB6BtVVX5WQ",
);
