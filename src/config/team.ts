// ========================================
// TEAM CONFIGURATIONS
// Display and layout settings for team components
// ========================================

// ----------------------------------------
// TYPES
// ----------------------------------------

export type TeamCardVariant = 'default' | 'detailed' | 'minimal' | 'horizontal'
export type TeamGridColumns = 2 | 3 | 4 | 5

export interface TeamCardConfig {
  variant: TeamCardVariant
  showPhoto: boolean
  showRole: boolean
  showBio: boolean
  showEmail: boolean
  showPhone: boolean
  showSocial: boolean
  bioMaxLines: number
  imageAspectRatio: '1/1' | '3/4' | '4/5'
}

export interface TeamGridConfig {
  columns: TeamGridColumns
  gap: 'sm' | 'md' | 'lg'
  cardConfig: Partial<TeamCardConfig>
}

export interface TeamConfig {
  // Grid settings
  grid: TeamGridConfig

  // Featured members
  showFeaturedSection: boolean
  featuredColumns: TeamGridColumns
  featuredCardConfig: Partial<TeamCardConfig>

  // Filters
  showDepartmentFilter: boolean
  departments: string[]

  // Layout
  maxWidth: string
  featuredMaxWidth: string

  // Pagination
  membersPerPage: number
  showPagination: boolean
}

// ----------------------------------------
// DEFAULT CARD CONFIG
// ----------------------------------------

export const defaultCardConfig: TeamCardConfig = {
  variant: 'default',
  showPhoto: true,
  showRole: true,
  showBio: true,
  showEmail: true,
  showPhone: true,
  showSocial: true,
  bioMaxLines: 2,
  imageAspectRatio: '1/1',
}

// ----------------------------------------
// PRESET CONFIGURATIONS
// ----------------------------------------

export const teamConfigs: Record<string, TeamConfig> = {
  // Main team page
  fullPage: {
    grid: {
      columns: 4,
      gap: 'lg',
      cardConfig: {
        variant: 'default',
        showBio: true,
        bioMaxLines: 2,
      },
    },
    showFeaturedSection: true,
    featuredColumns: 3,
    featuredCardConfig: {
      variant: 'detailed',
      showBio: true,
      bioMaxLines: 3,
    },
    showDepartmentFilter: true,
    departments: ['Sales', 'Lettings', 'Management', 'Administration'],
    maxWidth: '1400px',
    featuredMaxWidth: '1024px',
    membersPerPage: 12,
    showPagination: true,
  },

  // Homepage team section
  homepage: {
    grid: {
      columns: 4,
      gap: 'lg',
      cardConfig: {
        variant: 'default',
        showBio: false,
        showEmail: false,
        showPhone: false,
      },
    },
    showFeaturedSection: false,
    featuredColumns: 3,
    featuredCardConfig: {},
    showDepartmentFilter: false,
    departments: [],
    maxWidth: '1280px',
    featuredMaxWidth: '1024px',
    membersPerPage: 4,
    showPagination: false,
  },

  // Compact sidebar/widget
  compact: {
    grid: {
      columns: 2,
      gap: 'sm',
      cardConfig: {
        variant: 'minimal',
        showBio: false,
        showEmail: false,
        showPhone: false,
        showSocial: false,
      },
    },
    showFeaturedSection: false,
    featuredColumns: 2,
    featuredCardConfig: {},
    showDepartmentFilter: false,
    departments: [],
    maxWidth: '600px',
    featuredMaxWidth: '400px',
    membersPerPage: 4,
    showPagination: false,
  },

  // Contact page team strip
  contactPage: {
    grid: {
      columns: 3,
      gap: 'md',
      cardConfig: {
        variant: 'horizontal',
        showBio: false,
        showPhone: true,
        showEmail: true,
        showSocial: false,
      },
    },
    showFeaturedSection: false,
    featuredColumns: 3,
    featuredCardConfig: {},
    showDepartmentFilter: false,
    departments: [],
    maxWidth: '1000px',
    featuredMaxWidth: '800px',
    membersPerPage: 6,
    showPagination: false,
  },
}

// ----------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------

/**
 * Get a team configuration by ID
 */
export function getTeamConfig(configId: string): TeamConfig | undefined {
  return teamConfigs[configId]
}

/**
 * Merge card config with defaults
 */
export function getCardConfig(overrides?: Partial<TeamCardConfig>): TeamCardConfig {
  return {
    ...defaultCardConfig,
    ...overrides,
  }
}

/**
 * Create a custom team config with defaults
 */
export function createTeamConfig(config: Partial<TeamConfig>): TeamConfig {
  const defaultConfig = teamConfigs.fullPage
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
    featuredCardConfig: {
      ...defaultConfig.featuredCardConfig,
      ...config.featuredCardConfig,
    },
  }
}

/**
 * Get responsive columns based on screen width
 */
export function getResponsiveColumns(columns: TeamGridColumns): {
  mobile: number
  tablet: number
  desktop: number
} {
  return {
    mobile: columns <= 2 ? 1 : 2,
    tablet: Math.min(3, columns),
    desktop: columns,
  }
}

/**
 * Filter members by department
 */
export function filterByDepartment<T extends { department?: string | null }>(
  members: T[],
  department: string | null
): T[] {
  if (!department) return members
  return members.filter(m => m.department === department)
}
