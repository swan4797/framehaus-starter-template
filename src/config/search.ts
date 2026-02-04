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
