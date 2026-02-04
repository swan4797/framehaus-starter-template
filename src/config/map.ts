// ========================================
// MAP CONFIGURATIONS
// Display and behaviour settings for map components
// ========================================

// ----------------------------------------
// TYPES
// ----------------------------------------

export type MapCardLayout = 'horizontal' | 'vertical' | 'compact' | 'minimal'
export type MapMarkerStyle = 'price-pin' | 'dot' | 'icon'
export type SidebarPosition = 'left' | 'right' | 'none'

export interface MapCardConfig {
  layout: MapCardLayout
  showImage: boolean
  showBadges: boolean
  showSpecs: boolean
  showViewLink: boolean
  imageWidth: number
  truncateAddress: number
}

export interface MapMarkerConfig {
  style: MapMarkerStyle
  showPrice: boolean
  size: { width: number; height: number }
  colors: {
    sale: string
    let: string
    featured: string
    cluster: string
  }
}

export interface MapSidebarConfig {
  position: SidebarPosition
  width: number
  showHeader: boolean
  showPriceRange: boolean
}

export interface MapClusterConfig {
  maxRadius: number
  spiderfyOnMaxZoom: boolean
  showCoverageOnHover: boolean
  sizes: {
    small: number
    medium: number
    large: number
  }
}

export interface MapConfig {
  // Card display
  card: MapCardConfig

  // Marker display
  marker: MapMarkerConfig

  // Sidebar
  sidebar: MapSidebarConfig

  // Clustering
  cluster: MapClusterConfig

  // Map behaviour
  autoCenter: boolean
  defaultZoom: number
  maxZoom: number
  minZoom: number

  // Popup
  popup: {
    showImage: boolean
    imageHeight: number
    showPrice: boolean
    showSpecs: boolean
  }

  // Empty state
  emptyState: {
    title: string
    hint: string
  }
}

// ----------------------------------------
// DEFAULT CARD CONFIG
// ----------------------------------------

export const defaultCardConfig: MapCardConfig = {
  layout: 'horizontal',
  showImage: true,
  showBadges: true,
  showSpecs: true,
  showViewLink: true,
  imageWidth: 140,
  truncateAddress: 2,
}

// ----------------------------------------
// DEFAULT MARKER CONFIG
// ----------------------------------------

export const defaultMarkerConfig: MapMarkerConfig = {
  style: 'price-pin',
  showPrice: true,
  size: { width: 80, height: 36 },
  colors: {
    sale: 'var(--color-primary, #FF5A5F)',
    let: '#3B82F6',
    featured: '#F59E0B',
    cluster: 'var(--color-primary, #FF5A5F)',
  },
}

// ----------------------------------------
// PRESET CONFIGURATIONS
// ----------------------------------------

