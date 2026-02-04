// ========================================
// CONFIGURATION INDEX
// Centralized exports for all config modules
// ========================================

// Site configuration
export {
  siteConfig,
  getSiteConfig,
  type SiteConfig,
} from './site'

// Form configurations
export {
  formConfigs,
  getFormConfig,
  createFormConfig,
  getSharedField,
  SHARED_FIELDS,
  ENQUIRY_TYPE_OPTIONS,
  PROPERTY_INTEREST_OPTIONS,
  PROPERTY_TYPE_OPTIONS as FORM_PROPERTY_TYPE_OPTIONS,
  BEDROOMS_OPTIONS as FORM_BEDROOMS_OPTIONS,
  TIME_FRAME_OPTIONS,
  type FormFieldType,
  type FormFieldConfig,
  type FormFieldOption,
  type FormSection,
  type FormConfig,
} from './forms'

// Search configurations
export {
  searchConfigs,
  getSearchConfig,
  createSearchConfig,
  getSearchField,
  extendSearchConfig,
  SEARCH_FIELDS,
  // Re-exported from search/config/options
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
  type SearchFieldType,
  type SearchFieldConfig,
  type SearchVariant,
  type SearchConfig,
  type SelectOption,
  type PriceOption,
} from './search'

// Blog configurations
export {
  blogConfigs,
  getBlogConfig,
  createBlogConfig,
  getCardConfig as getBlogCardConfig,
  getResponsiveColumns as getBlogResponsiveColumns,
  defaultCardConfig as defaultBlogCardConfig,
  type BlogCardVariant,
  type BlogGridColumns,
  type BlogCardConfig,
  type BlogGridConfig,
  type BlogConfig,
} from './blog'

// Team configurations
export {
  teamConfigs,
  getTeamConfig,
  createTeamConfig,
  getCardConfig as getTeamCardConfig,
  getResponsiveColumns as getTeamResponsiveColumns,
  filterByDepartment,
  defaultCardConfig as defaultTeamCardConfig,
  type TeamCardVariant,
  type TeamGridColumns,
  type TeamCardConfig,
  type TeamGridConfig,
  type TeamConfig,
} from './team'

// Navigation configurations
export {
  navigationConfig,
  createNavigationConfig,
  isNavItemActive,
  isNavItemOrChildActive,
  flattenNav,
  getBreadcrumbs,
  type NavItem,
  type NavigationConfig,
} from './navigation'

// API configuration (existing)
export { API_CONFIG } from './api'
