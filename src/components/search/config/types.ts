// ========================================
// SEARCH COMPONENT TYPES
// Core type definitions for search components
// ========================================

import type { PropertySearchParams } from '../../../types/database'

// ----------------------------------------
// COMPONENT VARIANTS
// ----------------------------------------

export type SearchBarVariant = 'hero' | 'compact' | 'sidebar' | 'inline'
export type SearchBarTheme = 'light' | 'dark'

// ----------------------------------------
// OPTION TYPES
// ----------------------------------------

export interface SelectOption {
  value: string
  label: string
}

export interface PriceOption extends SelectOption {
  numericValue?: number
}

// ----------------------------------------
// FIELD VISIBILITY CONFIG
// ----------------------------------------

export interface SearchFieldsConfig {
  // Core Fields
  showListingTypeToggle?: boolean
  showLocation?: boolean

  // Price Fields
  showMinPrice?: boolean
  showMaxPrice?: boolean

  // Room Fields
  showBedrooms?: boolean
  showBathrooms?: boolean
  showReceptions?: boolean

  // Property Details
  showPropertyType?: boolean
  showPropertyStyle?: boolean

  // Area & Size
  showMinArea?: boolean
  showMaxArea?: boolean

  // Energy & Costs
  showEPCRating?: boolean
  showMinEPCScore?: boolean
  showCouncilTaxBand?: boolean
  showMaxCouncilTax?: boolean

  // Parking
  showParking?: boolean
  showParkingSpaces?: boolean

  // Tenure & Ownership
  showTenure?: boolean
  showMinLeaseYears?: boolean
  showMaxServiceCharge?: boolean
  showMaxGroundRent?: boolean

  // Features
  showGarden?: boolean
  showNewBuild?: boolean
  showRecentlyReduced?: boolean
  showSharedOwnership?: boolean
  showRetirementHome?: boolean

  // Rental-Specific
  showFurnishing?: boolean
  showAvailableDate?: boolean
  showMaxDeposit?: boolean

  // Sorting
  showSortBy?: boolean
}

// ----------------------------------------
// ADVANCED PANEL CONFIG
// ----------------------------------------

export interface AdvancedPanelConfig {
  showAdvancedToggle?: boolean
  advancedDefaultOpen?: boolean
}

// ----------------------------------------
// UI CUSTOMIZATION
// ----------------------------------------

export interface SearchUIConfig {
  locationPlaceholder?: string
  submitButtonText?: string
  showSearchIcon?: boolean
  showResetButton?: boolean
  resetButtonText?: string
  advancedToggleText?: string
}

// ----------------------------------------
// BEHAVIOR CONFIG
// ----------------------------------------

export interface SearchBehaviorConfig {
  redirectOnSubmit?: boolean
  redirectUrl?: string
  onSubmit?: (params: PropertySearchParams) => void
  onFilterChange?: (filterName: string, value: string) => void
}

// ----------------------------------------
// MAIN PROPS INTERFACE
// ----------------------------------------

export interface SearchBarProps extends
  SearchFieldsConfig,
  AdvancedPanelConfig,
  SearchUIConfig,
  SearchBehaviorConfig {
  currentParams?: PropertySearchParams
  variant?: SearchBarVariant
  theme?: SearchBarTheme
  className?: string
}

// ----------------------------------------
// DEFAULT PROPS
// ----------------------------------------

export const DEFAULT_SEARCH_PROPS: Required<Omit<SearchBarProps, 'currentParams' | 'onSubmit' | 'onFilterChange'>> = {
  // Layout
  variant: 'sidebar',
  theme: 'light',
  className: '',

  // Core Fields
  showListingTypeToggle: false,
  showLocation: false,

  // Price Fields
  showMinPrice: false,
  showMaxPrice: false,

  // Room Fields
  showBedrooms: false,
  showBathrooms: false,
  showReceptions: false,

  // Property Details
  showPropertyType: false,
  showPropertyStyle: false,

  // Area
  showMinArea: false,
  showMaxArea: false,

  // Energy & Costs
  showEPCRating: false,
  showMinEPCScore: false,
  showCouncilTaxBand: false,
  showMaxCouncilTax: false,

  // Parking
  showParking: false,
  showParkingSpaces: false,

  // Tenure
  showTenure: false,
  showMinLeaseYears: false,
  showMaxServiceCharge: false,
  showMaxGroundRent: false,

  // Features
  showGarden: false,
  showNewBuild: false,
  showRecentlyReduced: false,
  showSharedOwnership: false,
  showRetirementHome: false,

  // Rental
  showFurnishing: false,
  showAvailableDate: false,
  showMaxDeposit: false,

  // Advanced
  showAdvancedToggle: false,
  advancedDefaultOpen: false,

  // Sorting
  showSortBy: false,

  // UI
  locationPlaceholder: 'Location or postcode',
  submitButtonText: 'Search Properties',
  showSearchIcon: true,
  showResetButton: true,
  resetButtonText: 'Reset',
  advancedToggleText: 'Advanced Filters',

  // Behavior
  redirectOnSubmit: true,
  redirectUrl: '/search',
}

// ----------------------------------------
// PRESET CONFIGURATIONS
// ----------------------------------------

/**
 * Preset configurations for common use cases.
 * Extend these to quickly create new search components.
 */
export const SEARCH_PRESETS = {
  /** Minimal search - just location and listing type */
  minimal: {
    showListingTypeToggle: true,
    showLocation: true,
  },

  /** Basic search - common fields without advanced options */
  basic: {
    showListingTypeToggle: true,
    showLocation: true,
    showMinPrice: true,
    showMaxPrice: true,
    showBedrooms: true,
    showPropertyType: true,
  },

  /** Full search - all fields with advanced toggle */
  full: {
    showListingTypeToggle: true,
    showLocation: true,
    showMinPrice: true,
    showMaxPrice: true,
    showBedrooms: true,
    showPropertyType: true,
    showAdvancedToggle: true,
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
  },

  /** Hero variant - compact for homepage */
  hero: {
    variant: 'hero' as const,
    showLocation: true,
    showMaxPrice: true,
    showBedrooms: true,
    showSearchIcon: true,
    showResetButton: false,
  },

  /** Sidebar variant - full featured for search page */
  sidebar: {
    variant: 'sidebar' as const,
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
    showResetButton: true,
  },
} as const

export type SearchPreset = keyof typeof SEARCH_PRESETS
