import React, { useState } from 'react';
import { supabase } from '../lib/supabase-client';

const ProviderAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      }
    } catch (error) {
      setMessage('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-white mb-6">Healthcare Provider Login</h1>
        
        {message && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {message}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase, testSupabaseConnection } from "@/lib/supabase-client"
import { Eye, EyeOff } from "lucide-react"

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
  const router = useRouter()

  // Add near the top of the component, after the useState declarations
  const [isConnected, setIsConnected] = useState(true)

  const handleTogglePassword = () => setShowPassword(!showPassword)
  const handleToggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match")
        }

        if (!termsAccepted) {
          throw new Error("Please accept the Terms & Conditions")
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              organization,
              location,
              admin,
              npi,
              role: "provider",
            },
          },
        })

        if (signUpError) throw signUpError

        if (data?.user?.identities?.length === 0) {
          setError("Please check your email for the confirmation link")
        } else {
          router.push("/calendar")
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          // Handle specific error cases
          if (signInError.message === "Failed to fetch") {
            throw new Error(
              "Unable to connect to authentication service. Please check your internet connection and try again.",
            )
          }
          throw signInError
        }
        router.push("/calendar")
      }
    } catch (err) {
      console.error("Auth error:", err)
      setError(err instanceof Error ? err.message : "An error occurred during authentication. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSwitchAuthMode = () => {
    setIsSignUp(!isSignUp)
    setError(null)
  }

  // Add after the existing useEffect hooks
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { success, message } = await testSupabaseConnection()
        setIsConnected(success)
        if (!success) {
          setError(message || "Unable to connect to authentication service. Please check your internet connection.")
        } else {
          setError(null)
        }
      } catch (err) {
        console.error("Connection error:", err)
        setIsConnected(false)
        setError("Unable to connect to authentication service. Please check your internet connection.")
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {isSignUp ? "Create Provider Account" : "Provider Sign In"}
        </h2>
        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500 text-red-500 text-sm">
            {!isConnected ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Attempting to reconnect...</span>
              </div>
            ) : (
              error
            )}
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
                  required
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
                  required
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
                  required
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
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none pr-10 bg-gray-700 text-white border-gray-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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



export default ProviderAuth;
