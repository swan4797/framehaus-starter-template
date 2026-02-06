/**
 * Session Management for Stratos Reach AI
 *
 * BACKWARD COMPATIBILITY RE-EXPORT
 *
 * This file re-exports from the new modular tracking system.
 * The actual implementation has been moved to src/lib/tracking/session/
 *
 * For new code, prefer importing directly from:
 * - import { initSession, getSessionId } from '../lib/tracking'
 * - import { initSession } from '../lib/tracking/session'
 *
 * @module session
 * @deprecated Import from './tracking' instead
 */

// Re-export session functions
export {
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
} from './tracking/session'

// Re-export consent functions (these were in the original session.ts)
export {
  hasAnalyticsConsent,
  hasMarketingConsent,
  hasConsentDecision,
  getConsentStatus,
} from './tracking/core/consent'

// Re-export types
export type {
  SessionData,
  ConsentStatus,
} from './tracking/types'

// Default export for backward compatibility
// Re-export the session module default and add consent functions
import sessionDefault from './tracking/session'
import {
  hasAnalyticsConsent as _hasAnalyticsConsent,
  hasMarketingConsent as _hasMarketingConsent,
  hasConsentDecision as _hasConsentDecision,
  getConsentStatus as _getConsentStatus,
} from './tracking/core/consent'

export default {
  ...sessionDefault,
  hasAnalyticsConsent: _hasAnalyticsConsent,
  hasMarketingConsent: _hasMarketingConsent,
  hasConsentDecision: _hasConsentDecision,
  getConsentStatus: _getConsentStatus,
}
