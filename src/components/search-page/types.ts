// ========================================
// SEARCH PAGE TYPES
// Type definitions for search page components
// ========================================

import type { Property, PropertySearchParams, PropertySearchResponse } from '../../types/database'

// ----------------------------------------
// SEARCH PAGE PROPS
// ----------------------------------------

export interface SearchPageProps {
  searchParams: PropertySearchParams
  searchResponse: PropertySearchResponse | null
}

// ----------------------------------------
// COMPONENT PROPS
// ----------------------------------------

export interface SearchHeroProps {
  title?: string
  subtitle?: string
}

export interface SearchSidebarProps {
  currentParams: PropertySearchParams
  config?: SearchSidebarConfig
}

export interface SearchSidebarConfig {
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

export interface SearchResultsHeaderProps {
  total: number
  location?: string
  activeFiltersCount: number
  currentSortBy: string
  sortOptions: SortOption[]
  showMapLink?: boolean
  mapLinkHref?: string
}

export interface SearchResultsGridProps {
  properties: Property[]
  source?: string
}

export interface SearchControlsProps {
  activeFiltersCount: number
  currentSortBy: string
  sortOptions: SortOption[]
  showMapLink?: boolean
  mapLinkHref?: string
}

export interface SearchSortProps {
  currentSortBy: string
  options: SortOption[]
}

export interface SearchErrorStateProps {
  title?: string
  message?: string
  resetHref?: string
  resetText?: string
}

export interface SearchEmptyStateProps {
  title?: string
  message?: string
  suggestions?: string[]
  resetHref?: string
  resetText?: string
}

export interface SearchPaginationProps {
  currentPage: number
  totalPages: number
  totalResults: number
  searchParams: PropertySearchParams
}

// ----------------------------------------
// CONFIGURATION TYPES
// ----------------------------------------

export interface SortOption {
  value: string
  label: string
}

export interface SearchPageConfig {
  hero: SearchHeroConfig
  sidebar: SearchSidebarConfig
  results: SearchResultsConfig
  states: SearchStatesConfig
}

export interface SearchHeroConfig {
  title: string
  subtitle: string
  showHero: boolean
}

export interface SearchResultsConfig {
  gridColumns: {
    mobile: number
    tablet: number
    desktop: number
  }
  showMapLink: boolean
  mapLinkHref: string
  resultsPerPage: number
}

export interface SearchStatesConfig {
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

// ----------------------------------------
// COMPUTED VALUES
// ----------------------------------------

export interface SearchComputedValues {
  hasError: boolean
  properties: Property[]
  total: number
  totalPages: number
  activeFiltersCount: number
  listingTypeText: string
  locationText: string
  pageTitle: string
  metaDescription: string
}
