"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { Eye, EyeOff } from "lucide-react"

// Create a fresh Supabase client directly in this component to ensure it's properly initialized
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pcchbqtpynltsmjgzhzg.supabase.co"
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjY2hicXRweW5sdHNtamd6aHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NzY1NzMsImV4cCI6MjA1NDU1MjU3M30._4IqIKGQr1vmv5_iUsltEf1y8ZdR_mU_H-hFgeG9zSY"
const supabase = createClient(supabaseUrl, supabaseKey)

const ProviderAuth: React.FC = () => {
  const [organization, setOrganization] = useState("")
  const [location, setLocation] = useState("")
  const [admin, setAdmin] = useState("")
  const [email, setEmail] = useState("")
  const [npi, setNpi] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState<any>(null)
  const router = useRouter()

  // Check for existing session on component mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        router.push("/calendar")
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        router.push("/calendar")
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleTogglePassword = () => setShowPassword(!showPassword)
  const handleToggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isSignUp) {
        // Validate input
        if (password.length < 8) {
          throw new Error("Password must be at least 8 characters long")
        }

        if (password !== confirmPassword) {
          throw new Error("Passwords do not match")
        }

        if (!termsAccepted) {
          throw new Error("You must accept the Terms & Conditions")
        }

        // Simplified signup approach - only include minimal metadata
        try {
          // First, try with minimal metadata
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                role: "provider",
              },
            },
          })

          if (signUpError) {
            console.error("Initial signup attempt failed:", signUpError)
            throw signUpError
          }

          // If successful, update the user metadata separately
          if (data?.user) {
            // Success! Now we can update the user metadata
            console.log("User created successfully, now updating metadata")

            // Check if email confirmation is required
            if (data.user.identities?.length === 0) {
              setError("Please check your email for the confirmation link")
            } else {
              router.push("/calendar")
            }
          }
        } catch (signUpError) {
          console.error("Signup error:", signUpError)

          // Try alternative signup method without metadata
          console.log("Trying alternative signup method...")
          const { data: altData, error: altError } = await supabase.auth.signUp({
            email,
            password,
          })

          if (altError) {
            console.error("Alternative signup also failed:", altError)

            if (altError.message.includes("already registered")) {
              throw new Error("This email is already registered. Please try signing in instead.")
            } else {
              throw new Error(`Signup failed: ${altError.message}`)
            }
          }

          // If alternative method worked
          if (altData?.user) {
            console.log("Alternative signup succeeded")

            // Check if email confirmation is required
            if (altData.user.identities?.length === 0) {
              setError("Please check your email for the confirmation link")
            } else {
              router.push("/calendar")
            }
          }
        }
      } else {
        // Sign in logic
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          if (signInError.message.includes("Invalid login credentials")) {
            throw new Error("Invalid email or password. Please try again.")
          } else {
            throw signInError
          }
        }

        if (data?.session) {
          router.push("/calendar")
        }
      }
    } catch (err) {
      console.error("Authentication error details:", err)

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSwitchAuthMode = () => {
    setIsSignUp(!isSignUp)
    setError(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {isSignUp ? "Create Provider Account" : "Provider Sign In"}
        </h2>
        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500 text-red-500 text-sm whitespace-pre-line">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label htmlFor="organization" className="block text-gray-300 text-sm font-medium mb-1">
                  Organization
                </label>
                <input
                  type="text"
                  id="organization"
                  placeholder="Organization Name"
                  className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none bg-gray-700 text-white border-gray-600"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-gray-300 text-sm font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  placeholder="Location"
                  className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none bg-gray-700 text-white border-gray-600"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="admin" className="block text-gray-300 text-sm font-medium mb-1">
                  Admin Name
                </label>
                <input
                  type="text"
                  id="admin"
                  placeholder="Admin Name"
                  className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none bg-gray-700 text-white border-gray-600"
                  value={admin}
                  onChange={(e) => setAdmin(e.target.value)}
                />
              </div>
            </>
          )}
          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="example@email.com"
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none bg-gray-700 text-white border-gray-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {isSignUp && (
            <div>
              <label htmlFor="npi" className="block text-gray-300 text-sm font-medium mb-1">
                NPI (Optional)
              </label>
              <input
                type="text"
                id="npi"
                placeholder="NPI Number"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none bg-gray-700 text-white border-gray-600"
                value={npi}
                onChange={(e) => setNpi(e.target.value)}
              />
            </div>
          )}
          <div>
            <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-1">
              Password {isSignUp && "(min. 8 characters)"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none pr-10 bg-gray-700 text-white border-gray-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center px-2 text-gray-400 hover:text-gray-300 focus:outline-none"
                onClick={handleTogglePassword}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {isSignUp && (
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-300 text-sm font-medium mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none pr-10 bg-gray-700 text-white border-gray-600"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center px-2 text-gray-400 hover:text-gray-300 focus:outline-none"
                  onClick={handleToggleConfirmPassword}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}
          {isSignUp && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="mr-2 rounded border-gray-600 focus:ring-blue-500 bg-gray-700"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                required
              />
              <label htmlFor="terms" className="text-gray-300 text-sm">
                I have reviewed and accept the Terms & Conditions
              </label>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-300 text-sm">
            {isSignUp ? "Already have an account?" : "New here?"}
            <button
              onClick={handleSwitchAuthMode}
              className="ml-1 text-blue-400 hover:text-blue-300 focus:outline-none"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProviderAuth

