// ========================================
// SEARCH CONFIGURATIONS
// Centralized search bar variants and field definitions
// ========================================

// Re-export options from existing config
export {
  SALE_PRICES,
  RENT_PRICES,
  BEDROOM_OPTIONS,
  BATHROOM_OPTIONS,
  RECEPTION_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  SORT_OPTIONS,
  FEATURE_OPTIONS,
  getPriceOptions,
  formatPrice,
  getPriceSuffix,
  isOptionSelected,
} from '../components/search/config/options'

export type { SelectOption, PriceOption } from '../components/search/config/types'

// ----------------------------------------
// SEARCH FIELD TYPES
// ----------------------------------------

export type SearchFieldType =
  | 'location'
  | 'listingType'
  | 'priceMin'
  | 'priceMax'
  | 'bedrooms'
  | 'bathrooms'
  | 'receptions'
  | 'propertyType'
  | 'sort'
  | 'garden'
  | 'newBuild'
  | 'recentlyReduced'
  | 'sharedOwnership'
  | 'retirementHome'

export interface SearchFieldConfig {
  name: string
  type: SearchFieldType
  label: string
  placeholder?: string
  show: boolean
  width?: 'auto' | 'full' | '1/2' | '1/3' | '1/4'
  defaultValue?: string
}

export type SearchVariant = 'hero' | 'sidebar' | 'inline' | 'minimal' | 'map'

export interface SearchConfig {
  id: string
  variant: SearchVariant
  redirectUrl: string
  method?: 'GET' | 'POST'
  fields: SearchFieldConfig[]
  showAdvanced?: boolean
  advancedFields?: SearchFieldConfig[]
  showSubmitButton?: boolean
  submitButtonText?: string
  autoSubmit?: boolean
  layout?: 'horizontal' | 'vertical' | 'grid'
}

// ----------------------------------------
// SHARED FIELD DEFINITIONS
// ----------------------------------------

export const SEARCH_FIELDS: Record<string, SearchFieldConfig> = {
  location: {
    name: 'location',
    type: 'location',
    label: 'Location',
    placeholder: 'City, town or postcode',
    show: true,
    width: 'full',
  },
  listingType: {
    name: 'listing_type',
    type: 'listingType',
    label: 'Type',
    show: true,
    width: 'auto',
    defaultValue: 'sale',
  },
  priceMin: {
    name: 'min_price',
    type: 'priceMin',
    label: 'Min Price',
    show: true,
    width: 'auto',
  },
  priceMax: {
    name: 'max_price',
    type: 'priceMax',
    label: 'Max Price',
    show: true,
    width: 'auto',
  },
  bedrooms: {
    name: 'beds',
    type: 'bedrooms',
    label: 'Beds',
    show: true,
    width: 'auto',
  },
  bathrooms: {
    name: 'min_baths',
    type: 'bathrooms',
    label: 'Baths',
    show: false,
    width: 'auto',
  },
  receptions: {
    name: 'min_receptions',
    type: 'receptions',
    label: 'Receptions',
    show: false,
    width: 'auto',
  },
  propertyType: {
    name: 'property_type',
    type: 'propertyType',
    label: 'Property Type',
    show: false,
    width: 'auto',
  },
  sort: {
    name: 'sort_by',
    type: 'sort',
    label: 'Sort',
    show: true,
    width: 'auto',
    defaultValue: 'newest',
  },
  garden: {
    name: 'garden',
    type: 'garden',
    label: 'Garden',
    show: false,
  },
  newBuild: {
    name: 'new_build',
    type: 'newBuild',
    label: 'New Build',
    show: false,
  },
  recentlyReduced: {
    name: 'recently_reduced',
    type: 'recentlyReduced',
    label: 'Reduced',
    show: false,
  },
  sharedOwnership: {
    name: 'shared_ownership',
    type: 'sharedOwnership',
    label: 'Shared Ownership',
    show: false,
  },
  retirementHome: {
    name: 'retirement_home',
    type: 'retirementHome',
    label: 'Retirement',
    show: false,
  },
}

// ----------------------------------------
// SEARCH CONFIGURATIONS
// ----------------------------------------

export const searchConfigs: Record<string, SearchConfig> = {
  // Hero search - homepage prominent search
  hero: {
    id: 'hero-search',
    variant: 'hero',
    redirectUrl: '/search',
    method: 'GET',
    layout: 'horizontal',
    showSubmitButton: true,
    submitButtonText: 'Search',
    fields: [
      SEARCH_FIELDS.location,
      SEARCH_FIELDS.listingType,
      SEARCH_FIELDS.priceMax,
      SEARCH_FIELDS.bedrooms,
    ],
  },

  // Sidebar search - search results page filter panel
  sidebar: {
    id: 'sidebar-search',
    variant: 'sidebar',
    redirectUrl: '/search',
    method: 'GET',
    layout: 'vertical',
    showSubmitButton: true,
    submitButtonText: 'Update Results',
    autoSubmit: false,
    fields: [
      SEARCH_FIELDS.location,
      SEARCH_FIELDS.listingType,
      { ...SEARCH_FIELDS.priceMin, show: true },
      { ...SEARCH_FIELDS.priceMax, show: true },
      SEARCH_FIELDS.bedrooms,
      { ...SEARCH_FIELDS.propertyType, show: true },
    ],
    showAdvanced: true,
    advancedFields: [
      { ...SEARCH_FIELDS.bathrooms, show: true },
      { ...SEARCH_FIELDS.receptions, show: true },
      { ...SEARCH_FIELDS.garden, show: true },
      { ...SEARCH_FIELDS.newBuild, show: true },
      { ...SEARCH_FIELDS.recentlyReduced, show: true },
    ],
  },

  // Inline search - compact search bar
  inline: {
    id: 'inline-search',
    variant: 'inline',
    redirectUrl: '/search',
    method: 'GET',
    layout: 'horizontal',
    showSubmitButton: true,
    submitButtonText: 'Search',
    fields: [
      SEARCH_FIELDS.location,
      SEARCH_FIELDS.listingType,
      SEARCH_FIELDS.bedrooms,
    ],
  },

  // Minimal search - single location field
  minimal: {
    id: 'minimal-search',
    variant: 'minimal',
    redirectUrl: '/search',
    method: 'GET',
    layout: 'horizontal',
    showSubmitButton: true,
    submitButtonText: 'Search',
    fields: [
      SEARCH_FIELDS.location,
    ],
  },

  // Map search - map view filters
  map: {
    id: 'map-search',
    variant: 'map',
    redirectUrl: '/search',
    method: 'GET',
    layout: 'horizontal',
    autoSubmit: true,
    showSubmitButton: false,
    fields: [
      SEARCH_FIELDS.listingType,
      SEARCH_FIELDS.priceMax,
      SEARCH_FIELDS.bedrooms,
      { ...SEARCH_FIELDS.propertyType, show: true },
    ],
  },

  // Results bar - search results page top bar
  resultsBar: {
    id: 'results-bar-search',
    variant: 'inline',
    redirectUrl: '/search',
    method: 'GET',
    layout: 'horizontal',
    autoSubmit: true,
    showSubmitButton: false,
    fields: [
      { ...SEARCH_FIELDS.sort, show: true },
    ],
  },
}

// ----------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------

/**
 * Get a search configuration by ID
 */
export function getSearchConfig(configId: string): SearchConfig | undefined {
  return searchConfigs[configId]
}

/**
 * Create a custom search config with defaults
 */
export function createSearchConfig(
  config: Partial<SearchConfig> & { id: string }
): SearchConfig {
  return {
    variant: 'inline',
    redirectUrl: '/search',
    method: 'GET',
    layout: 'horizontal',
    showSubmitButton: true,
    submitButtonText: 'Search',
    autoSubmit: false,
    fields: [SEARCH_FIELDS.location],
    ...config,
  }
}

/**
 * Get field from shared fields by name
 */
export function getSearchField(fieldName: keyof typeof SEARCH_FIELDS): SearchFieldConfig {
  return { ...SEARCH_FIELDS[fieldName] }
}

/**
 * Merge search configs for customization
 */
export function extendSearchConfig(
  baseConfigId: string,
  overrides: Partial<SearchConfig>
): SearchConfig {
  const base = searchConfigs[baseConfigId]
  if (!base) {
    throw new Error(`Search config "${baseConfigId}" not found`)
  }

  return {
    ...base,
    ...overrides,
    fields: overrides.fields || base.fields,
    advancedFields: overrides.advancedFields || base.advancedFields,
  }
}

