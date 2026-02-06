// ========================================
// SEARCH PARAMETER UTILITIES
// Functions for parsing URL search parameters
// ========================================

import type { PropertySearchParams } from '../../../types/database'
import type { SearchComputedValues, SortOption } from '../types'
import type { Property, PropertySearchResponse } from '../../../types/database'
import { defaultSortOptions } from '../config'

// ----------------------------------------
// DEFAULT VALUES (excluded from URL)
// ----------------------------------------

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

// ----------------------------------------
// PARAMETER PARSING HELPERS
// ----------------------------------------

export function getIntParam(url: URL, name: string): number | undefined {
  const value = url.searchParams.get(name)
  return value ? parseInt(value) : undefined
}

export function getBoolParam(url: URL, name: string): boolean {
  return url.searchParams.get(name) === 'true'
}

export function getStringParam(url: URL, name: string): string | undefined {
  return url.searchParams.get(name) || undefined
}

// ----------------------------------------
// PARSE ALL SEARCH PARAMETERS
// ----------------------------------------

export function parseSearchParams(url: URL): PropertySearchParams {
  return {
    // Basic filters
    listing_type: (url.searchParams.get('listing_type') as 'sale' | 'let') || 'sale',
    location: getStringParam(url, 'location'),
    postcode: getStringParam(url, 'postcode'),
    min_price: getIntParam(url, 'min_price'),
    max_price: getIntParam(url, 'max_price'),
    beds: getIntParam(url, 'beds'),
    property_type: url.searchParams.get('property_type') as any || undefined,

    // Room filters
    min_baths: getIntParam(url, 'min_baths'),
    min_receptions: getIntParam(url, 'min_receptions'),

    // EPC filters
    epc_rating: url.searchParams.get('epc_rating') as any || undefined,
    min_epc_score: getIntParam(url, 'min_epc_score'),

    // Council Tax filters
    council_tax_band: url.searchParams.get('council_tax_band') as any || undefined,
    max_council_tax_amount: getIntParam(url, 'max_council_tax_amount'),

    // Parking filters
    parking: url.searchParams.get('parking') as any || undefined,
    min_parking_spaces: getIntParam(url, 'min_parking_spaces'),

    // Tenure filters
    tenure: url.searchParams.get('tenure') as any || undefined,
    min_lease_years: getIntParam(url, 'min_lease_years'),
    max_service_charge: getIntParam(url, 'max_service_charge'),
    max_ground_rent: getIntParam(url, 'max_ground_rent'),

    // Area filters
    min_area: getIntParam(url, 'min_area'),
    max_area: getIntParam(url, 'max_area'),

    // Feature filters
    garden: getBoolParam(url, 'garden'),
    new_build: getBoolParam(url, 'new_build'),
    recently_reduced: getBoolParam(url, 'recently_reduced'),
    shared_ownership: getBoolParam(url, 'shared_ownership'),
    retirement_home: getBoolParam(url, 'retirement_home'),

    // Rental filters
    furnishing: url.searchParams.get('furnishing') as any || undefined,

    // Pagination & sorting
    page: getIntParam(url, 'page') || 1,
    limit: 20,
    sort_by: (url.searchParams.get('sort_by') as any) || 'newest',
  }
}

// ----------------------------------------
// COMPUTE DERIVED VALUES
// ----------------------------------------

export function computeSearchValues(
  searchParams: PropertySearchParams,
  searchResponse: PropertySearchResponse | null
): SearchComputedValues {
  const hasError = !searchResponse
  const properties = searchResponse?.properties || []
  const total = searchResponse?.total || 0
  const totalPages = Math.ceil(total / (searchParams.limit || 20))

  const activeFiltersCount = countActiveFilters(searchParams)
  const listingTypeText = searchParams.listing_type === 'sale' ? 'For Sale' : 'To Rent'
  const locationText = searchParams.location ? ` in ${searchParams.location}` : ''
  const pageTitle = `Properties ${listingTypeText}${locationText}`
  const metaDescription = `Find properties ${listingTypeText.toLowerCase()}${locationText}. ${total} properties available.`

  return {
    hasError,
    properties,
    total,
    totalPages,
    activeFiltersCount,
    listingTypeText,
    locationText,
    pageTitle,
    metaDescription,
  }
}

// ----------------------------------------
// COUNT ACTIVE FILTERS
// ----------------------------------------

export function countActiveFilters(searchParams: PropertySearchParams): number {
  const excludedKeys = ['listing_type', 'page', 'limit', 'sort_by']

  return Object.entries(searchParams).filter(([key, value]) => {
    if (excludedKeys.includes(key)) return false
    return value !== undefined && value !== '' && value !== false
  }).length
}

// ----------------------------------------
// BUILD SEARCH URL
// ----------------------------------------

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
export function buildSearchUrl(
  baseUrl: string,
  params: Partial<PropertySearchParams>
): string {
  const url = new URL(baseUrl, 'http://localhost')

  Object.entries(params).forEach(([key, value]) => {
    if (!shouldExcludeParam(key, value)) {
      url.searchParams.set(key, String(value))
    }
  })

  const queryString = url.searchParams.toString()
  return queryString ? `${url.pathname}?${queryString}` : url.pathname
}

// ----------------------------------------
// UPDATE SORT PARAMETER
// ----------------------------------------

export function updateSortParam(currentUrl: URL, newSortValue: string): string {
  const urlParams = new URLSearchParams(currentUrl.search)
  urlParams.set('sort_by', newSortValue)
  urlParams.delete('page') // Reset pagination when sorting changes
  return `/search?${urlParams.toString()}`
}
