// ========================================
// UTILITY FUNCTIONS
// Formatting, URL helpers, and other utilities
// ========================================

import type { Property, PropertyType } from '../types/database'

// ========================================
// PRICE FORMATTING
// ========================================

/**
 * Format price as GBP currency
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Format rent with frequency
 */
export function formatRent(
  amount: number,
  frequency: 'weekly' | 'monthly' | 'yearly' = 'monthly'
): string {
  const formatted = formatPrice(amount)
  
  switch (frequency) {
    case 'weekly':
      return `${formatted} pw`
    case 'monthly':
      return `${formatted} pcm`
    case 'yearly':
      return `${formatted} pa`
    default:
      return formatted
  }
}

/**
 * Get display price for property (handles sale and rental)
 */
export function getDisplayPrice(property: Property): string {
  if (property.listing_type === 'sale') {
    return property.asking_price ? formatPrice(property.asking_price) : 'POA'
  } else {
    return property.rent_amount
      ? formatRent(property.rent_amount, property.rent_frequency)
      : 'POA'
  }
}

// ========================================
// DATE FORMATTING
// ========================================

/**
 * Format date as relative time (e.g., "2 days ago")
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

/**
 * Format date as readable string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

// ========================================
// URL HELPERS
// ========================================

/**
 * Create SEO-friendly URL slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Extract location slug from address
 * Strips unit/flat numbers and extracts street name
 */
function extractLocationSlug(address: string | null | undefined): string {
  if (!address) return ''

  // Get the first part before comma (street address)
  const streetPart = address.split(',')[0].trim()

  // Remove flat/unit/apartment prefixes with numbers
  const cleanStreet = streetPart
    .replace(/^(flat|unit|apartment)\s*\d+[a-z]?\s*/i, '')
    .replace(/^\d+[a-z]?\s+/i, '')  // Remove leading house numbers

  // Slugify and limit length
  return slugify(cleanStreet).substring(0, 50)
}

/**
 * Generate property URL
 * SEO-friendly format: /properties/{slug}
 * Example: /properties/3-bed-semi-detached-baker-street
 */
export function getPropertyUrl(property: Property & { url_slug?: string | null }): string {
  // Use url_slug if available (from API)
  if (property.url_slug) {
    return `/properties/${property.url_slug}`
  }

  // Fallback: generate slug client-side (for legacy data without url_slug)
  const parts: string[] = []

  // 1. Bedrooms component
  if (property.bedrooms === 0) {
    parts.push('studio')
  } else if (property.bedrooms && property.bedrooms > 0) {
    parts.push(`${property.bedrooms}-bed`)
  }

  // 2. Property type component
  if (property.property_type && property.property_type !== 'other') {
    parts.push(property.property_type.toLowerCase().replace(/\s+/g, '-'))
  }

  // 3. Location component (street name from address)
  const location = extractLocationSlug(property.display_address)
  if (location) {
    parts.push(location)
  }

  // Fallback if no parts
  if (parts.length === 0) {
    parts.push('property')
  }

  return `/properties/${parts.join('-')}`
}

/**
 * Extract property slug from URL
 * Handles SEO format: /properties/{slug}
 * Returns the slug (everything after /properties/)
 */
export function extractPropertySlugFromUrl(pathname: string): string | null {
  const match = pathname.match(/\/properties\/([^\/]+)$/)
  return match ? match[1] : null
}

/**
 * Extract full property ID from old URL format (for redirects)
 * Handles old format: /properties/[postcode]/[address-slug]-[full-uuid]
 */
