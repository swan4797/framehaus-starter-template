/**
 * Stratos Reach AI - Client-Side Tracker
 *
 * Main tracker class that composes all tracking modules together.
 * Tracks visitor behavior on estate agent websites and sends events
 * to Stratos Edge Functions for analytics and lead scoring.
 *
 * GDPR COMPLIANCE:
 * - No tracking occurs until explicit consent is given
 * - Tracker checks consent status before every operation
 * - Can be enabled/disabled dynamically based on consent changes
 *
 * @module tracking/core/StratosTracker
 */

import type { TrackerConfig, RequiredTrackerConfig, EventData } from '../types'
import { hasAnalyticsConsent, setupConsentListener } from './consent'
import { sendEvent, buildEventPayload } from './api'
import {
  initSession,
  getSessionId,
  getVisitorId,
  clearAllTrackingData,
} from '../session'

// Import tracking modules
import * as pageTracking from '../modules/page'
import * as propertyTracking from '../modules/property'
import * as blogTracking from '../modules/blog'
import * as interactionTracking from '../modules/interactions'
import * as favouritesModule from '../modules/favourites'
import * as enquiryTracking from '../modules/enquiry'

// ========================================
// STRATOS TRACKER CLASS
// ========================================

export class StratosTracker {
  private config: RequiredTrackerConfig
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
    const previousConsent = { value: this.consentGiven }

    setupConsentListener(
      {
        onConsentGranted: () => {
          if (!previousConsent.value) {
            this.consentGiven = true
            previousConsent.value = true
            this.log('Consent granted - initializing tracker')
            initSession()
            this.init()
            this.trackPageView()
          }
        },
        onConsentRevoked: () => {
          if (previousConsent.value) {
            this.consentGiven = false
            previousConsent.value = false
            this.log('Consent revoked - clearing tracking data')
            clearAllTrackingData()
            this.isInitialized = false
          }
        },
      },
      this.log.bind(this)
    )
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
   */
  public init(): void {
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
    pageTracking.setupPageExitTracking(
      this.config,
      () => this.pageLoadTime,
      this.log.bind(this)
    )
  }

  // ========================================
  // PAGE TRACKING
  // ========================================

  /**
   * Track page view
   */
  public trackPageView(additionalData?: Record<string, any>): void {
    if (!this.canTrack()) return
    pageTracking.trackPageView(this.config, this.log.bind(this), additionalData)
  }

  // ========================================
  // PROPERTY TRACKING
  // ========================================

  /**
   * Track property view
   */
  public trackPropertyView(propertyId: string, additionalData?: Record<string, any>): void {
    if (!this.canTrack()) return
    this.propertyViewStartTime = Date.now()
    propertyTracking.trackPropertyView(this.config, propertyId, this.log.bind(this), additionalData)
  }

  /**
   * Track property view duration
   */
  public trackPropertyDuration(propertyId: string): void {
    if (!this.config.trackingEnabled || !this.propertyViewStartTime) return
    propertyTracking.trackPropertyDuration(
      this.config,
      propertyId,
      this.propertyViewStartTime,
      this.log.bind(this)
    )
  }

  /**
   * Set up automatic property duration tracking
   */
  public setupPropertyDurationTracking(propertyId: string): void {
    this.propertyViewStartTime = Date.now()
    propertyTracking.setupPropertyDurationTracking(
      this.config,
      propertyId,
      () => this.propertyViewStartTime,
      this.log.bind(this)
    )
  }

  /**
   * Track virtual tour click
   */
  public trackVirtualTourClick(propertyId: string, tourType?: string): void {
    if (!this.canTrack()) return
    propertyTracking.trackVirtualTourClick(this.config, propertyId, this.log.bind(this), tourType)
  }

  /**
   * Track map view interaction
   */
  public trackMapView(propertyId: string, mapAction?: string): void {
    if (!this.canTrack()) return
    propertyTracking.trackMapView(this.config, propertyId, this.log.bind(this), mapAction)
  }

