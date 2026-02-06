// ========================================
// SEARCH PAGE CONFIGURATION
// Centralized configuration for search page components
// ========================================

import type {
  SearchPageConfig,
  SearchHeroConfig,
  SearchSidebarConfig,
  SearchResultsConfig,
  SearchStatesConfig,
  SortOption,
} from './types'

// ----------------------------------------
// SORT OPTIONS
// ----------------------------------------

export const defaultSortOptions: SortOption[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'beds_desc', label: 'Most Bedrooms' },
  { value: 'area_desc', label: 'Largest First' },
  { value: 'epc_best', label: 'Best EPC' },
]

// ----------------------------------------
// HERO CONFIGURATION
// ----------------------------------------

export const defaultHeroConfig: SearchHeroConfig = {
  title: 'Find Your Dream Property',
  subtitle: 'Search thousands of properties with advanced filters',
  showHero: true,
}

// ----------------------------------------
// SIDEBAR CONFIGURATION
// ----------------------------------------

export const defaultSidebarConfig: SearchSidebarConfig = {
  showListingTypeToggle: true,
  showLocation: true,
  showMinPrice: true,
  showMaxPrice: true,
  showBedrooms: true,
  showPropertyType: true,
  showAdvancedToggle: true,
  advancedDefaultOpen: false,
  showBathrooms: true,
  showReceptions: true,
  showMinArea: true,
  showMaxArea: true,
  showEPCRating: true,
  showCouncilTaxBand: true,
  showParking: true,
  showTenure: true,
  showMinLeaseYears: true,
  showMaxServiceCharge: true,
  showGarden: true,
  showNewBuild: true,
  showRecentlyReduced: true,
  showFurnishing: true,
  submitButtonText: 'Apply Filters',
  showResetButton: true,
}

// ----------------------------------------
// RESULTS CONFIGURATION
// ----------------------------------------

export const defaultResultsConfig: SearchResultsConfig = {
  gridColumns: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  },
  showMapLink: true,
  mapLinkHref: '/search-map',
  resultsPerPage: 20,
}

// ----------------------------------------
// STATES CONFIGURATION
// ----------------------------------------

export const defaultStatesConfig: SearchStatesConfig = {
  error: {
    title: 'Unable to Load Properties',
    message: 'Please try again later or contact support.',
    resetText: 'Reset Search',
  },
  empty: {
    title: 'No properties match your search',
    message: 'Try adjusting your filters or broaden your search area.',
    suggestions: [
      'Remove some filters',
      'Expand your price range',
      'Search in nearby areas',
      'Reduce minimum bedrooms',
    ],
    resetText: 'Reset All Filters',
  },
}

// ----------------------------------------
// FULL PAGE CONFIGURATION
// ----------------------------------------

export const defaultSearchPageConfig: SearchPageConfig = {
  hero: defaultHeroConfig,
  sidebar: defaultSidebarConfig,
  results: defaultResultsConfig,
  states: defaultStatesConfig,
}

// ----------------------------------------
// CONFIGURATION HELPERS
// ----------------------------------------

export function createSearchPageConfig(
  overrides: Partial<SearchPageConfig> = {}
): SearchPageConfig {
  return {
    hero: { ...defaultHeroConfig, ...overrides.hero },
    sidebar: { ...defaultSidebarConfig, ...overrides.sidebar },
    results: { ...defaultResultsConfig, ...overrides.results },
    states: {
      error: { ...defaultStatesConfig.error, ...overrides.states?.error },
      empty: { ...defaultStatesConfig.empty, ...overrides.states?.empty },
    },
  }
}

export function extendSidebarConfig(
  overrides: Partial<SearchSidebarConfig>
): SearchSidebarConfig {
  return { ...defaultSidebarConfig, ...overrides }
}

export function extendHeroConfig(
  overrides: Partial<SearchHeroConfig>
): SearchHeroConfig {
  return { ...defaultHeroConfig, ...overrides }
}

export function getSortOptions(customOptions?: SortOption[]): SortOption[] {
  return customOptions || defaultSortOptions
}
