// ========================================
// SITE CONFIGURATION
// Global site-wide settings
// ========================================

export interface SiteConfig {
  // Basic Info
  name: string
  tagline: string
  description: string

  // URLs
  url: string

  // Contact
  email: string
  phone: string
  address: string

  // Social
  social: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
    youtube?: string
    tiktok?: string
  }

  // SEO
  seo: {
    titleSeparator: string
    defaultImage: string
  }

  // Features
  features: {
    enableBlog: boolean
    enableTeam: boolean
    enableValuations: boolean
    enableSearch: boolean
    enableFavorites: boolean
    enableCookieConsent: boolean
    enableTracking: boolean
  }

  // Design
  design: {
    maxWidth: string
    primaryColor: string
    fontFamily: string
  }
}

/**
 * Default site configuration
 * Override these values per-client
 */
export const siteConfig: SiteConfig = {
  // Basic Info
  name: 'Estate Agency',
  tagline: 'Find Your Perfect Home',
  description: 'Professional estate agency services for buying, selling, and renting properties.',

  // URLs
  url: 'https://example.com',

  // Contact (defaults - populated from brand settings at runtime)
  email: 'info@example.com',
  phone: '01onal1 123 4567',
  address: '123 High Street, London',

  // Social
  social: {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
  },

  // SEO
  seo: {
    titleSeparator: ' | ',
    defaultImage: '/images/og-image.jpg',
  },

  // Features - toggle functionality
  features: {
    enableBlog: true,
    enableTeam: true,
    enableValuations: true,
    enableSearch: true,
    enableFavorites: true,
    enableCookieConsent: true,
    enableTracking: true,
  },

  // Design
  design: {
    maxWidth: '1280px',
    primaryColor: '#FF5A5F',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
}

/**
 * Get site config with optional overrides
 */
export function getSiteConfig(overrides?: Partial<SiteConfig>): SiteConfig {
  return {
    ...siteConfig,
    ...overrides,
    social: {
      ...siteConfig.social,
      ...overrides?.social,
    },
    seo: {
      ...siteConfig.seo,
      ...overrides?.seo,
    },
    features: {
      ...siteConfig.features,
      ...overrides?.features,
    },
    design: {
      ...siteConfig.design,
      ...overrides?.design,
    },
  }
}
