// ========================================
// API CLIENT
// Type-safe functions to call Edge Functions
// ========================================

import { apiConfig } from '../lib/config'
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
// BASE API CLIENT
// ========================================

class ApiClient {
  private baseUrl: string
  private apiKey: string
  private branchId?: string

  constructor() {
    this.baseUrl = `${apiConfig.baseUrl}${apiConfig.functionsPath}`
    this.apiKey = apiConfig.apiKey
    this.branchId = apiConfig.branchId
  }

  /**
   * Get common headers for all requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
    }

    if (this.branchId) {
      headers['X-Branch-ID'] = this.branchId
    }

    return headers
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