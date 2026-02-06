/**
 * Stratos Tracking System
 *
 * Modular, GDPR-compliant tracking system for estate agent websites.
 *
 * Structure:
 * - core/          Core tracker class, API communication, consent management
 * - modules/       Domain-specific tracking (page, property, blog, etc.)
 * - session/       Session and visitor management
 * - types.ts       Shared type definitions
 *
 * @module tracking
 */

// ========================================
// CORE EXPORTS
// ========================================

// Main tracker class
export { StratosTracker, createTracker, getGlobalTracker } from './core/StratosTracker'

// API communication
export { sendEvent, sendBeacon, buildEventPayload } from './core/api'

// Consent management
export {
  hasAnalyticsConsent,
  hasMarketingConsent,
  hasConsentDecision,
  getConsentStatus,
  setupConsentListener,
} from './core/consent'

// ========================================
// SESSION EXPORTS
// ========================================

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
} from './session'

// ========================================
// MODULE EXPORTS
// ========================================

// Page tracking
export * as pageTracking from './modules/page'

// Property tracking
export * as propertyTracking from './modules/property'

// Blog tracking
export * as blogTracking from './modules/blog'

// Interaction tracking
export * as interactionTracking from './modules/interactions'

// Favourites
export * as favouritesModule from './modules/favourites'

// Enquiry tracking
export * as enquiryTracking from './modules/enquiry'

// Search tracking
export {
  storeSearchForTracking,
  sendPendingSearchEvent,
  extractSearchParamsFromUrl,
} from './modules/search'

// ========================================
// CONSTANTS EXPORTS
// ========================================

export {
  GENERAL_EVENTS,
  PROPERTY_EVENTS,
  BLOG_EVENTS,
  EVENT_TYPES,
  VALID_EVENT_TYPES,
  EVENT_FIELDS,
  ENQUIRY_TYPES,
  LISTING_TYPES,
} from './constants'

export type { EventType, EnquiryType, ListingType } from './constants'

// ========================================
// TYPE EXPORTS
// ========================================

export type {
  TrackerConfig,
  RequiredTrackerConfig,
  EventData,
  SessionData,
  ConsentStatus,
  SearchTrackingData,
  BlogTrackingData,
  PropertyTrackingData,
  InteractionEventData,
  EnquiryTrackingData,
  FavouriteItem,
  FavouriteToggleResult,
  StratosTrackerInstance,
} from './types'

// ========================================
// DEFAULT EXPORT
// ========================================

export { StratosTracker as default } from './core/StratosTracker'