export const mapConfigs: Record<string, MapConfig> = {
  // Default full-featured map
  default: {
    card: {
      layout: 'horizontal',
      showImage: true,
      showBadges: true,
      showSpecs: true,
      showViewLink: true,
      imageWidth: 140,
      truncateAddress: 2,
    },
    marker: {
      style: 'price-pin',
      showPrice: true,
      size: { width: 80, height: 36 },
      colors: {
        sale: 'var(--color-primary, #FF5A5F)',
        let: '#3B82F6',
        featured: '#F59E0B',
        cluster: 'var(--color-primary, #FF5A5F)',
      },
    },
    sidebar: {
      position: 'left',
      width: 420,
      showHeader: true,
      showPriceRange: true,
    },
    cluster: {
      maxRadius: 60,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      sizes: { small: 40, medium: 44, large: 48 },
    },
    autoCenter: true,
    defaultZoom: 12,
    maxZoom: 19,
    minZoom: 5,
    popup: {
      showImage: true,
      imageHeight: 140,
      showPrice: true,
      showSpecs: true,
    },
    emptyState: {
      title: 'No properties in this area',
      hint: 'Try zooming out or moving the map',
    },
  },

  // Compact sidebar variant
  compact: {
    card: {
      layout: 'compact',
      showImage: true,
      showBadges: true,
      showSpecs: false,
      showViewLink: false,
      imageWidth: 100,
      truncateAddress: 1,
    },
    marker: {
      style: 'price-pin',
      showPrice: true,
      size: { width: 70, height: 32 },
      colors: {
        sale: 'var(--color-primary, #FF5A5F)',
        let: '#3B82F6',
        featured: '#F59E0B',
        cluster: 'var(--color-primary, #FF5A5F)',
      },
    },
    sidebar: {
      position: 'left',
      width: 320,
      showHeader: true,
      showPriceRange: false,
    },
    cluster: {
      maxRadius: 60,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      sizes: { small: 36, medium: 40, large: 44 },
    },
    autoCenter: true,
    defaultZoom: 12,
    maxZoom: 19,
    minZoom: 5,
    popup: {
      showImage: true,
      imageHeight: 120,
      showPrice: true,
      showSpecs: false,
    },
    emptyState: {
      title: 'No properties found',
      hint: 'Adjust your search area',
    },
  },

  // Full-width map (no sidebar)
  fullMap: {
    card: {
      layout: 'minimal',
      showImage: false,
      showBadges: false,
      showSpecs: false,
      showViewLink: false,
      imageWidth: 0,
      truncateAddress: 1,
    },
    marker: {
      style: 'price-pin',
      showPrice: true,
      size: { width: 80, height: 36 },
      colors: {
        sale: 'var(--color-primary, #FF5A5F)',
        let: '#3B82F6',
        featured: '#F59E0B',
        cluster: 'var(--color-primary, #FF5A5F)',
      },
    },
    sidebar: {
      position: 'none',
      width: 0,
      showHeader: false,
      showPriceRange: false,
    },
    cluster: {
      maxRadius: 60,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      sizes: { small: 40, medium: 44, large: 48 },
    },
    autoCenter: true,
    defaultZoom: 12,
    maxZoom: 19,
    minZoom: 5,
    popup: {
      showImage: true,
      imageHeight: 140,
      showPrice: true,
      showSpecs: true,
    },
    emptyState: {
      title: 'No properties in this area',
      hint: 'Try zooming out or moving the map',
    },
  },

  // Vertical cards layout
  vertical: {
    card: {
      layout: 'vertical',
      showImage: true,
      showBadges: true,
      showSpecs: true,
      showViewLink: true,
      imageWidth: 0, // Full width for vertical
      truncateAddress: 2,
    },
    marker: {
      style: 'price-pin',
      showPrice: true,
      size: { width: 80, height: 36 },
      colors: {
        sale: 'var(--color-primary, #FF5A5F)',
        let: '#3B82F6',
        featured: '#F59E0B',
        cluster: 'var(--color-primary, #FF5A5F)',
      },
    },
    sidebar: {
      position: 'left',
      width: 380,
      showHeader: true,
      showPriceRange: true,
    },
    cluster: {
      maxRadius: 60,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      sizes: { small: 40, medium: 44, large: 48 },
    },
    autoCenter: true,
    defaultZoom: 12,
    maxZoom: 19,
    minZoom: 5,
    popup: {
      showImage: true,
      imageHeight: 140,
      showPrice: true,
      showSpecs: true,
    },
    emptyState: {
      title: 'No properties in this area',
      hint: 'Try zooming out or moving the map',
    },
  },
}

// ----------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------

/**
 * Get a map configuration by ID
 */
export function getMapConfig(configId: string): MapConfig {
  return mapConfigs[configId] || mapConfigs.default
}

/**
 * Merge card config with defaults
 */
export function getCardConfig(overrides?: Partial<MapCardConfig>): MapCardConfig {
  return {
    ...defaultCardConfig,
    ...overrides,
  }
}

/**
 * Merge marker config with defaults
 */
export function getMarkerConfig(overrides?: Partial<MapMarkerConfig>): MapMarkerConfig {
  return {
    ...defaultMarkerConfig,
    ...overrides,
  }
}

/**
 * Create a custom map config with defaults
 */
export function createMapConfig(config: Partial<MapConfig>): MapConfig {
  const defaultConfig = mapConfigs.default
  return {
    ...defaultConfig,
    ...config,
    card: { ...defaultConfig.card, ...config.card },
    marker: { ...defaultConfig.marker, ...config.marker },
    sidebar: { ...defaultConfig.sidebar, ...config.sidebar },
    cluster: { ...defaultConfig.cluster, ...config.cluster },
    popup: { ...defaultConfig.popup, ...config.popup },
    emptyState: { ...defaultConfig.emptyState, ...config.emptyState },
  }
}

// ----------------------------------------
// PRICE FORMATTING
// ----------------------------------------

/**
 * Format price for display on markers
 */
export function formatMarkerPrice(price: number, isSale: boolean): string {
  if (isSale) {
    if (price >= 1000000) {
      return `£${(price / 1000000).toFixed(1)}m`
    }
    return `£${(price / 1000).toFixed(0)}k`
  }
  return `£${price.toLocaleString()}pcm`
}

/**
 * Format price for display on cards
 */
export function formatCardPrice(price: number): string {
  return `£${price.toLocaleString()}`
}
