// ========================================
// STRATOS TRACKER (TypeScript)
// Client-side tracking for property views and events
// This script is loaded on every page
// ========================================

// ========================================
// IMPORTS
// ========================================
import { getSessionId, extendSession } from './session'

// ========================================
// TYPES & INTERFACES
// ========================================

interface TrackerConfig {
  apiUrl: string
  apiKey: string
  trackingEnabled: boolean
}

interface UTMParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

interface TrackingEventPayload {
  event_type: string
  session_id: string
  timestamp: string
  page_url: string
  page_path: string
  page_title?: string
  referrer?: string
  property_id?: string
  search_params?: Record<string, any>
  results_count?: number
  [key: string]: any // Allow additional custom properties
}

interface StratosTrackerAPI {
  trackEvent: (eventType: string, data?: Record<string, any>) => Promise<void>
  getSessionId: () => string
}

// Extend Window interface to include our tracker
declare global {
  interface Window {
    STRATOS_API_URL?: string
    STRATOS_API_KEY?: string
    StratosTracker?: StratosTrackerAPI
  }
}

// ========================================
// MAIN TRACKER CLASS
// ========================================

class StratosTracker {
  private config: TrackerConfig

  constructor() {
    // Initialize configuration
    this.config = {
      apiUrl: window.STRATOS_API_URL || '',
      apiKey: window.STRATOS_API_KEY || '',
      trackingEnabled: true,
    }

    // Check if tracking is enabled
    if (!this.config.trackingEnabled || !this.config.apiUrl || !this.config.apiKey) {
      console.warn('Stratos Tracker: Tracking disabled or not configured')
      this.config.trackingEnabled = false
    }
  }

  // ========================================
  // TRACKING
  // ========================================

  private extractUTMParams(): UTMParams {
    const params = new URLSearchParams(window.location.search)
    return {
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
      utm_content: params.get('utm_content') || undefined,
      utm_term: params.get('utm_term') || undefined,
    }
  }

  public async trackEvent(eventType: string, data: Record<string, any> = {}): Promise<void> {
    if (!this.config.trackingEnabled) {
      return
    }

    try {
      // Get session ID and extend session on activity
      const sessionId = getSessionId()
      extendSession()

      const utmParams = this.extractUTMParams()

      const payload: TrackingEventPayload = {
        event_type: eventType,
        session_id: sessionId,
        timestamp: new Date().toISOString(),
        page_url: window.location.href,
        page_path: window.location.pathname,
        page_title: document.title,
        referrer: document.referrer || undefined,
        ...utmParams,
        ...data,
      }

      const response = await fetch(`${this.config.apiUrl}/functions/v1/track-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        console.warn('Stratos Tracker: Tracking failed', response.status)
      }
    } catch (error) {
      console.error('Stratos Tracker: Error tracking event', error)
    }
  }

  // ========================================
  // PAGE VIEW TRACKING
  // ========================================

  private trackPageView(): void {
    this.trackEvent('page_view', {})
  }

  // ========================================
  // PROPERTY TRACKING
  // ========================================

  private extractPropertyId(): string | null {
    // Extract from URL: /properties/[postcode]/[slug]-[id]
    const match = window.location.pathname.match(/\/properties\/[^\/]+\/[^\/]+-([a-f0-9-]{36})$/i)
    return match ? match[1] : null
  }

  private trackPropertyView(): void {
    const propertyId = this.extractPropertyId()
    if (propertyId) {
      this.trackEvent('property_view', { property_id: propertyId })
    }
  }

  // ========================================
  // SEARCH TRACKING
  // ========================================

  private trackPropertySearch(): void {
    // Only track if we're on search page with params
    if (window.location.pathname === '/search' && window.location.search) {
      const params = new URLSearchParams(window.location.search)
      const searchParams: Record<string, string> = {}

      params.forEach((value, key) => {
        searchParams[key] = value
      })

      // Count results if available
      const resultsElement = document.querySelector('[data-results-count]')
      const resultsCount = resultsElement 
        ? parseInt(resultsElement.textContent || '0', 10) 
        : undefined

      this.trackEvent('property_search', {
        search_params: searchParams,
        results_count: resultsCount,
      })
    }
  }

  // ========================================
  // INITIALIZATION
  // ========================================

  public init(): void {
    if (!this.config.trackingEnabled) {
      return
    }

    // Initialize session (creates new session if needed)
    getSessionId()

    // Track page view
    this.trackPageView()

    // Track property-specific events
    if (window.location.pathname.startsWith('/properties/')) {
      this.trackPropertyView()
    }

    // Track search
    if (window.location.pathname === '/search') {
      this.trackPropertySearch()
    }

    // Track session end on page unload (optional)
    window.addEventListener('beforeunload', () => {
      // We don't track session_end here as it would fire on every navigation
      // Session expiry is handled by the timeout mechanism
    })
  }

  // ========================================
  // PUBLIC API
  // ========================================

  public getPublicAPI(): StratosTrackerAPI {
    return {
      trackEvent: this.trackEvent.bind(this),
      getSessionId: getSessionId, // Use imported function directly
    }
  }
}

// ========================================
// INITIALIZATION
// ========================================

(function() {
  'use strict'

  const tracker = new StratosTracker()

  // Expose public API
  window.StratosTracker = tracker.getPublicAPI()

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => tracker.init())
  } else {
    tracker.init()
  }
})()

// Export for module usage (if needed)
export {}