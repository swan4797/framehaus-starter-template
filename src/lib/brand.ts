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

// ========================================
// CSS GENERATION HELPERS
// ========================================

/**
 * Convert hex color to RGB values string
 */
export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '0, 0, 0'
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

/**
 * Darken a hex color by a percentage
 */
export function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.max((num >> 16) - amt, 0)
  const G = Math.max(((num >> 8) & 0x00ff) - amt, 0)
  const B = Math.max((num & 0x0000ff) - amt, 0)
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

/**
 * Lighten a hex color by a percentage
 */
export function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.min((num >> 16) + amt, 255)
  const G = Math.min(((num >> 8) & 0x00ff) + amt, 255)
  const B = Math.min((num & 0x0000ff) + amt, 255)
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

/**
 * Get border radius CSS value from setting
 */
export function getBorderRadiusValue(setting: string): string {
  const map: Record<string, string> = {
    none: '0',
    small: '4px',
    medium: '8px',
    large: '16px',
    full: '9999px',
  }
  return map[setting] || map.medium
}

/**
 * Get shadow CSS value from setting
 */
export function getShadowValue(setting: string): string {
  const map: Record<string, string> = {
    none: 'none',
    small: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03)',
    large: '0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.04)',
  }
  return map[setting] || map.medium
}

/**
 * Generate CSS variables from brand settings
 * Connects to the token system in /styles/tokens/
 */
export function generateCssVariables(brand: BrandSettings): string {
  const primaryDark = darkenColor(brand.primary_color, 10)
  const primaryLight = lightenColor(brand.primary_color, 10)

  // Derive additional colors from brand settings
  const textMuted = (brand as any).text_muted || '#9CA3AF'
  const bgTertiary = (brand as any).background_tertiary || darkenColor(brand.background_secondary, 2)
  const borderLight = (brand as any).border_light || '#E5E7EB'
  const borderMedium = (brand as any).border_medium || '#D1D5DB'
  const borderDark = (brand as any).border_dark || '#9CA3AF'

  return `
    /* Brand Colors - Dynamic from Stratos CRM */
    --color-primary: ${brand.primary_color};
    --color-primary-dark: ${primaryDark};
    --color-primary-light: ${primaryLight};
    --color-secondary: ${brand.secondary_color};
    --color-accent: ${brand.accent_color};

    /* Text Colors */
    --color-text-primary: ${brand.text_primary};
    --color-text-secondary: ${brand.text_secondary};
    --color-text-muted: ${textMuted};
    --color-text-light: ${brand.text_light};

    /* Background Colors */
    --color-bg-primary: ${brand.background_primary};
    --color-bg-secondary: ${brand.background_secondary};
    --color-bg-tertiary: ${bgTertiary};
    --color-bg-dark: ${brand.background_dark};

    /* Border Colors */
    --color-border-light: ${borderLight};
    --color-border-medium: ${borderMedium};
    --color-border-dark: ${borderDark};

    /* RGB versions for rgba() usage */
    --color-primary-rgb: ${hexToRgb(brand.primary_color)};
    --color-text-primary-rgb: ${hexToRgb(brand.text_primary)};
    --color-bg-primary-rgb: ${hexToRgb(brand.background_primary)};

    /* State Colors */
    --color-success: ${(brand as any).success_color || '#10B981'};
    --color-warning: ${(brand as any).warning_color || '#F59E0B'};
    --color-error: ${(brand as any).error_color || '#EF4444'};
    --color-info: ${(brand as any).info_color || '#3B82F6'};

    /* Typography */
    --font-family-heading: '${brand.heading_font_family}', system-ui, -apple-system, sans-serif;
    --font-family-body: '${brand.body_font_family}', system-ui, -apple-system, sans-serif;
    --font-weight-heading: ${brand.heading_font_weight};
    --font-weight-body: ${brand.body_font_weight};

    /* Effects - Dynamic from brand settings */
    --radius-brand: ${getBorderRadiusValue(brand.border_radius)};
    --shadow-brand: ${getShadowValue(brand.shadow_intensity)};

    /* Legacy aliases for backwards compatibility */
    --brand-primary: ${brand.primary_color};
    --brand-secondary: ${brand.secondary_color};
    --brand-accent: ${brand.accent_color};
  `.trim()
}

/**
 * Get Google Fonts URL for brand fonts
 */
export function getGoogleFontsUrl(brand: BrandSettings): string {
  const fonts = new Set([brand.heading_font_family, brand.body_font_family])
  const fontParams = Array.from(fonts)
    .filter(f => f && f !== 'system-ui' && f !== 'Inter')
    .map(f => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700;800`)
    .join('&')

  if (!fontParams) return ''
  return `https://fonts.googleapis.com/css2?${fontParams}&display=swap`
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