// ========================================
// BRAND SETTINGS CLIENT
// Follows same pattern as api.ts
// ========================================

import { apiConfig } from './config'
import type { BrandSettings, BrandResponse, BrandError } from '../types/brand'

// Cache for brand settings
let brandSettingsCache: BrandSettings | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 1000 // 10 seconds for development

// ========================================
// BRAND API CLIENT
// ========================================

class BrandApiClient {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = `${apiConfig.baseUrl}${apiConfig.functionsPath}`
    this.apiKey = apiConfig.apiKey
  }

  /**
   * Get common headers for all requests
   */
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
    }
  }

  /**
   * Fetch brand settings from API
   */
  async getBrandSettings(forceRefresh: boolean = false): Promise<BrandSettings> {
    // Return cached data if valid
    if (
      !forceRefresh &&
      brandSettingsCache &&
      Date.now() - cacheTimestamp < CACHE_DURATION
    ) {
      console.log('[Brand] Using cached brand settings')
      return brandSettingsCache
    }

    try {
      console.log('[Brand] Fetching brand settings from API')

      const response = await fetch(`${this.baseUrl}/get-brand-settings`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[Brand] Request failed:', errorText)
        throw new Error(`HTTP ${response.status}`)
      }

      const result: BrandResponse = await response.json()

      if (!result.success || !result.data) {
        throw new Error('Invalid response from brand settings API')
      }

      // Update cache
      brandSettingsCache = result.data
      cacheTimestamp = Date.now()

      console.log('[Brand] Brand settings fetched successfully')

      return result.data
    } catch (error) {
      console.error('[Brand] Error fetching brand settings:', error)
      return getDefaultBrandSettings()
    }
  }

  /**
   * Clear brand settings cache
   */
  clearCache(): void {
    brandSettingsCache = null
    cacheTimestamp = 0
    console.log('[Brand] Brand settings cache cleared')
  }
}

// ========================================
// EXPORT SINGLETON INSTANCE
// ========================================

const brandApi = new BrandApiClient()

// ========================================
// CONVENIENCE FUNCTIONS
// ========================================

/**
 * Fetch brand settings from API
 * Includes caching to prevent excessive API calls
 */
export async function fetchBrandSettings(
  forceRefresh: boolean = false
): Promise<BrandSettings> {
  return brandApi.getBrandSettings(forceRefresh)
}

/**
 * Get default brand settings (fallback)
 */
export function getDefaultBrandSettings(): BrandSettings {
  return {
    business_name: 'Your Estate Agency',
    tagline: '',
    primary_color: '#3c5b4b',
    secondary_color: '#f6f4f4',
    accent_color: '#10b981',
    text_primary: '#1f2937',
    text_secondary: '#6b7280',
    text_light: '#ffffff',
    background_primary: '#ffffff',
    background_secondary: '#f9fafb',
    background_dark: '#111827',
    heading_font_family: 'Garet',
    body_font_family: 'Inter',
    heading_font_weight: '700',
    body_font_weight: '400',
    border_radius: 'medium',
    button_style: 'solid',
    shadow_intensity: 'medium',
    show_testimonials: true,
    show_team_section: true,
    show_contact_form: true,
    show_property_search: true,
    is_default: true,
  }
}

/**
 * Clear brand settings cache
 * Useful when you know settings have changed
 */
export function clearBrandCache(): void {
  brandApi.clearCache()
}

/**
 * Get cached brand settings (synchronous)
 * Returns null if no cache available
 */
export function getCachedBrandSettings(): BrandSettings | null {
  if (brandSettingsCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return brandSettingsCache
  }
  return null
}

/**
 * Generate CSS variables from brand settings
 * Useful for injecting into <style> tags
 */
export function generateCssVariables(brand: BrandSettings): string {
  const borderRadiusMap = {
    none: '0px',
    small: '4px',
    medium: '8px',
    large: '12px',
    full: '9999px',
  }

  const shadowMap = {
    none: 'none',
    small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    medium: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    large: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  }

  return `
    --brand-primary: ${brand.primary_color};
    --brand-secondary: ${brand.secondary_color};
    --brand-accent: ${brand.accent_color};
    --brand-text-primary: ${brand.text_primary};
    --brand-text-secondary: ${brand.text_secondary};
    --brand-text-light: ${brand.text_light};
    --brand-bg-primary: ${brand.background_primary};
    --brand-bg-secondary: ${brand.background_secondary};
    --brand-bg-dark: ${brand.background_dark};
    --brand-success: ${brand.success_color || '#10b981'};
    --brand-warning: ${brand.warning_color || '#f59e0b'};
    --brand-error: ${brand.error_color || '#ef4444'};
    --brand-info: ${brand.info_color || '#3b82f6'};
    
    --brand-font-heading: ${brand.heading_font_family}, sans-serif;
    --brand-font-body: ${brand.body_font_family}, sans-serif;
    --brand-font-weight-heading: ${brand.heading_font_weight};
    --brand-font-weight-body: ${brand.body_font_weight};
    
    --brand-border-radius: ${borderRadiusMap[brand.border_radius]};
    --brand-shadow: ${shadowMap[brand.shadow_intensity]};
  `.trim()
}
/**
 * Get contact information from brand settings
 */
export function getContactInfo(brand: BrandSettings) {
    const addressParts = [
      brand.contact_address_line_1,
      brand.contact_address_line_2,
      brand.contact_city,
      brand.contact_postcode,
    ].filter(Boolean)
  
    return {
      email: brand.contact_email || '',
      phone: brand.contact_phone || '',
      address: addressParts.join(', '),
      addressLines: addressParts,
    }
  }
  
  /**
   * Get social media links from brand settings
   */
  export function getSocialLinks(brand: BrandSettings) {
    return {
      facebook: brand.facebook_url || null,
      twitter: brand.twitter_url || null,
      instagram: brand.instagram_url || null,
      linkedin: brand.linkedin_url || null,
      youtube: brand.youtube_url || null,
      tiktok: brand.tiktok_url || null,
    }
  }
  
  /**
   * Check if a feature is enabled
   */
  export function isFeatureEnabled(
    brand: BrandSettings,
    feature: 'show_testimonials' | 'show_team_section' | 'show_contact_form' | 'show_property_search'
  ): boolean {
    return brand[feature] ?? false
  }