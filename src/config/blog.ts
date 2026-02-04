// ========================================
// BLOG CONFIGURATIONS
// Display and layout settings for blog components
// ========================================

// ----------------------------------------
// TYPES
// ----------------------------------------

export type BlogCardVariant = 'default' | 'featured' | 'compact' | 'minimal'
export type BlogGridColumns = 1 | 2 | 3 | 4

export interface BlogCardConfig {
  variant: BlogCardVariant
  showImage: boolean
  showAuthor: boolean
  showDate: boolean
  showReadTime: boolean
  showCategories: boolean
  showExcerpt: boolean
  showViewCount: boolean
  excerptLength: number
  imageAspectRatio: '16/9' | '16/10' | '4/3' | '1/1'
}

export interface BlogGridConfig {
  columns: BlogGridColumns
  gap: 'sm' | 'md' | 'lg'
  cardConfig: Partial<BlogCardConfig>
}

export interface BlogConfig {
  // Grid settings
  grid: BlogGridConfig

  // Pagination
  articlesPerPage: number

  // Featured articles
  showFeaturedSection: boolean
  featuredCount: number

  // Categories
  showCategoryFilter: boolean
  showCategoryBadges: boolean

  // Layout
  sidebarPosition: 'left' | 'right' | 'none'
  showNewsletter: boolean
  showRelatedArticles: boolean
  relatedArticlesCount: number
}

// ----------------------------------------
// DEFAULT CARD CONFIG
// ----------------------------------------

export const defaultCardConfig: BlogCardConfig = {
  variant: 'default',
  showImage: true,
  showAuthor: true,
  showDate: true,
  showReadTime: true,
  showCategories: true,
  showExcerpt: true,
  showViewCount: false,
  excerptLength: 120,
  imageAspectRatio: '16/10',
}

// ----------------------------------------
// PRESET CONFIGURATIONS
// ----------------------------------------

export const blogConfigs: Record<string, BlogConfig> = {
  // Homepage blog section
  homepage: {
    grid: {
      columns: 3,
      gap: 'lg',
      cardConfig: {
        variant: 'default',
        showAuthor: false,
        showViewCount: false,
        excerptLength: 100,
      },
    },
    articlesPerPage: 3,
    showFeaturedSection: false,
    featuredCount: 0,
    showCategoryFilter: false,
    showCategoryBadges: true,
    sidebarPosition: 'none',
    showNewsletter: false,
    showRelatedArticles: false,
    relatedArticlesCount: 0,
  },

  // Blog listing page
  listing: {
    grid: {
      columns: 3,
      gap: 'lg',
      cardConfig: {
        variant: 'default',
        showAuthor: true,
        showViewCount: false,
        excerptLength: 120,
      },
    },
    articlesPerPage: 9,
    showFeaturedSection: true,
    featuredCount: 1,
    showCategoryFilter: true,
    showCategoryBadges: true,
    sidebarPosition: 'none',
    showNewsletter: true,
    showRelatedArticles: false,
    relatedArticlesCount: 0,
  },

  // Blog article page
  article: {
    grid: {
      columns: 3,
      gap: 'md',
      cardConfig: {
        variant: 'compact',
        showAuthor: false,
        showViewCount: false,
        excerptLength: 80,
      },
    },
    articlesPerPage: 1,
    showFeaturedSection: false,
    featuredCount: 0,
    showCategoryFilter: false,
    showCategoryBadges: true,
    sidebarPosition: 'right',
    showNewsletter: true,
    showRelatedArticles: true,
    relatedArticlesCount: 3,
  },

  // Featured articles section
  featured: {
    grid: {
      columns: 3,
      gap: 'lg',
      cardConfig: {
        variant: 'featured',
        showAuthor: true,
        showViewCount: false,
        excerptLength: 140,
      },
    },
    articlesPerPage: 3,
    showFeaturedSection: false,
    featuredCount: 0,
    showCategoryFilter: false,
    showCategoryBadges: true,
    sidebarPosition: 'none',
    showNewsletter: false,
    showRelatedArticles: false,
    relatedArticlesCount: 0,
  },

  // Compact layout (e.g., footer or sidebar widget)
  compact: {
    grid: {
      columns: 1,
      gap: 'sm',
      cardConfig: {
        variant: 'minimal',
        showImage: false,
        showAuthor: false,
        showReadTime: false,
        showCategories: false,
        showExcerpt: false,
        showViewCount: false,
      },
    },
    articlesPerPage: 5,
    showFeaturedSection: false,
    featuredCount: 0,
    showCategoryFilter: false,
    showCategoryBadges: false,
    sidebarPosition: 'none',
    showNewsletter: false,
    showRelatedArticles: false,
    relatedArticlesCount: 0,
  },
}

// ----------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------

/**
 * Get a blog configuration by ID
 */
export function getBlogConfig(configId: string): BlogConfig | undefined {
  return blogConfigs[configId]
}

/**
 * Merge card config with defaults
 */
export function getCardConfig(overrides?: Partial<BlogCardConfig>): BlogCardConfig {
  return {
    ...defaultCardConfig,
    ...overrides,
  }
}

/**
 * Create a custom blog config with defaults
 */
export function createBlogConfig(config: Partial<BlogConfig>): BlogConfig {
  const defaultConfig = blogConfigs.listing
  return {
    ...defaultConfig,
    ...config,
    grid: {
      ...defaultConfig.grid,
      ...config.grid,
      cardConfig: {
        ...defaultConfig.grid.cardConfig,
        ...config.grid?.cardConfig,
      },
    },
  }
}

/**
 * Get responsive columns based on screen width
 */
export function getResponsiveColumns(columns: BlogGridColumns): {
  mobile: number
  tablet: number
  desktop: number
} {
  return {
    mobile: 1,
    tablet: Math.min(2, columns),
    desktop: columns,
  }
}
