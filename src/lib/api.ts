// ========================================
// API CLIENT - CORS FIX APPLIED
// Removed x-branch-id header (only using x-api-key)
// ========================================

import { apiConfig } from './config'
import type {
  Property,
  PropertySearchParams,
  PropertySearchResponse,
  EnquiryFormData,
  EnquiryResponse,
  ApiResponse,
  TrackingEvent,
} from '../types/database'

// ========================================
// MAP TYPES
// ========================================

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

export interface MapSearchParams {
  bounds: MapBounds
  zoom?: number
  filters?: {
    listing_type?: 'sale' | 'let' | 'for-sale' | 'to-let'
    min_price?: number
    max_price?: number
    beds?: number
    min_baths?: number
    property_type?: string
    property_style?: string
  }
  return_format?: 'geojson' | 'array'
}

export interface MapSearchResponse {
  success: boolean
  count: number
  zoom_level: number
  agency: {
    id: string
    name: string
    brand_color?: string
    secondary_color?: string
  }
  bounds: MapBounds
  properties: PropertyMapData[]
  geojson?: any
  price_range?: {
    min: number
    max: number
    avg: number
  }
}

export interface PropertyMapData {
  id: string
  display_address: string
  latitude: number
  longitude: number
  price: number | null
  asking_price: number | null
  rent_amount: number | null
  listing_type: string
  bedrooms: number
  bathrooms: number | null
  receptions: number | null
  property_type: string
  property_style: string | null
  is_featured: boolean
  agent_ref: string | null
  main_image_url: string | null
}

// ========================================
// BASE API CLIENT
// ========================================

class ApiClient {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = `${apiConfig.baseUrl}${apiConfig.functionsPath}`
    this.apiKey = apiConfig.apiKey
  }

  /**
   * Get common headers for all requests
   * ONLY uses x-api-key (no x-branch-id to avoid CORS issues)
   */
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
    }
  }

  /**
   * Generic GET request
   */
  private async get<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>
  ): Promise<ApiResponse<T>> {
    try {
      // Build URL with query parameters
      const url = new URL(`${this.baseUrl}/${endpoint}`)
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            url.searchParams.append(key, String(value))
          }
        })
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(),
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`API GET Error (${endpoint}):`, error)
      return {
        error: true,
        message: 'Network error. Please check your connection.',
      }
    }
  }

  /**
   * Generic POST request
   */
  private async post<T>(
    endpoint: string,
    body: any
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`API POST Error (${endpoint}):`, error)
      return {
        error: true,
        message: 'Network error. Please check your connection.',
      }
    }
  }

  // ========================================
  // PROPERTY ENDPOINTS
  // ========================================

  /**
   * Search properties with filters
   */
  async searchProperties(
    params: PropertySearchParams
  ): Promise<ApiResponse<PropertySearchResponse>> {
    return this.get<PropertySearchResponse>('get-properties', params as any)
  }

  /**
   * Get single property details
   */
  async getPropertyDetails(propertyId: string): Promise<ApiResponse<Property>> {
    return this.get<Property>('get-property-details', { property_id: propertyId })
  }

  // ========================================
  // MAP ENDPOINTS
  // ========================================

  /**
   * Search properties for map view with bounds
   */
  async searchPropertiesMap(
    bounds: MapBounds,
    zoom?: number,
    filters?: MapSearchParams['filters']
  ): Promise<ApiResponse<MapSearchResponse>> {
    return this.post<MapSearchResponse>('search-properties-map', {
      bounds,
      zoom,
      filters,
      return_format: 'geojson'
    })
  }

  /**
   * Get property map data (coordinates and links)
   */
  async getPropertyMapData(propertyId: string): Promise<ApiResponse<any>> {
    return this.post<any>('generate-property-map-url', {
      property_id: propertyId
    })
  }

  // ========================================
  // ENQUIRY ENDPOINTS
  // ========================================

  /**
   * Submit an enquiry
   */
  async submitEnquiry(
    enquiry: EnquiryFormData,
    sessionId: string,
    sourcePage: string
  ): Promise<EnquiryResponse> {
    const payload = {
      ...enquiry,
      session_id: sessionId,
      source_page: sourcePage,
      landing_page: window.location.href,
      referrer_url: document.referrer || undefined,
      utm_source: new URLSearchParams(window.location.search).get('utm_source') || undefined,
      utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || undefined,
      utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined,
      gdpr_consent_source: 'enquiry_form',
      privacy_policy_version: '1.0',
    }

    const response = await this.post<EnquiryResponse>('submit-enquiry', payload)

    if ('error' in response) {
      return {
        success: false,
        message: response.message,
        errors: response.details?.errors,
      }
    }

    return response.data
  }

  // ========================================
  // TRACKING ENDPOINTS
  // ========================================

  /**
   * Track an event
   */
  async trackEvent(event: Partial<TrackingEvent>): Promise<boolean> {
    const response = await this.post<{ tracked: boolean }>('track-event', event)
    
    if ('error' in response) {
      console.error('Tracking error:', response.message)
      return false
    }

    return response.data.tracked
  }
}

// ========================================
// EXPORT SINGLETON INSTANCE
// ========================================

export const api = new ApiClient()

// ========================================
// CONVENIENCE FUNCTIONS
// ========================================

/**
 * Search properties
 */
export async function searchProperties(
  params: PropertySearchParams
): Promise<PropertySearchResponse | null> {
  const response = await api.searchProperties(params)

  if ('error' in response) {
    console.error('Search error:', response.message)
    return null
  }

  return response.data
}

/**
 * Get property details
 */
export async function getPropertyDetails(
  propertyId: string
): Promise<Property | null> {
  const response = await api.getPropertyDetails(propertyId)

  if ('error' in response) {
    console.error('Property details error:', response.message)
    return null
  }

  return response.data
}

/**
 * Search properties for map (with bounds)
 */
export async function searchPropertiesMap(
  bounds: MapBounds,
  zoom?: number,
  filters?: MapSearchParams['filters']
): Promise<MapSearchResponse | null> {
  const response = await api.searchPropertiesMap(bounds, zoom, filters)

  // Handle error responses
  if ('error' in response) {
    console.error('Map search error:', response.message)
    return null
  }

  // Handle Edge Function direct response (has 'success' field)
  if ('success' in response && response.success) {
    return response as any as MapSearchResponse
  }

  // Handle wrapped response (has 'data' field)
  if ('data' in response) {
    return response.data
  }

  // Unknown format
  console.error('Map search error: Unknown response format', response)
  return null
}

/**
 * Get property map data
 */
export async function getPropertyMapData(
  propertyId: string
): Promise<any | null> {
  const response = await api.getPropertyMapData(propertyId)

  if ('error' in response) {
    console.error('Property map data error:', response.message)
    return null
  }

  return response.data
}

/**
 * Submit enquiry
 */
export async function submitEnquiry(
  enquiry: EnquiryFormData,
  sessionId: string
): Promise<EnquiryResponse> {
  return api.submitEnquiry(enquiry, sessionId, window.location.href)
}

/**
 * Track event
 */
export async function trackEvent(
  eventType: string,
  data?: Record<string, any>
): Promise<void> {
  // Implementation will be in the tracker script
  // This is just a placeholder for type safety
  console.log('Track event:', eventType, data)
}