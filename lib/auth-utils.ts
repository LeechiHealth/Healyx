import { supabase } from "./supabase-client"

/**
 * Checks if a user with the given email already exists
 */
export async function checkUserExists(email: string): Promise<boolean> {
  try {
    // First check if the user exists in auth
    const { data, error } = await supabase.auth.admin.listUsers({
      filter: {
        email: email,
      },
    })

    if (error) {
      console.error("Error checking if user exists:", error)
      // If we can't check, assume they don't exist to allow the signup flow to continue
      // The actual signup will fail if there's a duplicate
      return false
    }

    return data && data.users && data.users.length > 0
  } catch (error) {
    console.error("Exception checking if user exists:", error)
    return false
  }
}

/**
 * Validates user input for signup
 */
export function validateSignupInput(
  email: string,
  password: string,
  confirmPassword: string,
  termsAccepted: boolean,
): { valid: boolean; error?: string } {
  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Please enter a valid email address" }
  }

  // Check password strength
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long" }
  }

  // Check passwords match
  if (password !== confirmPassword) {
    return { valid: false, error: "Passwords do not match" }
  }

  // Check terms accepted
  if (!termsAccepted) {
    return { valid: false, error: "You must accept the Terms & Conditions" }
  }

  return { valid: true }
}

