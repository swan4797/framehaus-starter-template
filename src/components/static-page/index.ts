// ========================================
// STATIC PAGE COMPONENTS - CENTRAL EXPORTS
// ========================================

// Types
export type {
  // Hero
  HeroProps,
  HeroTitleLine,
  // Showcase
  ShowcaseCardVariant,
  ShowcaseFeature,
  ShowcaseCardProps,
  ShowcaseGridProps,
  // Content
  ContentHighlight,
  ContentAction,
  ContentRowProps,
  ContentSectionProps,
  // CTA
  CtaSectionProps,
  // Partners
  PartnersCarouselProps,
  // Testimonial
  TestimonialAuthor,
  TestimonialProps,
  // Page Config
  StaticPageConfig,
  // Re-exported from lib
  PageContent,
  ContentBlock,
  SectionContent,
  ImageContent,
} from './types'

// Configuration
export {
  // Defaults
  defaultHeroConfig,
  defaultShowcaseCardConfig,
  defaultContentRowConfig,
  defaultCtaConfig,
  defaultPartnersConfig,
  defaultTestimonialConfig,
  // Page-specific configs
  buyersPageConfig,
  sellersPageConfig,
  landlordsPageConfig,
  tenantsPageConfig,
  aboutPageConfig,
} from './config'

// Components are imported directly in Astro files:
// - layout/StaticPageLayout.astro
// - hero/StaticHero.astro
// - showcase/ShowcaseGrid.astro
// - showcase/ShowcaseCard.astro
// - content/ContentSection.astro
// - content/ContentRow.astro
// - cta/CtaSection.astro
// - partners/PartnersCarousel.astro
// - testimonial/TestimonialSection.astro
