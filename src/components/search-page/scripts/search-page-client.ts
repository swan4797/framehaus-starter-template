// ========================================
// SEARCH PAGE CLIENT INTERACTIONS
// Client-side functionality for search page
// ========================================

import {
  sendPendingSearchEvent,
  extractSearchParamsFromUrl,
  storeSearchForTracking,
} from '../../../lib/search-tracker'

declare global {
  interface Window {
    StratosTracker?: {
      trackEvent: (eventType: string, data: Record<string, any>) => void
    }
  }
}

// ----------------------------------------
// SEARCH TRACKING
// ----------------------------------------

async function initSearchTracking(): Promise<void> {
  // First, try to send any pending search event (from form submission)
  const sentPending = await sendPendingSearchEvent()

  // If no pending event, track direct URL access
  if (!sentPending && window.location.search) {
    const directSearchParams = extractSearchParamsFromUrl()
    if (directSearchParams && directSearchParams.filters_count && directSearchParams.filters_count > 0) {
      console.log('[SearchPage] Tracking direct URL search:', directSearchParams)

      // For direct URL access, we can track immediately since we're already on the page
      if (window.StratosTracker) {
        const resultsCount = document.querySelector('[data-results-count]')?.getAttribute('data-results-count') || '0'

        window.StratosTracker.trackEvent('search', {
          // Location data
          location: directSearchParams.location || '',
          postcode: directSearchParams.postcode || '',

          // Price data
          min_price: directSearchParams.min_price || null,
          max_price: directSearchParams.max_price || null,

          // Property criteria
          bedrooms: directSearchParams.bedrooms || null,
          bathrooms: directSearchParams.bathrooms || null,
          property_type: directSearchParams.property_type || null,
          listing_type: directSearchParams.listing_type || 'sale',

          // All filters
          filters: directSearchParams.filters,
          filters_count: directSearchParams.filters_count,

          // Results
          results_count: parseInt(resultsCount),

          // Source
          source_page: directSearchParams.source_page || 'direct',
          source_component: 'url_direct',
        })

        console.log('[SearchPage] Direct search event tracked')
      }
    }
  }
}

// ----------------------------------------
// SORT SELECT HANDLER
// ----------------------------------------

// Default values to exclude from URL
const SEARCH_DEFAULTS: Record<string, string> = {
  listing_type: 'sale',
  page: '1',
  limit: '20',
  sort_by: 'newest',
}

function cleanSearchParams(params: URLSearchParams): URLSearchParams {
  const cleaned = new URLSearchParams()

  params.forEach((value, key) => {
    // Skip empty values and false booleans
    if (!value || value === 'false') return

    // Skip default values
    if (key in SEARCH_DEFAULTS && SEARCH_DEFAULTS[key] === value) return

    cleaned.set(key, value)
  })

  return cleaned
}

function initSortHandler(): void {
  const sortSelect = document.getElementById('sort_select') as HTMLSelectElement | null

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const urlParams = new URLSearchParams(window.location.search)

      // Set the new sort value (or remove if default)
      if (sortSelect.value === 'newest') {
        urlParams.delete('sort_by')
      } else {
        urlParams.set('sort_by', sortSelect.value)
      }

      // Reset pagination
      urlParams.delete('page')

      // Clean the params to remove defaults
      const cleanedParams = cleanSearchParams(urlParams)

      // Track filter change
      if (window.StratosTracker) {
        window.StratosTracker.trackEvent('filter_change', {
          filter_name: 'sort_by',
          filter_value: sortSelect.value,
          component: 'search_page',
        })
      }

      // Store current search params for re-tracking after navigation
      const searchData = extractSearchParamsFromUrl()
      if (searchData) {
        storeSearchForTracking({
          ...searchData,
          source_component: 'sort_change',
        })
      }

      const queryString = cleanedParams.toString()
      window.location.href = queryString ? `/search?${queryString}` : '/search'
    })
  }
}

// ----------------------------------------
// PAGE VIEW TRACKING
// ----------------------------------------

function trackPageView(): void {
  if (window.StratosTracker) {
    const urlParams = new URLSearchParams(window.location.search)
    const resultsCount = document.querySelector('[data-results-count]')?.getAttribute('data-results-count') || '0'

    window.StratosTracker.trackEvent('page_view', {
      page_type: 'search_results',
      listing_type: urlParams.get('listing_type') || 'sale',
      location: urlParams.get('location') || '',
      results_count: parseInt(resultsCount),
      filters_count: Array.from(urlParams.keys()).length,
    })
  }
}

// ----------------------------------------
// INITIALIZATION
// ----------------------------------------

export async function initSearchPage(): Promise<void> {
  await initSearchTracking()
  initSortHandler()
  trackPageView()
  console.log('[SearchPage] Initialized with search tracking')
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchPage)
  } else {
    initSearchPage()
  }
}
