// ========================================
// CLIENT-SIDE TYPES
// Mirrors types from Edge Functions
// ========================================

// ========================================
// PROPERTY TYPES
// ========================================

export type PropertyType = 
  | 'detached'
  | 'semi-detached'
  | 'terraced'
  | 'flat'
  | 'apartment'
  | 'bungalow'
  | 'cottage'
  | 'maisonette'
  | 'studio'
  | 'penthouse'
  | 'other'

export type ListingType = 'sale' | 'let'

export type ListingStatus = 
  | 'draft'
  | 'available'
  | 'under_offer'
  | 'sold'
  | 'sold_stc'
  | 'let'
  | 'let_agreed'
  | 'withdrawn'
  | 'archived'

export interface PropertyMedia {
  media_id: string
  file_url: string
  thumbnail_url?: string
  media_type: 'image' | 'video' | 'floorplan' | 'epc' | 'brochure' | 'virtual_tour'
  is_primary: boolean
  display_order: number
  caption?: string
  alt_text?: string
}

export interface Property {
  id: string
  agency_id: string
  branch_id?: string
  
  // Address
  display_address: string
  address_line_1?: string
  address_line_2?: string
  city?: string
  county?: string
  postcode: string
  country_code: string
  latitude?: number
  longitude?: number
  
  // Property Details
  property_type: PropertyType
  property_style?: string
  bedrooms: number
  bathrooms: number
  receptions?: number
  internal_area?: number
  external_area?: number
  area_unit?: 'sqft' | 'sqm'
  
  // Listing Details
  listing_type: ListingType
  listing_status: ListingStatus
  asking_price?: number
  rent_amount?: number
  rent_frequency?: 'weekly' | 'monthly' | 'yearly'
  deposit_amount?: number
  available_date?: string
  
  // Marketing
  is_published: boolean
  is_featured: boolean
  summary?: string
  description?: string
  key_features?: string[]
  
  // Additional
  parking?: string
  tenure?: string
  council_tax_band?: string
  epc_rating?: string
  furnishing?: string
  
  // Media
  property_media?: PropertyMedia[]
  
  // Timestamps
  created_at: string
  updated_at: string
  listed_date?: string
}

// ========================================
// SEARCH & FILTER TYPES
// ========================================

export interface PropertySearchParams {
  // Location
  location?: string
  postcode?: string
  
  // Price
  min_price?: number
  max_price?: number
  
  // Property
  beds?: number
  min_beds?: number
  max_beds?: number
  property_type?: PropertyType | PropertyType[]
  
  // Listing
  listing_type?: ListingType
  listing_status?: ListingStatus[]
  
  // Pagination
  page?: number
  limit?: number
  
  // Sorting
  sort_by?: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'beds_asc' | 'beds_desc'
}

export interface PropertySearchResponse {
  properties: Property[]
  total: number
  page: number
  limit: number
  has_more: boolean
}

// ========================================
// ENQUIRY TYPES
// ========================================

export type EnquiryType = 
  | 'viewing_request'
  | 'property_question'
  | 'general_enquiry'
  | 'valuation_request'
  | 'callback_request'

export interface EnquiryFormData {
  // Contact Info
  contact_name: string
  contact_email: string
  contact_phone?: string
  preferred_contact_method?: 'email' | 'phone' | 'either'
  
  // Enquiry
  enquiry_type: EnquiryType
  message: string
  property_id?: string
  
  // Viewing specific
  preferred_viewing_date?: string
  
  // Valuation specific
  valuation_property_address?: string
  valuation_postcode?: string
  
  // GDPR (added automatically)
  marketing_opt_in: boolean
}

export interface EnquiryResponse {
  success: boolean
  enquiry_id?: string
  message: string
  errors?: Record<string, string[]>
}

// ========================================
// API RESPONSE TYPES
// ========================================

export interface ApiError {
  error: true
  message: string
  code?: string
  details?: Record<string, any>
}

export interface ApiSuccess<T = any> {
  success: true
  data: T
  message?: string
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError

// ========================================
// TRACKING TYPES
// ========================================

export type TrackingEventType =
  | 'page_view'
  | 'property_view'
  | 'search'
  | 'property_detail_interaction'
  | 'enquiry_form_start'
  | 'enquiry_form_submit'
  | 'session_start'
  | 'session_end'

export interface TrackingEvent {
  event_type: TrackingEventType
  session_id: string
  timestamp: string
  page_url: string
  page_path: string
  page_title?: string
  referrer?: string
  
  // Event-specific data
  property_id?: string
  search_params?: PropertySearchParams
  results_count?: number
  
  // UTM params
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

// ========================================
// CONSENT TYPES
// ========================================

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing'

export interface ConsentPreferences {
  necessary: boolean // Always true
  analytics: boolean
  marketing: boolean
  timestamp: string
  version: string
}

// ========================================
// UI STATE TYPES
// ========================================

export interface LoadingState {
  isLoading: boolean
  error?: string
}

export interface PaginationState {
  currentPage: number
  totalPages: number
  totalResults: number
  hasMore: boolean
}