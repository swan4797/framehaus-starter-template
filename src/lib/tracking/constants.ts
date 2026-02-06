/**
 * Stratos Tracking - Event Type Constants
 *
 * This file defines all valid event types that can be sent to the Stratos API.
 * Keep this in sync with the Stratos server validEventTypes array in:
 * /supabase/functions/track-event/index.ts
 *
 * @module tracking/constants
 */

// ========================================
// EVENT TYPE CATEGORIES
// ========================================

/**
 * General page and interaction events
 */
export const GENERAL_EVENTS = {
  PAGE_VIEW: 'page_view',
  PAGE_EXIT: 'page_exit',
  SEARCH: 'search',
  FILTER_CHANGE: 'filter_change',
  PHONE_CLICK: 'phone_click',
  EMAIL_CLICK: 'email_click',
  CTA_CLICK: 'cta_click',
  SHARE: 'share',
  FAVORITE: 'favorite',
  SESSION_END: 'session_end',
} as const

/**
 * Property-specific events
 */
export const PROPERTY_EVENTS = {
  PROPERTY_VIEW: 'property_view',
  PROPERTY_FAVOURITED: 'property_favourited',
  PROPERTY_UNFAVOURITED: 'property_unfavourited',
  VIRTUAL_TOUR_CLICK: 'virtual_tour_click',
  MAP_VIEW: 'map_view',
  GALLERY_VIEW: 'gallery_view',
  SIMILAR_PROPERTIES_CLICK: 'similar_properties_click',
  ENQUIRY_STARTED: 'enquiry_started',
  ENQUIRY_SUBMITTED: 'enquiry_submitted',
} as const

/**
 * Blog article events
 */
export const BLOG_EVENTS = {
  BLOG_VIEW: 'blog_view',
  BLOG_READ_TIME: 'blog_read_time',
  BLOG_SHARE: 'blog_share',
  BLOG_SCROLL_DEPTH: 'blog_scroll_depth',
  BLOG_LINK_CLICK: 'blog_link_click',
  BLOG_RELATED_CLICK: 'blog_related_click',
} as const

// ========================================
// COMBINED EVENT TYPES
// ========================================

/**
 * All valid event types
 * This should match the validEventTypes array in the Stratos server
 */
export const EVENT_TYPES = {
  ...GENERAL_EVENTS,
  ...PROPERTY_EVENTS,
  ...BLOG_EVENTS,
} as const

/**
 * Array of all valid event type strings
 */
export const VALID_EVENT_TYPES = Object.values(EVENT_TYPES)

/**
 * Type for any valid event type
 */
export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES]

// ========================================
// EVENT DATA FIELD NAMES
// ========================================

/**
 * Standard field names used in event_data
 * These should match what the server expects
 */
export const EVENT_FIELDS = {
  // Common fields
  PAGE_URL: 'page_url',
  REFERRER: 'referrer',
  TIMESTAMP: 'timestamp',

  // Property fields
  PROPERTY_ID: 'property_id',
  VIEW_DURATION_SECONDS: 'view_duration_seconds',
  TOUR_TYPE: 'tour_type',
  MAP_ACTION: 'map_action',
  IMAGE_INDEX: 'image_index',
  TOTAL_IMAGES: 'total_images',
  CLICKED_PROPERTY_ID: 'clicked_property_id',
  POSITION: 'position',

  // Blog fields
  ARTICLE_ID: 'article_id',
  READ_DURATION_SECONDS: 'read_duration_seconds',
  SCROLL_DEPTH: 'scroll_depth',
  MAX_SCROLL_DEPTH: 'max_scroll_depth',
  SHARE_METHOD: 'share_method',
  LINK_URL: 'link_url',
  LINK_TEXT: 'link_text',
  RELATED_ARTICLE_ID: 'related_article_id',
  RELATED_ARTICLE_TITLE: 'related_article_title',

  // Search fields
  LOCATION: 'location',
  POSTCODE: 'postcode',
  MIN_PRICE: 'min_price',
  MAX_PRICE: 'max_price',
  PRICE_RANGE: 'price_range',
  BEDROOMS: 'bedrooms',
  BATHROOMS: 'bathrooms',
  PROPERTY_TYPE: 'property_type',
  LISTING_TYPE: 'listing_type',
  FILTERS: 'filters',
  FILTERS_COUNT: 'filters_count',
  SOURCE_PAGE: 'source_page',
  SOURCE_COMPONENT: 'source_component',

  // Interaction fields
  PHONE_NUMBER: 'phone_number',
  EMAIL_ADDRESS: 'email_address',
  CTA_NAME: 'cta_name',
  FILTER_NAME: 'filter_name',
  FILTER_VALUE: 'filter_value',

  // Enquiry fields
  ENQUIRY_TYPE: 'enquiry_type',
  FORM_LOCATION: 'form_location',
  HAS_PHONE: 'has_phone',
  HAS_MESSAGE: 'has_message',

  // Session fields
  DURATION_SECONDS: 'duration_seconds',
  TIME_ON_PAGE_SECONDS: 'time_on_page_seconds',

  // UTM fields
  UTM_SOURCE: 'utm_source',
  UTM_MEDIUM: 'utm_medium',
  UTM_CAMPAIGN: 'utm_campaign',
  UTM_CONTENT: 'utm_content',
  UTM_TERM: 'utm_term',

  // Device fields
  SCREEN_WIDTH: 'screen_width',
  SCREEN_HEIGHT: 'screen_height',
  VIEWPORT_WIDTH: 'viewport_width',
  VIEWPORT_HEIGHT: 'viewport_height',
} as const

// ========================================
// ENQUIRY TYPES
// ========================================

export const ENQUIRY_TYPES = {
  GENERAL: 'general',
  PROPERTY: 'property',
  VIEWING: 'viewing',
  VALUATION: 'valuation',
} as const

export type EnquiryType = (typeof ENQUIRY_TYPES)[keyof typeof ENQUIRY_TYPES]

// ========================================
// LISTING TYPES
// ========================================

export const LISTING_TYPES = {
  SALE: 'sale',
  LET: 'let',
} as const

export type ListingType = (typeof LISTING_TYPES)[keyof typeof LISTING_TYPES]