  /**
   * Track gallery view interaction
   */
  public trackGalleryView(propertyId: string, imageIndex?: number, totalImages?: number): void {
    if (!this.canTrack()) return
    propertyTracking.trackGalleryView(this.config, propertyId, this.log.bind(this), imageIndex, totalImages)
  }

  /**
   * Track similar properties click
   */
  public trackSimilarPropertiesClick(propertyId: string, clickedPropertyId: string, position?: number): void {
    if (!this.canTrack()) return
    propertyTracking.trackSimilarPropertiesClick(this.config, propertyId, clickedPropertyId, this.log.bind(this), position)
  }

  // ========================================
  // BLOG TRACKING
  // ========================================

  /**
   * Track blog view
   */
  public trackBlogView(articleId: string, additionalData?: Record<string, any>): void {
    if (!this.canTrack()) return
    this.blogViewStartTime = Date.now()
    this.maxScrollDepth = 0
    blogTracking.trackBlogView(this.config, articleId, this.log.bind(this), additionalData)
  }

  /**
   * Track blog read time / duration
   */
  public trackBlogDuration(articleId: string): void {
    if (!this.config.trackingEnabled || !this.blogViewStartTime) return
    blogTracking.trackBlogDuration(
      this.config,
      articleId,
      this.blogViewStartTime,
      this.maxScrollDepth,
      this.log.bind(this)
    )
  }

  /**
   * Set up automatic blog duration tracking
   */
  public setupBlogDurationTracking(articleId: string): void {
    this.blogViewStartTime = Date.now()
    this.maxScrollDepth = 0

    // Set up scroll tracking and get the getter for maxScrollDepth
    const { getMaxScrollDepth } = blogTracking.setupScrollDepthTracking(
      this.config,
      articleId,
      this.log.bind(this)
    )

    // Update local maxScrollDepth when needed
    const updateMaxScrollDepth = () => {
      this.maxScrollDepth = getMaxScrollDepth()
    }

    // Set up duration tracking
    blogTracking.setupBlogDurationTracking(
      this.config,
      articleId,
      () => this.blogViewStartTime,
      () => {
        updateMaxScrollDepth()
        return this.maxScrollDepth
      },
      this.log.bind(this)
    )
  }

  /**
   * Track blog share
   */
  public trackBlogShare(articleId: string, shareMethod: string): void {
    if (!this.canTrack()) return
    blogTracking.trackBlogShare(this.config, articleId, shareMethod, this.log.bind(this))
  }

  /**
   * Track link click within blog article
   */
  public trackBlogLinkClick(articleId: string, linkUrl: string, linkText?: string): void {
    if (!this.canTrack()) return
    blogTracking.trackBlogLinkClick(this.config, articleId, linkUrl, this.log.bind(this), linkText)
  }

  /**
   * Track related article click
   */
  public trackRelatedArticleClick(
    articleId: string,
    relatedArticleId: string,
    relatedArticleTitle?: string
  ): void {
    if (!this.canTrack()) return
    blogTracking.trackRelatedArticleClick(
      this.config,
      articleId,
      relatedArticleId,
      this.log.bind(this),
      relatedArticleTitle
    )
  }

  // ========================================
  // INTERACTION TRACKING
  // ========================================

  /**
   * Track phone click
   */
  public trackPhoneClick(phoneNumber?: string): void {
    if (!this.canTrack()) return
    interactionTracking.trackPhoneClick(this.config, this.log.bind(this), phoneNumber)
  }

  /**
   * Track email click
   */
  public trackEmailClick(email?: string): void {
    if (!this.canTrack()) return
    interactionTracking.trackEmailClick(this.config, this.log.bind(this), email)
  }

  /**
   * Track search - uses beacon to survive page navigation
   */
  public trackSearch(searchData: Record<string, any>): void {
    if (!this.canTrack()) return
    interactionTracking.trackSearch(this.config, searchData, this.log.bind(this))
  }

  /**
   * Track filter change
   */
  public trackFilterChange(filterName: string, filterValue: any): void {
    if (!this.canTrack()) return
    interactionTracking.trackFilterChange(this.config, filterName, filterValue, this.log.bind(this))
  }

