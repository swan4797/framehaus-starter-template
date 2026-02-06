// ========================================
// FORM PAGE COMPONENTS - CENTRAL EXPORTS
// ========================================

// Types
export type {
  // Hero
  FormHeroProps,
  // FAQ
  FaqItem,
  FaqSectionProps,
  // Contact Info
  ContactInfo,
  SocialLinks,
  ContactInfoGridProps,
  // Form Message
  FormMessageProps,
  // Page Config
  FormPageConfig,
  // Re-exported from lib
  PageContent,
  ContentBlock,
  SectionContent,
  ImageContent,
} from './types'

// Configuration
export {
  // FAQ items
  contactFaqs,
  valuationFaqs,
  // Page configs
  contactPageConfig,
  valuationPageConfig,
  // Form options
  contactSubjectOptions,
  propertyTypeOptions,
  bedroomOptions,
  valuationReasonOptions,
} from './config'

// Components are imported directly in Astro files:
// - layout/FormPageLayout.astro
// - hero/FormHero.astro
// - faq/FaqSection.astro
// - contact-info/ContactInfoGrid.astro
