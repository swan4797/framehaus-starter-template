// ========================================
// STATIC PAGE COMPONENTS - TYPES
// Shared types for static page components
// ========================================

// Re-export page content types from lib
export type {
  PageContent,
  ContentBlock,
  SectionContent,
  ImageContent,
} from '../../lib/pages'

// ========================================
// HERO COMPONENT
// ========================================

export interface HeroTitleLine {
  text: string
  accent?: string // Word to highlight in coral
}

export interface HeroProps {
  /** Label displayed above the title (e.g., "For Buyers") */
  label?: string
  /** Title lines - supports accent highlighting */
  titleLines?: HeroTitleLine[]
  /** Simple title string (alternative to titleLines) */
  title?: string
  /** Tagline/description text */
  tagline?: string
  /** CTA button label */
  ctaLabel?: string
  /** CTA button URL */
  ctaUrl?: string
  /** Optional hero image URL */
  heroImage?: string
  /** Optional hero image alt text */
  heroImageAlt?: string
}

// ========================================
// SHOWCASE COMPONENTS
// ========================================

export type ShowcaseCardVariant = 'primary' | 'secondary' | 'blue' | 'amber'

export interface ShowcaseFeature {
  text: string
}

export interface ShowcaseCardProps {
  /** Card background color variant */
  variant?: ShowcaseCardVariant
  /** Main title */
  title?: string
  /** Subtitle (for secondary cards) */
  subtitle?: string
  /** Description text */
  description?: string
  /** Icon slot name or SVG content */
  icon?: string
  /** Feature list with checkmarks */
  features?: ShowcaseFeature[]
  /** Background image URL */
  image?: string
  /** Image alt text */
  imageAlt?: string
  /** Use tall image variant */
  tallImage?: boolean
}

export interface ShowcaseGridProps {
  /** Add top padding */
  withTopPadding?: boolean
}

// ========================================
// CONTENT SECTION COMPONENTS
// ========================================

export interface ContentHighlight {
  value: string
  label: string
}

export interface ContentAction {
  label: string
  url: string
  variant?: 'primary' | 'secondary'
  icon?: boolean // Show arrow icon
}

export interface ContentRowProps {
  /** Section label (e.g., "Our Services") */
  label?: string
  /** Section title */
  title?: string
  /** Rich text HTML content */
  content?: string
  /** List items (rendered with checkmarks) */
  listItems?: string[]
  /** Optional image */
  image?: string
  /** Image alt text */
  imageAlt?: string
  /** Stats/highlights row */
  highlights?: ContentHighlight[]
  /** CTA buttons */
  actions?: ContentAction[]
  /** CTA variant with background */
  isCta?: boolean
  /** Block key for CMS content injection */
  blockKey?: string
}

export interface ContentSectionProps {
  /** Additional CSS class */
  class?: string
}

// ========================================
// CTA SECTION COMPONENT
// ========================================

export interface CtaSectionProps {
  /** Main heading */
  title?: string
  /** Description text */
  description?: string
  /** CTA buttons */
  actions?: ContentAction[]
}

// ========================================
// PARTNERS CAROUSEL COMPONENT
// ========================================

export interface PartnersCarouselProps {
  /** Label above the carousel */
  label?: string
  /** Partner names/logos */
  partners?: string[]
}

// ========================================
// TESTIMONIAL COMPONENT
// ========================================

export interface TestimonialAuthor {
  name: string
  role?: string
}

export interface TestimonialProps {
  /** Quote text */
  quote?: string
  /** Author information */
  author?: TestimonialAuthor
  /** Avatar image URLs */
  avatars?: string[]
}

// ========================================
// PAGE CONFIGURATION
// ========================================

export interface StaticPageConfig {
  hero: HeroProps
  showcase?: {
    primaryCard: ShowcaseCardProps
    secondaryCard: ShowcaseCardProps
  }
  contentSections?: ContentRowProps[]
  cta?: CtaSectionProps
  partners?: PartnersCarouselProps
  testimonial?: TestimonialProps
}
