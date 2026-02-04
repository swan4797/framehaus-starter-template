// ========================================
// SEARCH OPTIONS CONFIGURATION
// Centralized option definitions for search fields
// ========================================

import type { SelectOption, PriceOption } from './types'

// ----------------------------------------
// PRICE OPTIONS
// ----------------------------------------

/**
 * Sale price options (UK property market)
 * £100,000 to £2,000,000 in £100,000 increments
 */
export const SALE_PRICES: PriceOption[] = [
  { value: '', label: 'Any', numericValue: 0 },
  { value: '100000', label: '£100,000', numericValue: 100000 },
  { value: '200000', label: '£200,000', numericValue: 200000 },
  { value: '300000', label: '£300,000', numericValue: 300000 },
  { value: '400000', label: '£400,000', numericValue: 400000 },
  { value: '500000', label: '£500,000', numericValue: 500000 },
  { value: '600000', label: '£600,000', numericValue: 600000 },
  { value: '700000', label: '£700,000', numericValue: 700000 },
  { value: '800000', label: '£800,000', numericValue: 800000 },
  { value: '900000', label: '£900,000', numericValue: 900000 },
  { value: '1000000', label: '£1,000,000', numericValue: 1000000 },
  { value: '1100000', label: '£1,100,000', numericValue: 1100000 },
  { value: '1200000', label: '£1,200,000', numericValue: 1200000 },
  { value: '1300000', label: '£1,300,000', numericValue: 1300000 },
  { value: '1400000', label: '£1,400,000', numericValue: 1400000 },
  { value: '1500000', label: '£1,500,000', numericValue: 1500000 },
  { value: '1600000', label: '£1,600,000', numericValue: 1600000 },
  { value: '1700000', label: '£1,700,000', numericValue: 1700000 },
  { value: '1800000', label: '£1,800,000', numericValue: 1800000 },
  { value: '1900000', label: '£1,900,000', numericValue: 1900000 },
  { value: '2000000', label: '£2,000,000', numericValue: 2000000 },
]

/**
 * Rental price options (UK market, per month)
 * £500 to £5,000 in £500 increments
 */
export const RENT_PRICES: PriceOption[] = [
  { value: '', label: 'Any', numericValue: 0 },
  { value: '500', label: '£500 pcm', numericValue: 500 },
  { value: '1000', label: '£1,000 pcm', numericValue: 1000 },
  { value: '1500', label: '£1,500 pcm', numericValue: 1500 },
  { value: '2000', label: '£2,000 pcm', numericValue: 2000 },
  { value: '2500', label: '£2,500 pcm', numericValue: 2500 },
  { value: '3000', label: '£3,000 pcm', numericValue: 3000 },
  { value: '3500', label: '£3,500 pcm', numericValue: 3500 },
  { value: '4000', label: '£4,000 pcm', numericValue: 4000 },
  { value: '4500', label: '£4,500 pcm', numericValue: 4500 },
  { value: '5000', label: '£5,000 pcm', numericValue: 5000 },
]

/**
 * Get price options based on listing type
 */
export function getPriceOptions(listingType: 'sale' | 'let'): PriceOption[] {
  return listingType === 'sale' ? SALE_PRICES : RENT_PRICES
}

// ----------------------------------------
// BEDROOM OPTIONS
// ----------------------------------------

export const BEDROOM_OPTIONS: SelectOption[] = [
  { value: '', label: 'Any' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
  { value: '5', label: '5+' },
  { value: '6', label: '6+' },
]

// ----------------------------------------
// BATHROOM OPTIONS
// ----------------------------------------

export const BATHROOM_OPTIONS: SelectOption[] = [
  { value: '', label: 'Any' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
]

// ----------------------------------------
// RECEPTION OPTIONS
// ----------------------------------------

export const RECEPTION_OPTIONS: SelectOption[] = [
  { value: '', label: 'Any' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
]

// ----------------------------------------
// PROPERTY TYPE OPTIONS
// ----------------------------------------

export const PROPERTY_TYPE_OPTIONS: SelectOption[] = [
  { value: '', label: 'All Types' },
  { value: 'detached', label: 'Detached' },
  { value: 'semi-detached', label: 'Semi-Detached' },
  { value: 'terraced', label: 'Terraced' },
  { value: 'end-terrace', label: 'End Terrace' },
  { value: 'flat', label: 'Flat' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'maisonette', label: 'Maisonette' },
  { value: 'bungalow', label: 'Bungalow' },
  { value: 'cottage', label: 'Cottage' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'land', label: 'Land' },
]

// ----------------------------------------
// SORT OPTIONS
// ----------------------------------------

export const SORT_OPTIONS: SelectOption[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'beds_desc', label: 'Most Bedrooms' },
  { value: 'beds_asc', label: 'Fewest Bedrooms' },
  { value: 'area_desc', label: 'Largest Area' },
  { value: 'area_asc', label: 'Smallest Area' },
  { value: 'epc_best', label: 'Best EPC Rating' },
]

// ----------------------------------------
// FEATURE CHECKBOXES
// ----------------------------------------

export interface FeatureOption {
  name: string
  label: string
  value: string
}

export const FEATURE_OPTIONS: FeatureOption[] = [
  { name: 'garden', label: 'Garden', value: 'true' },
  { name: 'new_build', label: 'New Build', value: 'true' },
  { name: 'recently_reduced', label: 'Reduced', value: 'true' },
  { name: 'shared_ownership', label: 'Shared Ownership', value: 'true' },
  { name: 'retirement_home', label: 'Retirement', value: 'true' },
]

// ----------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------

/**
 * Check if a value matches a select option
 */
export function isOptionSelected(optionValue: string, currentValue: string | number | undefined): boolean {
  if (currentValue === undefined || currentValue === null) return optionValue === ''
  return optionValue === currentValue.toString()
}

/**
 * Format price for display
 */
export function formatPrice(value: number, listingType: 'sale' | 'let'): string {
  if (value >= 1000000) {
    return `£${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`
  }
  if (value >= 1000) {
    return `£${(value / 1000).toFixed(0)}k`
  }
  return `£${value}`
}

/**
 * Get the price suffix based on listing type
 */
export function getPriceSuffix(listingType: 'sale' | 'let'): string {
  return listingType === 'let' ? '/pcm' : ''
}
