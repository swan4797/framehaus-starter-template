// ========================================
// SESSION MANAGEMENT
// Handle session IDs for tracking
// ========================================

const SESSION_KEY = 'stratos_session_id'
const SESSION_EXPIRY_KEY = 'stratos_session_expiry'
const SESSION_DURATION_MS = 30 * 60 * 1000 // 30 minutes

// ========================================
// SESSION FUNCTIONS
// ========================================

/**
 * Generate a new UUID v4 session ID
 */
function generateSessionId(): string {
  return crypto.randomUUID()
}

/**
 * Get current session ID from localStorage
 * Creates new one if expired or doesn't exist
 */
export function getSessionId(): string {
  try {
    // Check if localStorage is available
    if (typeof window === 'undefined' || !window.localStorage) {
      return generateSessionId()
    }

    const sessionId = localStorage.getItem(SESSION_KEY)
    const expiryStr = localStorage.getItem(SESSION_EXPIRY_KEY)

    // Check if session exists and is not expired
    if (sessionId && expiryStr) {
      const expiry = parseInt(expiryStr, 10)
      if (Date.now() < expiry) {
        // Session is valid, extend expiry
        extendSession()
        return sessionId
      }
    }

    // Create new session
    return createNewSession()
  } catch (error) {
    console.error('Error getting session ID:', error)
    return generateSessionId()
  }
}

/**
 * Create a new session
 */
export function createNewSession(): string {
  try {
    const sessionId = generateSessionId()
    const expiry = Date.now() + SESSION_DURATION_MS

    localStorage.setItem(SESSION_KEY, sessionId)
    localStorage.setItem(SESSION_EXPIRY_KEY, expiry.toString())

    return sessionId
  } catch (error) {
    console.error('Error creating session:', error)
    return generateSessionId()
  }
}

/**
 * Extend current session expiry
 */
export function extendSession(): void {
  try {
    const expiry = Date.now() + SESSION_DURATION_MS
    localStorage.setItem(SESSION_EXPIRY_KEY, expiry.toString())
  } catch (error) {
    console.error('Error extending session:', error)
  }
}

/**
 * Clear current session
 */
export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(SESSION_EXPIRY_KEY)
  } catch (error) {
    console.error('Error clearing session:', error)
  }
}

/**
 * Check if session exists and is valid
 */
export function hasValidSession(): boolean {
  try {
    const sessionId = localStorage.getItem(SESSION_KEY)
    const expiryStr = localStorage.getItem(SESSION_EXPIRY_KEY)

    if (!sessionId || !expiryStr) return false

    const expiry = parseInt(expiryStr, 10)
    return Date.now() < expiry
  } catch (error) {
    return false
  }
}

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize session management
 * Call this once when the page loads
 */
export function initSessionManagement(): string {
  return getSessionId()
}