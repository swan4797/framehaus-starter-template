/**
 * Stratos Tracking - Search Tracking Module
 *
 * Uses store-and-forward pattern to ensure 100% reliable tracking:
 * 1. Before navigation: Store search data in sessionStorage
 * 2. After navigation: Send tracking event from search results page
 *
 * This approach eliminates:
 * - Race conditions with navigation
 * - CORS/beacon issues
 * - Browser inconsistencies (Firefox NS_BINDING_ABORTED)
 *
 * @module tracking/modules/search
 */

import type { SearchTrackingData } from '../types'

const STORAGE_KEY = 'stratos_pending_search'

// ========================================
// SEARCH TRACKING
// ========================================

/**
 * Store search data before navigation
 * Call this in the form submit handler BEFORE window.location.href
 */
export function storeSearchForTracking(data: Partial<SearchTrackingData>): void {
  try {
    const trackingData: SearchTrackingData = {
      listing_type: data.listing_type || 'sale',
      timestamp: Date.now(),
      location: data.location || data.postcode || '',
      postcode: data.postcode || '',
      min_price: data.min_price,
      max_price: data.max_price,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      property_type: data.property_type,
      filters: data.filters || {},
      filters_count: data.filters_count || 0,
      source_page: data.source_page || window.location.pathname,
      source_component: data.source_component || 'unknown',
    }

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trackingData))
    console.log('[SearchTracker] Stored search data for tracking:', trackingData)
  } catch (error) {
    console.error('[SearchTracker] Failed to store search data:', error)
  }
}

/**
 * Send any pending search tracking event
 * Call this when the search results page loads
 */
export async function sendPendingSearchEvent(): Promise<boolean> {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (!stored) {
      console.log('[SearchTracker] No pending search event')
      return false
    }

    // Clear immediately to prevent duplicate sends
    sessionStorage.removeItem(STORAGE_KEY)

    const data: SearchTrackingData = JSON.parse(stored)

    // Check if data is stale (older than 30 seconds)
    if (Date.now() - data.timestamp > 30000) {
      console.log('[SearchTracker] Search data is stale, skipping')
      return false
    }

    console.log('[SearchTracker] Sending stored search event:', data)

    // Send via StratosTracker if available
    if (window.StratosTracker) {
      // Use trackEvent which uses fetch (more reliable on page load)
      window.StratosTracker.trackEvent('search', {
        // Location data
        location: data.location || data.postcode || '',
        postcode: data.postcode || '',

        // Price data
        min_price: data.min_price || null,
        max_price: data.max_price || null,
        price_range: formatPriceRange(data.min_price, data.max_price),

        // Property criteria
        bedrooms: data.bedrooms || null,
        bathrooms: data.bathrooms || null,
        property_type: data.property_type || null,
        listing_type: data.listing_type,

        // All filters for detailed analysis
        filters: data.filters,
        filters_count: data.filters_count,

        // Source tracking
        source_page: data.source_page,
        source_component: data.source_component,

        // Timing
        search_timestamp: data.timestamp,
        tracking_delay_ms: Date.now() - data.timestamp,
      })

      console.log('[SearchTracker] Search event sent successfully')
      return true
    } else {
      console.warn('[SearchTracker] StratosTracker not available')
      return false
    }
  } catch (error) {
    console.error('[SearchTracker] Failed to send search event:', error)
    return false
  }
}

/**
 * Format price range for display/analytics
 */
function formatPriceRange(min?: number | string, max?: number | string): string {
  const minVal = min ? Number(min) : null
  const maxVal = max ? Number(max) : null

  if (minVal && maxVal) {
    return `£${formatPrice(minVal)} - £${formatPrice(maxVal)}`
  } else if (minVal) {
    return `£${formatPrice(minVal)}+`
  } else if (maxVal) {
    return `Up to £${formatPrice(maxVal)}`
  }
  return 'Any price'
}

function formatPrice(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`
  }
  if (value >= 1000) {
    return `${Math.round(value / 1000)}k`
  }
  return value.toString()
}

/**
 * Extract search parameters from URL
 * Useful for tracking searches that come from direct URL access
 */
export function extractSearchParamsFromUrl(): Partial<SearchTrackingData> | null {
  try {
    const params = new URLSearchParams(window.location.search)

    if (params.toString() === '') {
      return null
    }

    const filters: Record<string, any> = {}
    let filtersCount = 0

    params.forEach((value, key) => {
      if (value && value !== 'false') {
        filters[key] = value
        filtersCount++
      }
    })

    return {
      listing_type: params.get('listing_type') || 'sale',
      location: params.get('location') || params.get('q') || '',
      postcode: params.get('postcode') || '',
      min_price: params.get('min_price') || undefined,
      max_price: params.get('max_price') || undefined,
      bedrooms: params.get('beds') || params.get('bedrooms') || undefined,
      bathrooms: params.get('min_baths') || params.get('bathrooms') || undefined,
      property_type: params.get('property_type') || undefined,
      filters,
      filters_count: filtersCount,
      source_page: document.referrer || 'direct',
      source_component: 'url_direct',
    }
  } catch (error) {
    console.error('[SearchTracker] Failed to extract URL params:', error)
    return null
  }
}