  /**
   * Track CTA click (Call to Action)
   */
  public trackCtaClick(ctaName: string, ctaData?: Record<string, any>): void {
    if (!this.canTrack()) return
    interactionTracking.trackCtaClick(this.config, ctaName, this.log.bind(this), ctaData)
  }

  /**
   * Track share
   */
  public trackShare(propertyId: string, shareMethod: string): void {
    if (!this.canTrack()) return
    interactionTracking.trackShare(this.config, propertyId, shareMethod, this.log.bind(this))
  }

  // ========================================
  // ENQUIRY TRACKING
  // ========================================

  /**
   * Track enquiry form started
   */
  public trackEnquiryStarted(enquiryData?: {
    property_id?: string
    enquiry_type?: 'general' | 'property' | 'viewing' | 'valuation'
    form_location?: string
  }): void {
    if (!this.canTrack()) return
    enquiryTracking.trackEnquiryStarted(this.config, this.log.bind(this), enquiryData)
  }

  /**
   * Track enquiry form submitted
   */
  public trackEnquirySubmitted(enquiryData?: {
    property_id?: string
    enquiry_type?: 'general' | 'property' | 'viewing' | 'valuation'
    form_location?: string
    has_phone?: boolean
    has_message?: boolean
  }): void {
    if (!this.canTrack()) return
    enquiryTracking.trackEnquirySubmitted(this.config, this.log.bind(this), enquiryData)
  }

  /**
   * Set up automatic enquiry form tracking
   */
  public setupEnquiryFormTracking(formSelector: string, options?: {
    property_id?: string
    enquiry_type?: 'general' | 'property' | 'viewing' | 'valuation'
  }): void {
    if (!this.canTrack()) return
    enquiryTracking.setupEnquiryFormTracking(this.config, formSelector, this.log.bind(this), options)
  }

  // ========================================
  // SESSION TRACKING
  // ========================================

  /**
   * Track session end
   */
  public trackSessionEnd(additionalData?: Record<string, any>): void {
    if (!this.config.trackingEnabled) return
    pageTracking.trackSessionEnd(this.config, this.sessionStartTime, this.log.bind(this), additionalData)
  }

  // ========================================
  // FAVOURITES METHODS
  // ========================================

  /**
   * Toggle favourite (add/remove)
   */
  public async toggleFavourite(propertyId: string, source: string = 'unknown'): Promise<boolean> {
    if (!this.canTrack()) {
      this.log('Tracking not allowed, skipping favourite toggle')
      return false
    }
    return favouritesModule.toggleFavourite(this.config, propertyId, this.log.bind(this), source)
  }

  /**
   * Get all favourites for current visitor
   */
  public async getFavourites(): Promise<any[]> {
    if (!this.canTrack()) {
      this.log('Tracking not allowed, skipping get favourites')
      return []
    }
    return favouritesModule.getFavourites(this.config, this.log.bind(this))
  }

  /**
   * Check if a property is favourited
   */
  public async isFavourited(propertyId: string): Promise<boolean> {
    if (!this.canTrack()) return false
    return favouritesModule.isFavourited(this.config, propertyId, this.log.bind(this))
  }

  /**
   * Get favourites count
   */
  public async getFavouritesCount(): Promise<number> {
    if (!this.canTrack()) return 0
    return favouritesModule.getFavouritesCount(this.config, this.log.bind(this))
  }

  // ========================================
  // GENERIC EVENT TRACKING
  // ========================================

  /**
   * Track custom event
   */
  public trackEvent(eventType: string, eventData?: Record<string, any>): void {
    if (!this.canTrack()) {
      this.log('Tracking not allowed (no consent or disabled), skipping event:', eventType)
      return
    }

    const payload = buildEventPayload(eventType, eventData)
    sendEvent(this.config, payload, this.log.bind(this))
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
 */
export function createTracker(config: TrackerConfig): StratosTracker {
  const tracker = new StratosTracker(config)
  tracker.init()
  return tracker
}

/**
 * Get global tracker instance
 */
export function getGlobalTracker(): StratosTracker | undefined {
  return (window as any).StratosTracker
}

export default StratosTracker
