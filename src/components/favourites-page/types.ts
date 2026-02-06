// ========================================
// FAVOURITES PAGE TYPES
// Type definitions for favourites page components
// ========================================

import type { Property } from '../../types/database'

// ----------------------------------------
// FAVOURITE DATA TYPES
// ----------------------------------------

export interface FavouriteItem {
  property: Property
  favourited_at: string
}

// ----------------------------------------
// COMPONENT PROPS
// ----------------------------------------

export interface FavouritesHeroProps {
  title?: string
  subtitle?: string
}

export interface FavouritesHeaderProps {
  count: number
  onClearAll?: () => void
}

export interface FavouritesGridProps {
  class?: string
}

export interface FavouriteCardProps {
  favourite: FavouriteItem
  onRemove?: (propertyId: string) => void
}

export interface FavouritesLoadingStateProps {
  message?: string
}

export interface FavouritesEmptyStateProps {
  title?: string
  message?: string
  ctaText?: string
  ctaHref?: string
}

// ----------------------------------------
// CONFIGURATION TYPES
// ----------------------------------------

export interface FavouritesPageConfig {
  hero: FavouritesHeroConfig
  states: FavouritesStatesConfig
}

export interface FavouritesHeroConfig {
  title: string
  subtitle: string
}

export interface FavouritesStatesConfig {
  loading: {
    message: string
  }
  empty: {
    title: string
    message: string
    ctaText: string
    ctaHref: string
  }
}
