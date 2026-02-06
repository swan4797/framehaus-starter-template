/**
 * Stratos Tracking - Session Management
 *
 * Handles visitor and session ID generation and storage in localStorage.
 * Session expires after 30 minutes of inactivity.
 *
 * GDPR COMPLIANCE:
 * - No data is stored until explicit consent is given
 * - All functions check consent status before accessing localStorage
 * - Consent status is stored separately from tracking data
 *
 * @module tracking/session
 */

import type { SessionData, ConsentStatus } from '../types'
import { hasAnalyticsConsent, getConsentStatus } from '../core/consent'

// ========================================
// CONSTANTS
// ========================================

const STORAGE_KEYS = {
  SESSION: 'sr_session',
  VISITOR: 'sr_visitor',
} as const

const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes

// ========================================
// UUID GENERATION
// ========================================

/**
 * Generate a UUID v4
 * Uses crypto.randomUUID() if available, otherwise falls back to manual generation
 */
function generateUUID(): string {
  // Modern browsers support crypto.randomUUID()
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// ========================================
// VISITOR ID MANAGEMENT
// ========================================

// In-memory fallback when consent not given
let tempVisitorId: string | null = null

/**
 * Get or create visitor ID
 * GDPR: Only stores to localStorage if analytics consent given
 * Otherwise returns a temporary ID that won't persist
 */
export function getVisitorId(): string {
  // If no analytics consent, use temporary in-memory ID
  if (!hasAnalyticsConsent()) {
    if (!tempVisitorId) {
      tempVisitorId = generateUUID()
    }
    return tempVisitorId
  }

  try {
    let visitorId = localStorage.getItem(STORAGE_KEYS.VISITOR)

    if (!visitorId) {
      visitorId = tempVisitorId || generateUUID()
      localStorage.setItem(STORAGE_KEYS.VISITOR, visitorId)
      console.log('[Session] Created new visitor ID:', visitorId)
    }

    return visitorId
  } catch (error) {
    console.error('[Session] Error getting visitor ID:', error)
    // Return temporary ID if localStorage fails
    if (!tempVisitorId) {
      tempVisitorId = generateUUID()
    }
    return tempVisitorId
  }
}

/**
 * Clear visitor ID (for testing or reset)
 */
export function clearVisitorId(): void {
  tempVisitorId = null
  try {
    localStorage.removeItem(STORAGE_KEYS.VISITOR)
    console.log('[Session] Cleared visitor ID')
  } catch (error) {
    console.error('[Session] Error clearing visitor ID:', error)
  }
}

// ========================================
// SESSION MANAGEMENT
// ========================================

// In-memory session for when consent not given
let tempSession: SessionData | null = null

/**
 * Get current session data from localStorage
 * GDPR: Returns null if no analytics consent
 */
function getStoredSession(): SessionData | null {
  // If no analytics consent, use in-memory session
  if (!hasAnalyticsConsent()) {
    return tempSession
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SESSION)
    if (!stored) return null

    const session: SessionData = JSON.parse(stored)
    return session
  } catch (error) {
    console.error('[Session] Error reading session:', error)
    return null
  }
}

/**
 * Save session data to localStorage
 * GDPR: Only saves if analytics consent given
 */
function saveSession(session: SessionData): void {
  // If no analytics consent, only keep in memory
  if (!hasAnalyticsConsent()) {
    tempSession = session
    return
  }

  try {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session))
    // Also keep in memory
    tempSession = session
  } catch (error) {
    console.error('[Session] Error saving session:', error)
  }
}

/**
 * Check if session has expired (30 minutes of inactivity)
 */
function isSessionExpired(session: SessionData): boolean {
  const lastActivity = new Date(session.last_activity_at).getTime()
  const now = Date.now()
  const timeSinceActivity = now - lastActivity

  return timeSinceActivity > SESSION_TIMEOUT_MS
}

/**
 * Create a new session
 */
