// ========================================
// CLIENT-SIDE TYPES - EXPANDED
// Enhanced with additional search filters
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

// ✅ NEW: EPC Ratings
export type EPCRating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'

// ✅ NEW: Council Tax Bands
export type CouncilTaxBand = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'

// ✅ NEW: Parking Types
export type ParkingType = 
  | 'none'
  | 'on_street'
  | 'driveway'
  | 'garage'
  | 'allocated'
  | 'permit'
  | 'communal'

// ✅ NEW: Tenure Types
export type TenureType = 'freehold' | 'leasehold' | 'shared_ownership' | 'commonhold'

// ✅ NEW: Furnishing Types
export type FurnishingType = 'furnished' | 'unfurnished' | 'part_furnished'

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
  url_slug?: string

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
  
  // Additional - Enhanced
  parking?: ParkingType | string
  parking_spaces?: number
  tenure?: TenureType | string
  council_tax_band?: CouncilTaxBand | string
  council_tax_amount?: number
  epc_rating?: EPCRating | string
  epc_current_score?: number
  epc_potential_score?: number
  furnishing?: FurnishingType | string
  heating_type?: string
  
  // ✅ NEW: Additional searchable fields
  shared_ownership?: boolean
  retirement_home?: boolean
  service_charge?: number
  ground_rent?: number
  lease_years_remaining?: number
  broadband_speed?: string
  mobile_signal_strength?: string
  
  // Media
  property_media?: PropertyMedia[]
  main_image_url?: string | null  // Returned by map search API

  // Timestamps
  created_at: string
  updated_at: string
  listed_date?: string
}

// ========================================
// SEARCH & FILTER TYPES - EXPANDED
// ========================================

export interface PropertySearchParams {
  // Location
  location?: string
  postcode?: string
  
  // Price
  min_price?: number
  max_price?: number
  
  // Rooms
  beds?: number
  min_beds?: number
  max_beds?: number
  min_baths?: number  // ✅ NEW
  min_receptions?: number  // ✅ NEW
  
  // Property Type
  property_type?: PropertyType | PropertyType[]
  
  // ✅ NEW: Area Filters
  min_area?: number
  max_area?: number
  area_unit?: 'sqft' | 'sqm'
  
  // Listing
  listing_type?: ListingType
  listing_status?: ListingStatus[]
  
  // ✅ NEW: Energy & Environment
  epc_rating?: EPCRating | EPCRating[]
  min_epc_score?: number  // 0-100
  max_epc_score?: number
  
  // ✅ NEW: Council Tax
  council_tax_band?: CouncilTaxBand | CouncilTaxBand[]
  max_council_tax_amount?: number
  
  // ✅ NEW: Tenure & Ownership
  tenure?: TenureType | TenureType[]
  shared_ownership?: boolean
  retirement_home?: boolean
  
  // ✅ NEW: Parking
  parking?: ParkingType | ParkingType[]
  min_parking_spaces?: number
  
  // ✅ NEW: Furnishing (for rentals)
  furnishing?: FurnishingType | FurnishingType[]
  
  // ✅ NEW: Leasehold Filters
  min_lease_years?: number  // Minimum lease years remaining
  max_service_charge?: number
  max_ground_rent?: number
  
  // ✅ NEW: Connectivity
  min_broadband_speed?: string  // e.g., "30Mbps", "100Mbps"
  mobile_signal_strength?: string  // e.g., "excellent", "good"
  
  // ✅ NEW: Heating
  heating_type?: string  // e.g., "gas", "electric", "oil"
  
  // ✅ NEW: Features
  garden?: boolean  // Has external area
  new_build?: boolean  // Listed in last 6 months
  recently_reduced?: boolean  // Price changed in last 30 days
  
  // Pagination
  page?: number
  limit?: number
  
  // Sorting - Enhanced
  sort_by?: 
    | 'price_asc' 
    | 'price_desc' 
    | 'newest' 
    | 'oldest' 
    | 'beds_asc' 
    | 'beds_desc'
    | 'area_asc'  // ✅ NEW
    | 'area_desc'  // ✅ NEW
    | 'epc_best'  // ✅ NEW - Sort by EPC rating (A to G)
    | 'council_tax_asc'  // ✅ NEW
}

export interface PropertySearchResponse {
  properties: Property[]
  total: number
  page: number
  limit: number
  has_more: boolean
  
  // ✅ NEW: Search metadata
  filters_applied?: {
    epc_ratings?: EPCRating[]
    council_tax_bands?: CouncilTaxBand[]
    parking_types?: ParkingType[]
    tenure_types?: TenureType[]
    [key: string]: any
  }
}

// ========================================
// FILTER OPTIONS (for UI dropdowns)
// ========================================

export const EPC_RATINGS: { value: EPCRating; label: string; color: string }[] = [
  { value: 'A', label: 'A (92-100)', color: 'green' },
  { value: 'B', label: 'B (81-91)', color: 'lime' },
  { value: 'C', label: 'C (69-80)', color: 'yellow' },
  { value: 'D', label: 'D (55-68)', color: 'orange' },
  { value: 'E', label: 'E (39-54)', color: 'red' },
  { value: 'F', label: 'F (21-38)', color: 'red' },
  { value: 'G', label: 'G (1-20)', color: 'red' },
]

