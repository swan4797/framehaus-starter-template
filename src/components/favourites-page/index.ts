// ========================================
// FAVOURITES PAGE - CENTRAL EXPORTS
// ========================================

// Types
export type {
  FavouriteItem,
  FavouriteProperty,
  FavouritesHeroProps,
  FavouritesLoadingStateProps,
  FavouritesEmptyStateProps,
  FavouritesPageConfig,
} from './types'

// Configuration
export { defaultHeroConfig, defaultStatesConfig } from './config'

// Components are imported directly in Astro files:
// - layout/FavouritesPageLayout.astro
// - layout/FavouritesContainer.astro
// - hero/FavouritesHero.astro
// - header/FavouritesHeader.astro
// - grid/FavouritesGrid.astro
// - states/FavouritesLoadingState.astro
// - states/FavouritesEmptyState.astro
// - card/FavouriteCard.scss (global styles)
// - scripts/favourites-page-client.ts (client-side logic)
