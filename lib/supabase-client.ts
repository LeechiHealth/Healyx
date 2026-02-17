import { createClient } from "@supabase/supabase-js"

// Default Supabase URL and key from the previous setup
const SUPABASE_URL = "https://pcchbqtpynltsmjgzhzg.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjY2hicXRweW5sdHNtamd6aHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NzY1NzMsImV4cCI6MjA1NDU1MjU3M30._4IqIKGQr1vmv5_iUsltEf1y8ZdR_mU_H-hFgeG9zSY"

// Use environment variables if available, otherwise fall back to the hardcoded values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

// Function to test the Supabase connection
export const testSupabaseConnection = async () => {
  try {
    // First check if we can connect to Supabase at all
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Supabase auth service check failed:", sessionError)
      return {
        success: false,
        message: "Unable to connect to authentication service. Please check your network connection.",
      }
    }

    // Try to access a table to test database permissions
    const { data, error } = await supabase.from("patients").select("count").limit(1)

    if (error) {
      console.error("Supabase database check failed:", error)

      // Check if it's a permission issue
      if (error.message.includes("permission") || error.code === "42501") {
        return {
          success: false,
          message: "Database permission issue. Please check your Supabase RLS policies.",
        }
      }

      // Check if it's a schema issue
      if (error.message.includes("does not exist") || error.code === "42P01") {
        return {
          success: false,
          message: "Database schema issue. The required tables may not exist.",
        }
      }

      return {
        success: false,
        message: `Database connection issue: ${error.message}. Please try again later.`,
      }
    }

    return { success: true, message: "Connected to Supabase successfully" }
  } catch (error) {
    console.error("Supabase connection test failed:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to connect to database service",
    }
  }
}