function createNewSession(): SessionData {
  const now = new Date().toISOString()
  const visitorId = getVisitorId()

  const session: SessionData = {
    session_id: generateUUID(),
    visitor_id: visitorId,
    created_at: now,
    last_activity_at: now,
    page_views: 0,
  }

  saveSession(session)
  console.log('[Session] Created new session:', session.session_id)

  return session
}

/**
 * Update session activity timestamp and page views
 */
function updateSessionActivity(session: SessionData): SessionData {
  session.last_activity_at = new Date().toISOString()
  session.page_views += 1
  saveSession(session)

  return session
}

/**
 * Get current session ID, creating new session if needed
 */
export function getSessionId(): string {
  const session = getStoredSession()

  // No session exists
  if (!session) {
    return createNewSession().session_id
  }

  // Session expired
  if (isSessionExpired(session)) {
    console.log('[Session] Session expired, creating new session')
    return createNewSession().session_id
  }

  // Update existing session
  updateSessionActivity(session)
  return session.session_id
}

/**
 * Get complete session data
 */
export function getSession(): SessionData | null {
  const session = getStoredSession()

  if (!session) {
    return createNewSession()
  }

  if (isSessionExpired(session)) {
    return createNewSession()
  }

  return updateSessionActivity(session)
}

/**
 * Clear current session (for testing or manual reset)
 */
export function clearSession(): void {
  tempSession = null
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION)
    console.log('[Session] Cleared session')
  } catch (error) {
    console.error('[Session] Error clearing session:', error)
  }
}

/**
 * Clear all tracking data (called when user rejects cookies)
 */
export function clearAllTrackingData(): void {
  tempVisitorId = null
  tempSession = null
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION)
    localStorage.removeItem(STORAGE_KEYS.VISITOR)
    console.log('[Session] Cleared all tracking data')
  } catch (error) {
    console.error('[Session] Error clearing tracking data:', error)
  }
}

/**
 * Initialize session on page load
 * GDPR: Only initializes if analytics consent given
 * Call this once when the page loads and consent is verified
 */
export function initSession(): void {
  if (!hasAnalyticsConsent()) {
    console.log('[Session] No analytics consent - session not initialized')
    return
  }

  // This will create/update session
  getSession()
  console.log('[Session] Session initialized with consent')
}

/**
 * Get session age in milliseconds
 */
export function getSessionAge(): number {
  const session = getStoredSession()
  if (!session) return 0

  const created = new Date(session.created_at).getTime()
  return Date.now() - created
}

/**
 * Get time since last activity in milliseconds
 */
export function getTimeSinceActivity(): number {
  const session = getStoredSession()
  if (!session) return 0

  const lastActivity = new Date(session.last_activity_at).getTime()
  return Date.now() - lastActivity
}

/**
 * Check if this is a new visitor (first session ever)
 */
export function isNewVisitor(): boolean {
  const session = getStoredSession()
  if (!session) return true

  // Check if session was just created (within 10 seconds)
  const created = new Date(session.created_at).getTime()
  const timeSinceCreation = Date.now() - created

  return timeSinceCreation < 10000 && session.page_views <= 1
}

/**
 * Debug: Log current session state
 */
export function debugSession(): void {
  const session = getStoredSession()
  const visitorId = getVisitorId()
  const consent = getConsentStatus()

  console.log('[Session Debug]', {
    has_consent: hasAnalyticsConsent(),
    consent_status: consent,
    visitor_id: visitorId,
    session,
    is_expired: session ? isSessionExpired(session) : null,
    session_age_minutes: session ? (Date.now() - new Date(session.created_at).getTime()) / 60000 : null,
    time_since_activity_minutes: session ? (Date.now() - new Date(session.last_activity_at).getTime()) / 60000 : null,
  })
}

// ========================================
// EXPORT DEFAULT
// ========================================

export default {
  initSession,
  getSessionId,
  getVisitorId,
  getSession,
  clearSession,
  clearVisitorId,
  clearAllTrackingData,
  getSessionAge,
  getTimeSinceActivity,
  isNewVisitor,
  debugSession,
}
