import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yhpguvarecbljqhvymqp.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlocGd1dmFyZWNibGpxaHZ5bXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMjMzMTEsImV4cCI6MjA3NTU5OTMxMX0.7_O0UZJpL4o2FBxorvaDsKYhiOecZjYpzTEvkPoHYQM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
