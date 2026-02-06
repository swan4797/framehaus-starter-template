// ========================================
// FORM PAGE COMPONENT TYPES
// ========================================

// Re-export page content types from lib
export type { PageContent, ContentBlock, SectionContent, ImageContent } from '../../lib/pages'

// ========================================
// HERO TYPES
// ========================================

export interface FormHeroProps {
  title: string
  subtitle?: string
  /** Optional block key for CMS content injection */
  blockKey?: string
  /** Page content for CMS lookup */
  pageContent?: import('../../lib/pages').PageContent | null
}

// ========================================
// FAQ TYPES
// ========================================

export interface FaqItem {
  question: string
  answer: string
}

export interface FaqSectionProps {
  title?: string
  subtitle?: string
  items: FaqItem[]
  class?: string
}

// ========================================
// CONTACT INFO TYPES
// ========================================

export interface ContactInfo {
  email?: string
  phone?: string
  address?: string
}

export interface SocialLinks {
  facebook?: string
  instagram?: string
  linkedin?: string
  twitter?: string
  youtube?: string
  tiktok?: string
}

export interface ContactInfoGridProps {
  contactInfo: ContactInfo
  socialLinks?: SocialLinks
  class?: string
}

// ========================================
// FORM MESSAGE TYPES
// ========================================

export interface FormMessageProps {
  type: 'success' | 'error'
  title: string
  text: string
  id: string
  contactInfo?: ContactInfo
}

// ========================================
// FORM PAGE CONFIG
// ========================================

export interface FormPageConfig {
  hero: {
    title: string
    subtitle: string
    blockKey?: string
  }
  faq: {
    title: string
    subtitle: string
    items: FaqItem[]
  }
}