export function extractFullPropertyIdFromUrl(pathname: string): string | null {
  const match = pathname.match(/-([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i)
  return match ? match[1] : null
}

/**
 * Default search parameter values - excluded from URL when unchanged
 */
export const SEARCH_DEFAULTS: Record<string, any> = {
  listing_type: 'sale',
  page: 1,
  limit: 20,
  sort_by: 'newest',
  garden: false,
  new_build: false,
  recently_reduced: false,
  shared_ownership: false,
  retirement_home: false,
}

/**
 * Check if a value should be excluded from the search URL
 */
function shouldExcludeParam(key: string, value: any): boolean {
  // Exclude undefined, null, empty strings
  if (value === undefined || value === null || value === '') return true

  // Exclude false boolean values
  if (value === false) return true

  // Exclude default values
  if (key in SEARCH_DEFAULTS && SEARCH_DEFAULTS[key] === value) return true

  return false
}

/**
 * Build search URL with filters (excludes defaults and empty values)
 */
export function buildSearchUrl(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (!shouldExcludeParam(key, value)) {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `/search?${queryString}` : '/search'
}

// ========================================
// TEXT FORMATTING
// ========================================

/**
 * Pluralize word based on count
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string
): string {
  if (count === 1) return singular
  return plural || `${singular}s`
}

/**
 * Format property type for display
 */
export function formatPropertyType(type: PropertyType): string {
  const typeMap: Record<PropertyType, string> = {
    'detached': 'Detached House',
    'semi-detached': 'Semi-Detached House',
    'terraced': 'Terraced House',
    'flat': 'Flat',
    'apartment': 'Apartment',
    'bungalow': 'Bungalow',
    'cottage': 'Cottage',
    'maisonette': 'Maisonette',
    'studio': 'Studio',
    'penthouse': 'Penthouse',
    'other': 'Property',
  }
  
  return typeMap[type] || 'Property'
}

/**
 * Format bedrooms count
 */
export function formatBedrooms(count: number): string {
  if (count === 0) return 'Studio'
  return `${count} ${pluralize(count, 'bedroom')}`
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

// ========================================
// IMAGE HELPERS
// ========================================

/**
 * Get primary image URL from property
 */
export function getPrimaryImage(property: Property): string {
  const primaryImage = property.property_media?.find(m => m.is_primary)
  return primaryImage?.file_url 
    || property.property_media?.[0]?.file_url 
    || '/images/placeholder-property.jpg'
}

/**
 * Get thumbnail URL with fallback
 */
export function getThumbnailUrl(property: Property): string {
  const primaryImage = property.property_media?.find(m => m.is_primary)
  return primaryImage?.thumbnail_url 
    || primaryImage?.file_url
    || property.property_media?.[0]?.thumbnail_url
    || property.property_media?.[0]?.file_url
    || '/images/placeholder-property.jpg'
}

/**
 * Get all image URLs from property
 */
export function getPropertyImages(property: Property): string[] {
  if (!property.property_media || property.property_media.length === 0) {
    return ['/images/placeholder-property.jpg']
  }
  
  return property.property_media
    .filter(m => m.media_type === 'image')
    .sort((a, b) => a.display_order - b.display_order)
    .map(m => m.file_url)
}

// ========================================
// VALIDATION
// ========================================

/**
 * Validate UK postcode format
 */
export function isValidPostcode(postcode: string): boolean {
  const postcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i
  return postcodeRegex.test(postcode.trim())
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate UK phone number
 */
export function isValidUKPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  const ukPhoneRegex = /^(\+44|0)[1-9]\d{8,9}$/
  return ukPhoneRegex.test(cleaned)
}

// ========================================
// QUERY STRING HELPERS
// ========================================

/**
 * Parse query string from URL
 */
export function parseQueryString(url: string): Record<string, string> {
  const params: Record<string, string> = {}
  const searchParams = new URL(url).searchParams
  
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  
  return params
}

/**
 * Get query parameter value
 */
export function getQueryParam(key: string): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get(key)
}

// ========================================
// NUMBER FORMATTING
// ========================================

/**
 * Format large numbers with K, M suffix
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(0)}K`
  }
  return num.toString()
}

/**
 * Format area with unit
 */
export function formatArea(area: number, unit: 'sqft' | 'sqm' = 'sqft'): string {
  return `${area.toLocaleString('en-GB')} ${unit}`
}

// ========================================
// STATUS HELPERS
// ========================================

/**
 * Get human-readable status badge text
 */
export function getStatusBadgeText(status: string): string {
  const statusMap: Record<string, string> = {
    'available': 'Available',
    'under_offer': 'Under Offer',
    'sold': 'Sold',
    'sold_stc': 'Sold STC',
    'let': 'Let',
    'let_agreed': 'Let Agreed',
    'withdrawn': 'Withdrawn',
  }
  
  return statusMap[status] || status
}

/**
 * Get CSS class for status badge
 */
export function getStatusBadgeClass(status: string): string {
  const classMap: Record<string, string> = {
    'available': 'bg-green-100 text-green-800',
    'under_offer': 'bg-amber-100 text-amber-800',
    'sold': 'bg-gray-100 text-gray-800',
    'sold_stc': 'bg-blue-100 text-blue-800',
    'let': 'bg-gray-100 text-gray-800',
    'let_agreed': 'bg-purple-100 text-purple-800',
  }
  
  return classMap[status] || 'bg-gray-100 text-gray-800'
}