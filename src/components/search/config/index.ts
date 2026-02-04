// ========================================
// SEARCH CONFIG EXPORTS
// Central export point for all search configuration
// ========================================

// Types
export type {
  SearchBarVariant,
  SearchBarTheme,
  SelectOption,
  PriceOption,
  SearchFieldsConfig,
  AdvancedPanelConfig,
  SearchUIConfig,
  SearchBehaviorConfig,
  SearchBarProps,
  SearchPreset,
} from './types'

export {
  DEFAULT_SEARCH_PROPS,
  SEARCH_PRESETS,
} from './types'

// Options
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
  isOptionSelected,
  formatPrice,
  getPriceSuffix,
} from './options'

export type { FeatureOption } from './options'
