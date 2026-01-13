// ========================================
// BRAND SETTINGS TYPES
// Type definitions for brand settings
// ========================================

export interface BrandSettings {
    // Core Identity
    business_name?: string
    tagline?: string
    about_text?: string
    mission_statement?: string
    value_propositions?: string[]
  
    // Color Palette
    primary_color: string
    secondary_color: string
    accent_color: string
    text_primary: string
    text_secondary: string
    text_light: string
    background_primary: string
    background_secondary: string
    background_dark: string
    success_color?: string
    warning_color?: string
    error_color?: string
    info_color?: string
  
    // Typography
    heading_font_family: string
    body_font_family: string
    heading_font_weight: string
    body_font_weight: string
    font_size_base?: number
  
    // Logos & Assets
    logo_main_url?: string | null
    logo_light_url?: string | null
    logo_dark_url?: string | null
    logo_icon_url?: string | null
    favicon_url?: string | null
    hero_background_url?: string | null
    about_image_url?: string | null
    team_image_url?: string | null
  
    // Styling
    border_radius: 'none' | 'small' | 'medium' | 'large' | 'full'
    button_style: 'solid' | 'outline' | 'ghost'
    shadow_intensity: 'none' | 'small' | 'medium' | 'large'
    border_radius_sm?: number
    border_radius_md?: number
    border_radius_lg?: number
    border_radius_xl?: number
  
    // Contact
    contact_email?: string
    contact_phone?: string
    contact_address_line_1?: string
    contact_address_line_2?: string
    contact_city?: string
    contact_postcode?: string
    office_hours?: Record<string, string>
  
    // Social Media
    facebook_url?: string | null
    twitter_url?: string | null
    instagram_url?: string | null
    linkedin_url?: string | null
    youtube_url?: string | null
    tiktok_url?: string | null
    facebook_handle?: string
    twitter_handle?: string
    instagram_handle?: string
  
    // SEO
    meta_description?: string
    meta_keywords?: string[]
    og_image_url?: string | null
    og_title?: string
    og_description?: string
  
    // Custom
    custom_css?: string
    custom_fonts?: any
  
    // Features
    show_testimonials: boolean
    show_team_section: boolean
    show_contact_form: boolean
    show_live_chat?: boolean
    show_property_search: boolean
  
    // Metadata
    is_default?: boolean
  }
  
  export interface BrandResponse {
    success: boolean
    data: BrandSettings
  }
  
  export interface BrandError {
    error: true
    message: string
    code: string
    details?: string
  }