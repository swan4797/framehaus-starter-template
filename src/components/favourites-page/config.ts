// ========================================
// FAVOURITES PAGE CONFIGURATION
// Centralized configuration for favourites page components
// ========================================

import type {
  FavouritesPageConfig,
  FavouritesHeroConfig,
  FavouritesStatesConfig,
} from './types'

// ----------------------------------------
// HERO CONFIGURATION
// ----------------------------------------

export const defaultHeroConfig: FavouritesHeroConfig = {
  title: 'Your Favourites',
  subtitle: 'Properties you\'ve saved for later',
}

// ----------------------------------------
// STATES CONFIGURATION
// ----------------------------------------

export const defaultStatesConfig: FavouritesStatesConfig = {
  loading: {
    message: 'Loading your favourites...',
  },
  empty: {
    title: 'No properties saved yet',
    message: 'Start browsing and click the heart icon to save properties here!',
    ctaText: 'Browse Properties',
    ctaHref: '/search',
  },
}

// ----------------------------------------
// FULL PAGE CONFIGURATION
// ----------------------------------------

export const defaultFavouritesPageConfig: FavouritesPageConfig = {
  hero: defaultHeroConfig,
  states: defaultStatesConfig,
}

// ----------------------------------------
// CONFIGURATION HELPERS
// ----------------------------------------

export function createFavouritesPageConfig(
  overrides: Partial<FavouritesPageConfig> = {}
): FavouritesPageConfig {
  return {
    hero: { ...defaultHeroConfig, ...overrides.hero },
    states: {
      loading: { ...defaultStatesConfig.loading, ...overrides.states?.loading },
      empty: { ...defaultStatesConfig.empty, ...overrides.states?.empty },
    },
  }
}

export function extendHeroConfig(
  overrides: Partial<FavouritesHeroConfig>
): FavouritesHeroConfig {
  return { ...defaultHeroConfig, ...overrides }
}
