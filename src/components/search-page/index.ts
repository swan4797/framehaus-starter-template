// ========================================
// SEARCH PAGE COMPONENTS
// Central exports for all search page modules
// ========================================

// Types
export type {
  SearchPageProps,
  SearchHeroProps,
  SearchSidebarProps,
  SearchSidebarConfig,
  SearchResultsHeaderProps,
  SearchResultsGridProps,
  SearchControlsProps,
  SearchSortProps,
  SearchErrorStateProps,
  SearchEmptyStateProps,
  SearchPaginationProps,
  SortOption,
  SearchPageConfig,
  SearchHeroConfig,
  SearchResultsConfig,
  SearchStatesConfig,
  SearchComputedValues,
} from './types'

// Configuration
export {
  defaultSortOptions,
  defaultHeroConfig,
  defaultSidebarConfig,
  defaultResultsConfig,
  defaultStatesConfig,
  defaultSearchPageConfig,
  createSearchPageConfig,
  extendSidebarConfig,
  extendHeroConfig,
  getSortOptions,
} from './config'

// Utilities
export {
  SEARCH_DEFAULTS,
  getIntParam,
  getBoolParam,
  getStringParam,
  parseSearchParams,
  computeSearchValues,
  countActiveFilters,
  buildSearchUrl,
  updateSortParam,
} from './utils/params'
