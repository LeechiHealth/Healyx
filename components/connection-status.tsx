"use client"

import { useState, useEffect } from "react"
import { testSupabaseConnection } from "@/lib/supabase-client"

function ConnectionStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "disconnected">("checking")
  const [message, setMessage] = useState<string>("")
  const [retryCount, setRetryCount] = useState(0)

  const checkConnection = async () => {
    setStatus("checking")
    const { success, message } = await testSupabaseConnection()
    setStatus(success ? "connected" : "disconnected")
    setMessage(message)
  }

  useEffect(() => {
    // Initial connection check
    checkConnection()

    // Set up periodic connection checks only if disconnected
    const interval = setInterval(() => {
      if (status === "disconnected" && retryCount < 5) {
        setRetryCount((prev) => prev + 1)
        checkConnection()
      }
    }, 5000) // Check every 5 seconds if disconnected

    return () => clearInterval(interval)
  }, []) // Empty dependency array for initial setup

  // Separate effect for handling retry logic
  useEffect(() => {
    if (status === "disconnected" && retryCount > 0 && retryCount <= 5) {
      const timer = setTimeout(() => {
        checkConnection()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [retryCount, status])

  if (status === "connected") return null

  return (
    <div
      className={`fixed bottom-4 right-4 p-3 rounded-md shadow-lg z-50 ${
        status === "checking" ? "bg-yellow-600" : "bg-red-600"
      }`}
    >
      <div className="flex items-center gap-2 text-white">
        {status === "checking" ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Checking connection...</span>
          </>
        ) : (
          <>
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>Connection issue: {message}</span>
            <button
              onClick={checkConnection}
              className="ml-2 px-2 py-1 bg-white text-red-600 text-xs rounded hover:bg-gray-100"
            >
              Retry
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ConnectionStatus

