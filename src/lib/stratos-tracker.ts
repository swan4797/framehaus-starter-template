/**
 * Stratos Reach AI - Client-Side Tracker
 *
 * Tracks visitor behavior on estate agent websites and sends events
 * to Stratos Edge Functions for analytics and lead scoring.
 *
 * GDPR COMPLIANCE:
 * - No tracking occurs until explicit consent is given
 * - Tracker checks consent status before every operation
 * - Can be enabled/disabled dynamically based on consent changes
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

import {
  getSessionId,
  getVisitorId,
  hasAnalyticsConsent,
  initSession,
  clearAllTrackingData,
} from './session'

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
  article_id?: string
  event_data?: Record<string, any>
}

// ========================================
// STRATOS TRACKER CLASS
// ========================================

export class StratosTracker {
  private config: Required<TrackerConfig>
  private pageLoadTime: number = 0
  private propertyViewStartTime: number = 0
  private blogViewStartTime: number = 0
  private maxScrollDepth: number = 0
  private sessionStartTime: number = 0
  private isInitialized: boolean = false
  private consentGiven: boolean = false

  constructor(config: TrackerConfig) {
    this.config = {
      trackingEnabled: true,
      debug: false,
      ...config,
    }

    // Check initial consent status
    this.consentGiven = hasAnalyticsConsent()

    if (this.config.debug) {
      console.log('[StratosTracker] Created with config:', this.config)
      console.log('[StratosTracker] Initial consent status:', this.consentGiven)
    }

    // Listen for consent changes
    this.setupConsentListener()
  }

  // ========================================
  // GDPR CONSENT MANAGEMENT
  // ========================================

  /**
   * Listen for consent changes from CookieConsent component
   */
  private setupConsentListener(): void {
    window.addEventListener('cookieConsentUpdated', ((event: CustomEvent) => {
      const consent = event.detail
      const previousConsent = this.consentGiven
      this.consentGiven = consent?.analytics === true

      this.log('Consent updated:', {
        analytics: consent?.analytics,
        marketing: consent?.marketing,
        previousConsent,
        newConsent: this.consentGiven,
      })

      if (this.consentGiven && !previousConsent) {
        // Consent was just given - initialize tracking
        this.log('Consent granted - initializing tracker')
        initSession()
        this.init()
        this.trackPageView()
      } else if (!this.consentGiven && previousConsent) {
        // Consent was revoked - clear all data
        this.log('Consent revoked - clearing tracking data')
        clearAllTrackingData()
        this.isInitialized = false
      }
    }) as EventListener)
  }

  /**
   * Check if tracking is allowed (consent given and tracking enabled)
   */
  private canTrack(): boolean {
    return this.config.trackingEnabled && this.consentGiven
  }

  /**
   * Update consent status manually (called from CookieConsent)
   */
  public setConsent(hasConsent: boolean): void {
    const previousConsent = this.consentGiven
    this.consentGiven = hasConsent

    if (hasConsent && !previousConsent) {
      initSession()
      this.init()
    } else if (!hasConsent) {
      clearAllTrackingData()
      this.isInitialized = false
    }
  }

  /**
   * Check if consent has been given
   */
  public hasConsent(): boolean {
    return this.consentGiven
  }

  // ========================================
  // INITIALIZATION
  // ========================================

  /**
   * Initialize tracker
   * GDPR: Only initializes if consent has been given
   * Call this once when page loads and consent is verified
   */
  public init(): void {
    // Check consent before initializing
    if (!this.consentGiven) {
      this.log('No consent - tracker not initialized')
      return
    }

    if (this.isInitialized) {
      this.log('Already initialized')
      return
    }

    this.pageLoadTime = Date.now()
    this.sessionStartTime = Date.now()
    this.isInitialized = true

    // Set up automatic tracking
    this.setupAutomaticTracking()

    this.log('Tracker initialized with consent')
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
   * GDPR: Only tracks if consent given
   * Call this on every page load
   */
  public trackPageView(additionalData?: Record<string, any>): void {
    if (!this.canTrack()) return

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
    if (!this.canTrack()) return

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
  // BLOG TRACKING
  // ========================================

  /**
   * Track blog view
   * Call this when visitor views a blog article page
   *
   * @param articleId - The blog article ID
   * @param additionalData - Additional event data (title, category, etc.)
   */
  public trackBlogView(articleId: string, additionalData?: Record<string, any>): void {
    if (!this.canTrack()) return

    this.blogViewStartTime = Date.now()
    this.maxScrollDepth = 0

    this.trackEvent('blog_view', {
      article_id: articleId,
      page_url: window.location.href,
      ...additionalData,
    })

    this.log('Blog view tracked:', articleId)
  }

  /**
   * Track blog read time / duration
   * Call this when visitor leaves blog page or manually
   *
   * @param articleId - The blog article ID
   */
  public trackBlogDuration(articleId: string): void {
    if (!this.config.trackingEnabled || !this.blogViewStartTime) return

    const duration = Math.floor((Date.now() - this.blogViewStartTime) / 1000)

    // Only track if they spent at least 5 seconds reading
    if (duration < 5) return

    this.sendBeacon('blog_read_time', {
      article_id: articleId,
      read_duration_seconds: duration,
      max_scroll_depth: this.maxScrollDepth,
      page_url: window.location.href,
    })

    this.log('Blog duration tracked:', articleId, duration, 'seconds')
  }

  /**
   * Set up automatic blog duration tracking
   * Call this on blog pages to automatically track when visitor leaves
   *
   * @param articleId - The blog article ID
   */
  public setupBlogDurationTracking(articleId: string): void {
    this.blogViewStartTime = Date.now()
    this.maxScrollDepth = 0

    const trackDuration = () => {
      this.trackBlogDuration(articleId)
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

    // Track scroll depth
    this.setupScrollDepthTracking(articleId)

    this.log('Blog duration tracking setup for:', articleId)
  }

  /**
   * Track scroll depth for blog articles
   * Automatically called by setupBlogDurationTracking
   *
   * @param articleId - The blog article ID
   */
  private setupScrollDepthTracking(articleId: string): void {
    const trackScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0

      // Track milestone depths (25%, 50%, 75%, 100%)
      const milestones = [25, 50, 75, 100]
      const currentMilestone = milestones.find((m) => scrollPercent >= m && this.maxScrollDepth < m)

      if (currentMilestone && scrollPercent > this.maxScrollDepth) {
        this.maxScrollDepth = scrollPercent
        this.trackEvent('blog_scroll_depth', {
          article_id: articleId,
          scroll_depth: currentMilestone,
          page_url: window.location.href,
        })
        this.log('Blog scroll depth tracked:', articleId, currentMilestone + '%')
      } else if (scrollPercent > this.maxScrollDepth) {
        this.maxScrollDepth = scrollPercent
      }
    }

    window.addEventListener('scroll', trackScroll, { passive: true })
  }

  /**
   * Track blog share
   *
   * @param articleId - The blog article ID
   * @param shareMethod - How the article was shared (twitter, facebook, linkedin, copy_link, email)
   */
  public trackBlogShare(articleId: string, shareMethod: string): void {
    this.trackEvent('blog_share', {
      article_id: articleId,
      share_method: shareMethod,
      page_url: window.location.href,
    })
    this.log('Blog share tracked:', articleId, shareMethod)
  }

  /**
   * Track link click within blog article
   *
   * @param articleId - The blog article ID
   * @param linkUrl - The URL that was clicked
   * @param linkText - The text of the link (optional)
   */
  public trackBlogLinkClick(articleId: string, linkUrl: string, linkText?: string): void {
    this.trackEvent('blog_link_click', {
      article_id: articleId,
      link_url: linkUrl,
      link_text: linkText,
      page_url: window.location.href,
    })
    this.log('Blog link click tracked:', articleId, linkUrl)
  }

  /**
   * Track related article click
   *
   * @param articleId - Current blog article ID
   * @param relatedArticleId - The related article that was clicked
   * @param relatedArticleTitle - Title of the related article (optional)
   */
  public trackRelatedArticleClick(
    articleId: string,
    relatedArticleId: string,
    relatedArticleTitle?: string
  ): void {
    this.trackEvent('blog_related_click', {
      article_id: articleId,
      related_article_id: relatedArticleId,
      related_article_title: relatedArticleTitle,
      page_url: window.location.href,
    })
    this.log('Related article click tracked:', articleId, '->', relatedArticleId)
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
   * Track search - uses beacon to survive page navigation
   */
  public trackSearch(searchData: Record<string, any>): void {
    // Use beacon since search typically triggers navigation
    this.sendBeacon('search', {
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
  if (!this.canTrack()) {
    this.log('Tracking not allowed, skipping favourite toggle')
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
        credentials: 'omit', // Prevent CORS credential issues
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
  if (!this.canTrack()) {
    this.log('Tracking not allowed, skipping get favourites')
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
        credentials: 'omit', // Prevent CORS credential issues
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
    if (!this.canTrack()) {
      this.log('Tracking not allowed (no consent or disabled), skipping event:', eventType)
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

    // Add article_id to top level if present
    if (eventData?.article_id) {
      payload.article_id = eventData.article_id
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
        credentials: 'omit', // Prevent CORS credential issues
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
   *
   * NOTE: sendBeacon cannot send custom headers, so we include the API key
   * as a query parameter for authentication. We use text/plain content type
   * to avoid triggering CORS preflight (application/json requires preflight).
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

    if (eventData?.article_id) {
      payload.article_id = eventData.article_id
    }

    // Include API key as query param since sendBeacon can't set headers
    // Use text/plain to avoid CORS preflight (application/json triggers preflight)
    const url = `${this.config.apiUrl}/functions/v1/track-event?api_key=${encodeURIComponent(this.config.apiKey)}`
    const blob = new Blob([JSON.stringify(payload)], { type: 'text/plain' })

    if (navigator.sendBeacon) {
      const success = navigator.sendBeacon(url, blob)
      this.log('Beacon sent:', eventType, success ? '(success)' : '(failed)')
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