export const COUNCIL_TAX_BANDS: { value: CouncilTaxBand; label: string; range: string }[] = [
  { value: 'A', label: 'Band A', range: 'Up to £40,000' },
  { value: 'B', label: 'Band B', range: '£40,001-£52,000' },
  { value: 'C', label: 'Band C', range: '£52,001-£68,000' },
  { value: 'D', label: 'Band D', range: '£68,001-£88,000' },
  { value: 'E', label: 'Band E', range: '£88,001-£120,000' },
  { value: 'F', label: 'Band F', range: '£120,001-£160,000' },
  { value: 'G', label: 'Band G', range: '£160,001-£320,000' },
  { value: 'H', label: 'Band H', range: 'Over £320,000' },
]

export const PARKING_TYPES: { value: ParkingType; label: string }[] = [
  { value: 'none', label: 'No Parking' },
  { value: 'on_street', label: 'On-Street' },
  { value: 'driveway', label: 'Driveway' },
  { value: 'garage', label: 'Garage' },
  { value: 'allocated', label: 'Allocated Space' },
  { value: 'permit', label: 'Permit Parking' },
  { value: 'communal', label: 'Communal Parking' },
]

export const TENURE_TYPES: { value: TenureType; label: string }[] = [
  { value: 'freehold', label: 'Freehold' },
  { value: 'leasehold', label: 'Leasehold' },
  { value: 'shared_ownership', label: 'Shared Ownership' },
  { value: 'commonhold', label: 'Commonhold' },
]

export const FURNISHING_TYPES: { value: FurnishingType; label: string }[] = [
  { value: 'furnished', label: 'Furnished' },
  { value: 'unfurnished', label: 'Unfurnished' },
  { value: 'part_furnished', label: 'Part Furnished' },
]

// ========================================
// ENQUIRY TYPES (unchanged)
// ========================================

export type EnquiryType = 
  | 'viewing_request'
  | 'property_question'
  | 'general_enquiry'
  | 'valuation_request'
  | 'callback_request'

export interface EnquiryFormData {
  contact_name: string
  contact_email: string
  contact_phone?: string
  preferred_contact_method?: 'email' | 'phone' | 'either'
  enquiry_type: EnquiryType
  message: string
  property_id?: string
  preferred_viewing_date?: string
  valuation_property_address?: string
  valuation_postcode?: string
  marketing_opt_in: boolean
}

export interface EnquiryResponse {
  success: boolean
  enquiry_id?: string
  message: string
  errors?: Record<string, string[]>
}

// ========================================
// API RESPONSE TYPES (unchanged)
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
// TRACKING TYPES (unchanged)
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
  property_id?: string
  search_params?: PropertySearchParams
  results_count?: number
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

// ========================================
// CONSENT TYPES (unchanged)
// ========================================

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing'

export interface ConsentPreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  timestamp: string
  version: string
}

// ========================================
// UI STATE TYPES (unchanged)
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

// ========================================
// TEAM MEMBER TYPES
// ========================================

export interface SocialLinks {
  linkedin?: string
  twitter?: string
  instagram?: string
  facebook?: string
  youtube?: string
  website?: string
}

export interface TeamMember {
  member_id: string
  first_name: string
  last_name: string
  full_name: string
  job_title: string | null
  department: string | null
  email: string | null
  phone: string | null
  mobile_phone: string | null
  bio: string | null
  short_bio: string | null
  profile_photo_url: string | null
  social_links: SocialLinks
  specializations: string[]
  areas_covered: string[]
  is_featured: boolean
  display_order: number
}

export interface TeamMembersResponse {
  members: TeamMember[]
  total: number
}

// ========================================
// BLOG TYPES
// ========================================

export type BlogStatus = 'draft' | 'scheduled' | 'published' | 'archived'

export interface BlogAuthor {
  member_id: string
  full_name: string
  job_title?: string | null
  profile_photo_url: string | null
}

export interface BlogCategory {
  category_id: string
  name: string
  slug: string
  color: string | null
}

export interface BlogTag {
  tag_id: string
  name: string
  slug: string
}

export interface BlogArticle {
  article_id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  status: BlogStatus
  published_at: string | null
  author_id: string | null
  author: BlogAuthor | null
  featured_image_url: string | null
  featured_image_alt: string | null
  og_image_url: string | null
  meta_title: string | null
  meta_description: string | null
  canonical_url: string | null
  is_featured: boolean
  view_count: number
  categories: BlogCategory[]
  tags: BlogTag[]
  created_at: string
}

export interface BlogArticlesResponse {
  articles: BlogArticle[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface BlogSearchParams {
  article_id?: string
  slug?: string
  category_id?: string
  tag_id?: string
  featured?: boolean
  limit?: number
  page?: number
}