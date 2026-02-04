// ========================================
// MAP COMPONENTS INDEX
// ========================================

// Main component
export { MapSearchLeaflet } from './MapSearchLeaflet'

// Card components
export {
  MapPropertyCard,
  MapEmptyState,
  MapLoadingState,
  MapSidebarHeader,
  type MapPropertyCardProps,
  type MapEmptyStateProps,
  type MapSidebarHeaderProps,
} from './cards'

// Marker utilities
export {
  getPropertyUrl,
  getPropertyPrice,
  isSaleListing,
  getPropertyImage,
  createPriceMarkerIcon,
  createDotMarkerIcon,
  createPropertyMarker,
  getDefaultPopupContent,
  createClusterIconFunction,
  type MarkerOptions,
} from './markers'

// Filters panel
export { MapFiltersPanel, type MapFilters } from './MapFiltersPanel'

// Re-export config types for convenience
export type {
  MapConfig,
  MapCardConfig,
  MapMarkerConfig,
  MapSidebarConfig,
  MapClusterConfig,
  MapCardLayout,
  MapMarkerStyle,
  SidebarPosition,
} from '../../config/map'

export {
  mapConfigs,
  getMapConfig,
  getCardConfig,
  getMarkerConfig,
  createMapConfig,
  formatMarkerPrice,
  formatCardPrice,
  defaultCardConfig,
  defaultMarkerConfig,
} from '../../config/map'