// ========================================
// SEARCH PAGE CONFIGURATION
// Configuration for search results page components
// ========================================

// ----------------------------------------
// SEARCH PAGE TYPES
// ----------------------------------------

export interface SortOption {
  value: string
  label: string
}

export interface SearchPageHeroConfig {
  title: string
  subtitle: string
  showHero: boolean
}

export interface SearchPageSidebarConfig {
  showListingTypeToggle?: boolean
  showLocation?: boolean
  showMinPrice?: boolean
  showMaxPrice?: boolean
  showBedrooms?: boolean
  showPropertyType?: boolean
  showAdvancedToggle?: boolean
  advancedDefaultOpen?: boolean
  showBathrooms?: boolean
  showReceptions?: boolean
  showMinArea?: boolean
  showMaxArea?: boolean
  showEPCRating?: boolean
  showCouncilTaxBand?: boolean
  showParking?: boolean
  showTenure?: boolean
  showMinLeaseYears?: boolean
  showMaxServiceCharge?: boolean
  showGarden?: boolean
  showNewBuild?: boolean
  showRecentlyReduced?: boolean
  showFurnishing?: boolean
  submitButtonText?: string
  showResetButton?: boolean
}

export interface SearchPageResultsConfig {
  gridColumns: {
    mobile: number
    tablet: number
    desktop: number
  }
  showMapLink: boolean
  mapLinkHref: string
  resultsPerPage: number
}

export interface SearchPageStatesConfig {
  error: {
    title: string
    message: string
    resetText: string
  }
  empty: {
    title: string
    message: string
    suggestions: string[]
    resetText: string
  }
}

export interface SearchPageConfig {
  hero: SearchPageHeroConfig
  sidebar: SearchPageSidebarConfig
  results: SearchPageResultsConfig
  states: SearchPageStatesConfig
}

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
// PAGE HERO CONFIGURATION
// ----------------------------------------

export const defaultPageHeroConfig: SearchPageHeroConfig = {
  title: 'Find Your Dream Property',
  subtitle: 'Search thousands of properties with advanced filters',
  showHero: true,
}

// ----------------------------------------
// PAGE SIDEBAR CONFIGURATION
// ----------------------------------------

export const defaultPageSidebarConfig: SearchPageSidebarConfig = {
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
  submitButtonText: 'Search',
  showResetButton: true,
}

// ----------------------------------------
// PAGE RESULTS CONFIGURATION
// ----------------------------------------

export const defaultPageResultsConfig: SearchPageResultsConfig = {
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
// PAGE STATES CONFIGURATION
// ----------------------------------------

export const defaultPageStatesConfig: SearchPageStatesConfig = {
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
  hero: defaultPageHeroConfig,
  sidebar: defaultPageSidebarConfig,
  results: defaultPageResultsConfig,
  states: defaultPageStatesConfig,
}

// ----------------------------------------
// PAGE CONFIGURATION HELPERS
// ----------------------------------------

export function createSearchPageConfig(
  overrides: Partial<SearchPageConfig> = {}
): SearchPageConfig {
  return {
    hero: { ...defaultPageHeroConfig, ...overrides.hero },
    sidebar: { ...defaultPageSidebarConfig, ...overrides.sidebar },
    results: { ...defaultPageResultsConfig, ...overrides.results },
    states: {
      error: { ...defaultPageStatesConfig.error, ...overrides.states?.error },
      empty: { ...defaultPageStatesConfig.empty, ...overrides.states?.empty },
    },
  }
}

export function extendPageSidebarConfig(
  overrides: Partial<SearchPageSidebarConfig>
): SearchPageSidebarConfig {
  return { ...defaultPageSidebarConfig, ...overrides }
}

export function extendPageHeroConfig(
  overrides: Partial<SearchPageHeroConfig>
): SearchPageHeroConfig {
  return { ...defaultPageHeroConfig, ...overrides }
}

export function getSortOptions(customOptions?: SortOption[]): SortOption[] {
  return customOptions || defaultSortOptions
}
