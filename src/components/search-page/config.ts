// ========================================
// SEARCH PAGE CONFIGURATION (Re-exports)
// All configuration now lives in src/config/search.ts
// This file provides backward-compatible exports
// ========================================

export {
  // Sort options
  defaultSortOptions,
  getSortOptions,
  type SortOption,

  // Hero config
  defaultPageHeroConfig as defaultHeroConfig,
  extendPageHeroConfig as extendHeroConfig,
  type SearchPageHeroConfig as SearchHeroConfig,

  // Sidebar config
  defaultPageSidebarConfig as defaultSidebarConfig,
  extendPageSidebarConfig as extendSidebarConfig,
  type SearchPageSidebarConfig as SearchSidebarConfig,

  // Results config
  defaultPageResultsConfig as defaultResultsConfig,
  type SearchPageResultsConfig as SearchResultsConfig,

  // States config
  defaultPageStatesConfig as defaultStatesConfig,
  type SearchPageStatesConfig as SearchStatesConfig,

  // Full page config
  defaultSearchPageConfig,
  createSearchPageConfig,
  type SearchPageConfig,
} from '../../config/search'
