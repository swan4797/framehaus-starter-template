/**
 * Stratos Reach AI - Client-Side Tracker
 * 
 * Tracks visitor behavior on estate agent websites and sends events
 * to Stratos Edge Functions for analytics and lead scoring.
 * 
 * Features:
 * - Page view tracking
 * - Property view tracking with duration
 * - Session management
 * - Event tracking (clicks, searches, etc.)
 * - Automatic session duration calculation
 * 
 * @module stratos-tracker
 */

import { getSessionId, getVisitorId } from './session'

// ========================================
// TYPES
// ========================================

export interface TrackerConfig {
  apiUrl: string
  apiKey: string
  trackingEnabled?: boolean
  debug?: boolean
}

export interface EventData {
  event_type: string
  session_id: string
  visitor_id: string
  page_url: string
  page_title?: string
  referrer?: string
  property_id?: string
  event_data?: Record<string, any>
}

// ========================================
// STRATOS TRACKER CLASS
// ========================================

export class StratosTracker {
  private config: Required<TrackerConfig>
  private pageLoadTime: number = 0
  private propertyViewStartTime: number = 0
  private sessionStartTime: number = 0
  private isInitialized: boolean = false

  constructor(config: TrackerConfig) {
    this.config = {
      trackingEnabled: true,
      debug: false,
      ...config,
    }

    if (this.config.debug) {
      console.log('[StratosTracker] Initialized with config:', this.config)
    }
  }

  // ========================================
  // INITIALIZATION
  // ========================================

  /**
   * Initialize tracker
   * Call this once when page loads
   */
  public init(): void {
    if (this.isInitialized) {
      this.log('Already initialized')
      return
    }

    this.pageLoadTime = Date.now()
    this.sessionStartTime = Date.now()
    this.isInitialized = true

    // Set up automatic tracking
    this.setupAutomaticTracking()

    this.log('Tracker initialized')
  }

  /**
   * Set up automatic tracking for page duration, exits, etc.
   */
  private setupAutomaticTracking(): void {
    // Track page exit
    window.addEventListener('beforeunload', () => {
      this.trackPageExit()
    })

    // Also track on page hide (for mobile)
    window.addEventListener('pagehide', () => {
      this.trackPageExit()
    })

    // Track visibility changes (tab switching)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.trackPageExit()
      }
    })
  }

  // ========================================
  // PAGE TRACKING
  // ========================================

  /**
   * Track page view
   * Call this on every page load
   */
  public trackPageView(additionalData?: Record<string, any>): void {
    if (!this.config.trackingEnabled) return

    this.trackEvent('page_view', {
      page_url: window.location.href,
      page_title: document.title,
      referrer: document.referrer || undefined,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      ...additionalData,
    })
  }

  /**
   * Track page exit (sends time on page)
   */
  private trackPageExit(): void {
    if (!this.config.trackingEnabled || !this.pageLoadTime) return

    const timeOnPage = Math.floor((Date.now() - this.pageLoadTime) / 1000)

    // Only track if they spent at least 3 seconds
    if (timeOnPage < 3) return

    // Use sendBeacon for reliable exit tracking
    this.sendBeacon('page_exit', {
      page_url: window.location.href,
      time_on_page_seconds: timeOnPage,
    })
  }

  // ========================================
  // PROPERTY TRACKING
  // ========================================

  /**
   * Track property view
   * Call this when visitor views a property page
   * 
   * @param propertyId - The property ID
   * @param additionalData - Additional event data
   */
  public trackPropertyView(propertyId: string, additionalData?: Record<string, any>): void {
    if (!this.config.trackingEnabled) return

    this.propertyViewStartTime = Date.now()

    this.trackEvent('property_view', {
      property_id: propertyId,
      page_url: window.location.href,
      ...additionalData,
    })

    this.log('Property view tracked:', propertyId)
  }

  /**
   * Track property view duration
   * Call this when visitor leaves property page or manually
   * 
   * @param propertyId - The property ID
   */
  public trackPropertyDuration(propertyId: string): void {
    if (!this.config.trackingEnabled || !this.propertyViewStartTime) return

    const duration = Math.floor((Date.now() - this.propertyViewStartTime) / 1000)

    // Only track if they spent at least 3 seconds
    if (duration < 3) return

    this.sendBeacon('property_view', {
      property_id: propertyId,
      view_duration_seconds: duration,
      page_url: window.location.href,
    })

    this.log('Property duration tracked:', propertyId, duration, 'seconds')
  }

  /**
   * Set up automatic property duration tracking
   * Call this on property pages to automatically track when visitor leaves
   * 
   * @param propertyId - The property ID
   */
  public setupPropertyDurationTracking(propertyId: string): void {
    this.propertyViewStartTime = Date.now()

    const trackDuration = () => {
      this.trackPropertyDuration(propertyId)
    }

    // Track on page exit
    window.addEventListener('beforeunload', trackDuration)
    window.addEventListener('pagehide', trackDuration)

    // Track on visibility change (tab switch)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        trackDuration()
      }
    })

    this.log('Property duration tracking setup for:', propertyId)
  }

  // ========================================
  // INTERACTION TRACKING
  // ========================================

  /**
   * Track phone click
   */
  public trackPhoneClick(phoneNumber?: string): void {
    this.trackEvent('phone_click', {
      phone_number: phoneNumber,
      page_url: window.location.href,
    })
  }

  /**
   * Track email click
   */
  public trackEmailClick(email?: string): void {
    this.trackEvent('email_click', {
      email_address: email,
      page_url: window.location.href,
    })
  }

  /**
   * Track search
   */
  public trackSearch(searchData: Record<string, any>): void {
    this.trackEvent('search', {
      page_url: window.location.href,
      search_params: searchData,
    })
  }

  /**
   * Track filter change
   */
  public trackFilterChange(filterName: string, filterValue: any): void {
    this.trackEvent('filter_change', {
      page_url: window.location.href,
      filter_name: filterName,
      filter_value: filterValue,
    })
  }

  /**
   * Track CTA click (Call to Action)
   */
  public trackCtaClick(ctaName: string, ctaData?: Record<string, any>): void {
    this.trackEvent('cta_click', {
      page_url: window.location.href,
      cta_name: ctaName,
      ...ctaData,
    })
  }

