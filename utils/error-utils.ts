/**
 * Handles errors consistently throughout the application
 */
export function handleError(error: any, toast: any, title = "Error"): void {
  console.error(error)

  // Extract the error message
  const message = error?.message || error?.error_description || "An unexpected error occurred"

  // Show a toast notification
  if (toast) {
    toast({
      title,
      description: message,
      variant: "destructive",
    })
  }
}

