/**
 * Stratos Tracking - Shared Types
 *
 * All type definitions and interfaces used across the tracking system.
 *
 * @module tracking/types
 */

// ========================================
// CONFIGURATION TYPES
// ========================================

export interface TrackerConfig {
  apiUrl: string
  apiKey: string
  trackingEnabled?: boolean
  debug?: boolean
}

export interface RequiredTrackerConfig {
  apiUrl: string
  apiKey: string
  trackingEnabled: boolean
  debug: boolean
}

// ========================================
// EVENT TYPES
// ========================================

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
// SESSION TYPES
// ========================================

export interface SessionData {
  session_id: string
  visitor_id: string
  created_at: string
  last_activity_at: string
  page_views: number
}

export interface ConsentStatus {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  timestamp: string
  version: string
}

// ========================================
// SEARCH TRACKING TYPES
// ========================================

export interface SearchTrackingData {
  // Required fields
  listing_type: 'sale' | 'let' | string
  timestamp: number

  // Location
  location?: string
  postcode?: string

  // Price
  min_price?: number | string
  max_price?: number | string

  // Property details
  bedrooms?: number | string
  bathrooms?: number | string
  property_type?: string

  // Additional filters
  filters: Record<string, any>
  filters_count: number

  // Source
  source_page: string
  source_component: string
}

// ========================================
// BLOG TRACKING TYPES
// ========================================

export interface BlogTrackingData {
  article_id: string
  title?: string
  category?: string
  author?: string
  published_date?: string
  word_count?: number
}

// ========================================
// PROPERTY TRACKING TYPES
// ========================================

export interface PropertyTrackingData {
  property_id: string
  listing_type?: 'sale' | 'let'
  price?: number
  bedrooms?: number
  property_type?: string
  location?: string
  source?: string
}

// ========================================
// INTERACTION TRACKING TYPES
// ========================================

export interface InteractionEventData {
  page_url: string
  property_id?: string
  cta_name?: string
  phone_number?: string
  email_address?: string
  share_method?: string
  filter_name?: string
  filter_value?: any
}

// ========================================
// ENQUIRY TRACKING TYPES
// ========================================

export interface EnquiryTrackingData {
  property_id?: string
  enquiry_type?: 'general' | 'property' | 'viewing' | 'valuation'
  form_location?: string
  has_phone?: boolean
  has_message?: boolean
}

// ========================================
// FAVOURITE TYPES
// ========================================

export interface FavouriteItem {
  property: {
    id: string
    [key: string]: any
  }
  created_at: string
}

export interface FavouriteToggleResult {
  is_favourited: boolean
  property_id: string
  visitor_id: string
}

// ========================================
// STRATOS TRACKER INTERFACE
// ========================================

/**
 * Interface for the StratosTracker instance exposed on window
 * This is used for type checking when accessing window.StratosTracker
 */
export interface StratosTrackerInstance {
  // Core methods
  init: () => void
  trackEvent: (eventType: string, data?: Record<string, any>) => void
  trackSearch: (data: Record<string, any>) => void
  setConsent: (hasConsent: boolean) => void
  hasConsent: () => boolean

  // Page tracking
  trackPageView: (additionalData?: Record<string, any>) => void
  trackSessionEnd: (additionalData?: Record<string, any>) => void

  // Property tracking
  trackPropertyView: (propertyId: string, additionalData?: Record<string, any>) => void
  trackPropertyDuration: (propertyId: string) => void
  setupPropertyDurationTracking: (propertyId: string) => void
  trackVirtualTourClick: (propertyId: string, tourType?: string) => void
  trackMapView: (propertyId: string, mapAction?: string) => void
  trackGalleryView: (propertyId: string, imageIndex?: number, totalImages?: number) => void
  trackSimilarPropertiesClick: (propertyId: string, clickedPropertyId: string, position?: number) => void

  // Blog tracking
  trackBlogView: (articleId: string, additionalData?: Record<string, any>) => void
  trackBlogDuration: (articleId: string) => void
  setupBlogDurationTracking: (articleId: string) => void
  trackBlogShare: (articleId: string, shareMethod: string) => void
  trackBlogLinkClick: (articleId: string, linkUrl: string, linkText?: string) => void
  trackRelatedArticleClick: (articleId: string, relatedArticleId: string, relatedArticleTitle?: string) => void

  // Interaction tracking
  trackPhoneClick: (phoneNumber?: string) => void
  trackEmailClick: (email?: string) => void
  trackFilterChange: (filterName: string, filterValue: any) => void
  trackCtaClick: (ctaName: string, ctaData?: Record<string, any>) => void
  trackShare: (propertyId: string, shareMethod: string) => void

  // Enquiry tracking
  trackEnquiryStarted: (enquiryData?: {
    property_id?: string
    enquiry_type?: 'general' | 'property' | 'viewing' | 'valuation'
    form_location?: string
  }) => void
  trackEnquirySubmitted: (enquiryData?: {
    property_id?: string
    enquiry_type?: 'general' | 'property' | 'viewing' | 'valuation'
    form_location?: string
    has_phone?: boolean
    has_message?: boolean
  }) => void
  setupEnquiryFormTracking: (formSelector: string, options?: {
    property_id?: string
    enquiry_type?: 'general' | 'property' | 'viewing' | 'valuation'
  }) => void

  // Favourites
  toggleFavourite: (propertyId: string, source?: string) => Promise<boolean>
  getFavourites: () => Promise<any[]>
  isFavourited: (propertyId: string) => Promise<boolean>
  getFavouritesCount: () => Promise<number>

  // Session
  getSessionId: () => string
  getVisitorId: () => string
  getSessionDuration: () => number

  // Utils
  setTrackingEnabled: (enabled: boolean) => void
  setDebug: (debug: boolean) => void

  // Internal config access
  config?: {
    apiUrl: string
    apiKey: string
  }
}
