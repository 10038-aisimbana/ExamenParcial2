import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    "https://phumuqinwdqvhxapwvse.supabase.co", 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBodW11cWlud2Rxdmh4YXB3dnNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNzk2ODUsImV4cCI6MjAyMjg1NTY4NX0.AXX304Tw2DSsCm8lItVPhvL-HbTVrsxf4TmRPO2pJig"
);