// ========================================
// FAVOURITES METHODS
// ========================================

/**
 * Toggle favourite (add/remove)
 * Returns true if now favourited, false if unfavourited
 */
public async toggleFavourite(
  propertyId: string,
  source: string = 'unknown'
): Promise<boolean> {
  if (!this.config.trackingEnabled) {
    this.log('Tracking disabled, skipping favourite toggle')
    return false
  }

  const visitorId = getVisitorId()
  const sessionId = getSessionId()

  try {
    // Check current state
    const isFavourited = await this.isFavourited(propertyId)
    const action = isFavourited ? 'unfavourite' : 'favourite'

    this.log('Toggling favourite:', action, propertyId)

    // Call API
    const response = await fetch(
      `${this.config.apiUrl}/functions/v1/toggle-favourite`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
        },
        body: JSON.stringify({
          visitor_id: visitorId,
          session_id: sessionId,
          property_id: propertyId,
          action,
          source,
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('[StratosTracker] Toggle favourite failed:', error)
      return isFavourited // Return current state on error
    }

    const result = await response.json()
    this.log('Favourite toggled:', result)

    // Track as event for analytics
    this.trackEvent(
      action === 'favourite' ? 'property_favourited' : 'property_unfavourited',
      {
        property_id: propertyId,
        source,
      }
    )

    return result.is_favourited
  } catch (error) {
    console.error('[StratosTracker] Error toggling favourite:', error)
    return false
  }
}

/**
 * Get all favourites for current visitor
 */
public async getFavourites(): Promise<any[]> {
  if (!this.config.trackingEnabled) {
    this.log('Tracking disabled, skipping get favourites')
    return []
  }

  const visitorId = getVisitorId()

  try {
    this.log('Getting favourites for visitor:', visitorId)

    const response = await fetch(
      `${this.config.apiUrl}/functions/v1/get-favourites?visitor_id=${visitorId}`,
      {
        method: 'GET',
        headers: {
          'x-api-key': this.config.apiKey,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('[StratosTracker] Get favourites failed:', error)
      return []
    }

    const result = await response.json()
    this.log('Favourites retrieved:', result.count)

    return result.favourites || []
  } catch (error) {
    console.error('[StratosTracker] Error getting favourites:', error)
    return []
  }
}

/**
 * Check if a property is favourited
 */
public async isFavourited(propertyId: string): Promise<boolean> {
  try {
    const favourites = await this.getFavourites()
    return favourites.some((f) => f.property.id === propertyId)
  } catch (error) {
    console.error('[StratosTracker] Error checking favourite status:', error)
    return false
  }
}

/**
 * Get favourites count
 */
public async getFavouritesCount(): Promise<number> {
  try {
    const favourites = await this.getFavourites()
    return favourites.length
  } catch (error) {
    console.error('[StratosTracker] Error getting favourites count:', error)
    return 0
  }
}

  /**
   * Track share
   */
  public trackShare(propertyId: string, shareMethod: string): void {
    this.trackEvent('share', {
      property_id: propertyId,
      share_method: shareMethod,
      page_url: window.location.href,
    })
  }

  // ========================================
  // GENERIC EVENT TRACKING
  // ========================================

  /**
   * Track custom event
   * 
   * @param eventType - Event type (e.g., 'page_view', 'property_view')
   * @param eventData - Event data
   */
  public trackEvent(eventType: string, eventData?: Record<string, any>): void {
    if (!this.config.trackingEnabled) {
      this.log('Tracking disabled, skipping event:', eventType)
      return
    }

    const sessionId = getSessionId()
    const visitorId = getVisitorId()

    const payload: EventData = {
      event_type: eventType,
      session_id: sessionId,
      visitor_id: visitorId,
      page_url: window.location.href,
      page_title: document.title,
      referrer: document.referrer || undefined,
      event_data: eventData,
    }

    // Add property_id to top level if present
    if (eventData?.property_id) {
      payload.property_id = eventData.property_id
    }

    this.sendEvent(payload)
  }

  // ========================================
  // API COMMUNICATION
  // ========================================

  /**
   * Send event to Stratos API
   */
  private async sendEvent(payload: EventData): Promise<void> {
    try {
      const url = `${this.config.apiUrl}/functions/v1/track-event`
      
      this.log('Sending event:', payload.event_type, payload)

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('[StratosTracker] Event failed:', error)
        return
      }

      const result = await response.json()
      this.log('Event sent successfully:', result)
    } catch (error) {
      console.error('[StratosTracker] Error sending event:', error)
    }
  }

  /**
   * Send event using sendBeacon (for page exit events)
   * More reliable than fetch for unload events
   */
  private sendBeacon(eventType: string, eventData?: Record<string, any>): void {
    const sessionId = getSessionId()
    const visitorId = getVisitorId()

    const payload: EventData = {
      event_type: eventType,
      session_id: sessionId,
      visitor_id: visitorId,
      page_url: window.location.href,
      page_title: document.title,
      event_data: eventData,
    }

    if (eventData?.property_id) {
      payload.property_id = eventData.property_id
    }

    const url = `${this.config.apiUrl}/functions/v1/track-event`
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })

    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, blob)
      this.log('Beacon sent:', eventType)
    } else {
      // Fallback for browsers without sendBeacon
      this.sendEvent(payload)
    }
  }

  // ========================================
  // SESSION MANAGEMENT
  // ========================================

  /**
   * Get current session ID
   */
  public getSessionId(): string {
    return getSessionId()
  }

  /**
   * Get current visitor ID
   */
  public getVisitorId(): string {
    return getVisitorId()
  }

  /**
   * Calculate session duration in seconds
   */
  public getSessionDuration(): number {
    if (!this.sessionStartTime) return 0
    return Math.floor((Date.now() - this.sessionStartTime) / 1000)
  }

  // ========================================
  // UTILITIES
  // ========================================

  /**
   * Enable/disable tracking
   */
  public setTrackingEnabled(enabled: boolean): void {
    this.config.trackingEnabled = enabled
    this.log('Tracking', enabled ? 'enabled' : 'disabled')
  }

  /**
   * Enable/disable debug logging
   */
  public setDebug(debug: boolean): void {
    this.config.debug = debug
  }

  /**
   * Log message (only if debug enabled)
   */
  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[StratosTracker]', ...args)
    }
  }
}

// ========================================
// CONVENIENCE FUNCTIONS
// ========================================

/**
 * Create and initialize tracker
 * 
 * @param config - Tracker configuration
 * @returns Tracker instance
 */
export function createTracker(config: TrackerConfig): StratosTracker {
  const tracker = new StratosTracker(config)
  tracker.init()
  return tracker
}

/**
 * Get global tracker instance
 * Useful for accessing tracker from inline scripts
 */
export function getGlobalTracker(): StratosTracker | undefined {
  return (window as any).StratosTracker
}

// ========================================
// EXPORT DEFAULT
// ========================================

export default StratosTracker