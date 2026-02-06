/**
 * Stratos Tracking - GDPR Consent Management
 *
 * Handles consent state and consent change events for GDPR compliance.
 *
 * @module tracking/core/consent
 */

import type { ConsentStatus } from '../types'

// ========================================
// CONSTANTS
// ========================================

const CONSENT_STORAGE_KEY = 'stratos_cookie_consent'

// ========================================
// CONSENT CHECKING
// ========================================

/**
 * Check if user has given analytics consent
 * This is the primary check for GDPR compliance
 */
export function hasAnalyticsConsent(): boolean {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!stored) return false

    const consent: ConsentStatus = JSON.parse(stored)
    return consent.analytics === true
  } catch (error) {
    return false
  }
}

/**
 * Check if user has given marketing consent
 */
export function hasMarketingConsent(): boolean {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!stored) return false

    const consent: ConsentStatus = JSON.parse(stored)
    return consent.marketing === true
  } catch (error) {
    return false
  }
}

/**
 * Check if any consent decision has been made
 */
export function hasConsentDecision(): boolean {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
    return stored !== null
  } catch (error) {
    return false
  }
}

/**
 * Get full consent status
 */
export function getConsentStatus(): ConsentStatus | null {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored)
  } catch (error) {
    return null
  }
}

// ========================================
// CONSENT LISTENER
// ========================================

export interface ConsentChangeHandler {
  onConsentGranted: () => void
  onConsentRevoked: () => void
}

/**
 * Set up listener for consent changes from CookieConsent component
 */
export function setupConsentListener(
  handlers: ConsentChangeHandler,
  log: (...args: any[]) => void
): void {
  window.addEventListener('cookieConsentUpdated', ((event: CustomEvent) => {
    const consent = event.detail
    const newConsentStatus = consent?.analytics === true

    log('Consent updated:', {
      analytics: consent?.analytics,
      marketing: consent?.marketing,
    })

    if (newConsentStatus) {
      handlers.onConsentGranted()
    } else {
      handlers.onConsentRevoked()
    }
  }) as EventListener)
}
