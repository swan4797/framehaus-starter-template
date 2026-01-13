// ========================================
// CLIENT SITE CONFIGURATION
// ========================================

/**
 * IMPORTANT: Set these environment variables in production
 * - PUBLIC_SUPABASE_URL
 * - PUBLIC_WEBSITE_API_KEY
 * - PUBLIC_BRANCH_ID (optional)
 */

export const config = {
    // API Configuration
  api: {
    baseUrl: import.meta.env.PUBLIC_SUPABASE_URL || '',
    functionsPath: '/functions/v1',
    apiKey: import.meta.env.PUBLIC_WEBSITE_API_KEY || '',
    branchId: import.meta.env.PUBLIC_BRANCH_ID || undefined,
  },

  // Site Configuration
  site: {
    name: 'Property Search',
    description: 'Find your perfect property',
    url: import.meta.env.SITE,
  },
  
    // GDPR & Privacy
    gdpr: {
      cookiePolicyUrl: '/cookie-policy',
      privacyPolicyUrl: '/privacy-policy',
      privacyPolicyVersion: '1.0',
      companyName: 'Your Estate Agency',
    },
  
    // Pagination
    pagination: {
      defaultLimit: 20,
      maxLimit: 100,
    },
  
    // Search Defaults
    search: {
      defaultSort: 'newest' as const,
      resultsPerPage: 20,
    },
  
    // Feature Flags
    features: {
      enableTracking: true,
      enableCookieConsent: true,
      showSimilarProperties: true,
      enablePropertySharing: true,
    },
  } as const
  
  // Validate required config
  if (!config.api.apiKey) {
    console.warn('⚠️ PUBLIC_WEBSITE_API_KEY not set. API calls will fail.')
  }
  
  if (!config.api.baseUrl) {
    console.warn('⚠️ PUBLIC_SUPABASE_URL not set. Using localhost.')
  }
  
  // Export individual configs for convenience
  export const apiConfig = config.api
  export const siteConfig = config.site
  export const gdprConfig = config.gdpr
  export const paginationConfig = config.pagination