/**
 * Formats a Date object to an ISO string for database storage
 */
export function formatDate(date: Date | undefined): string | undefined {
  if (!date) return undefined
  return date.toISOString()
}

/**
 * Parses a date string from the database into a Date object
 */
export function parseDate(dateString: string | null | undefined): Date {
  if (!dateString) return new Date()
  return new Date(dateString)
}

/**
 * Combines a date and time string into a single Date object
 */
export function combineDateAndTime(date: Date, timeString: string): Date {
  const result = new Date(date)
  const [hours, minutes] = timeString.split(":").map(Number)

  result.setHours(hours || 0)
  result.setMinutes(minutes || 0)
  result.setSeconds(0)
  result.setMilliseconds(0)

  return result
}

/**
 * Formats a date for display in the UI
 */
export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString()
}

/**
 * Formats a time for display in the UI
 */
export function formatDisplayTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

