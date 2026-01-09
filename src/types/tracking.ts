// ════════════════════════════════════════════════════════════════════════════
// TRACKING TYPES - SHARED BETWEEN CLIENT & SERVER
// ════════════════════════════════════════════════════════════════════════════

export interface SessionData {
    session_id: string
    agency_id: string
    visitor_id: string
    device_type?: 'desktop' | 'mobile' | 'tablet'
    browser?: string
    browser_version?: string
    operating_system?: string
    screen_resolution?: string
    viewport_size?: string
    ip_address_hash?: string
    city?: string
    region?: string
    country?: string
    latitude?: number
    longitude?: number
    timezone?: string
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_content?: string
    utm_term?: string
    landing_page?: string
    exit_page?: string
    referrer?: string
    referrer_domain?: string
    page_views_count?: number
    duration_seconds?: number
    is_bounce?: boolean
    is_converted?: boolean
    metadata?: Record<string, any>
    created_at?: string
    last_activity_at?: string
  }
  
  export interface EventData {
    event_id?: string
    session_id: string
    property_id?: string
    event_type: EventType
    event_data?: Record<string, any>
    created_at?: string
  }
  
  export type EventType =
    | 'page_view'
    | 'property_view'
    | 'property_detail_view'
    | 'search'
    | 'filter_applied'
    | 'enquiry_form_viewed'
    | 'enquiry_form_started'
    | 'enquiry_submitted'
    | 'map_interaction'
    | 'floorplan_viewed'
    | 'gallery_viewed'
    | 'virtual_tour_started'
    | 'share_clicked'
    | 'save_property'
    | 'unsave_property'
    | 'phone_number_revealed'
    | 'email_clicked'
    | 'brochure_downloaded'
    | 'viewing_request'
  
export interface TrackerConfig {
  apiEndpoint: string
  anonKey: string         // Supabase ANON_KEY (for Authorization header) ✅ RENAMED
  agencyId: string
  agencyApiKey: string    // Agency Website API Key (for X-Agency-API-Key header)
  cookieConsent?: boolean
  sessionTimeout?: number
  debug?: boolean
}
  export interface StratosTrackerInterface {
    init(config: TrackerConfig): void
    getSessionId(): string | null
    getVisitorId(): string | null
    track(eventType: EventType, eventData?: Record<string, any>): Promise<void>
    trackPageView(page?: string, title?: string): Promise<void>
    trackPropertyView(propertyId: string, eventData?: Record<string, any>): Promise<void>
    startSession(): Promise<void>
    endSession(): Promise<void>
    setCookieConsent(consent: boolean): void
  }
  
  export interface CreateSessionRequest {
    agency_id: string
    visitor_id: string
    device_type?: string
    browser?: string
    browser_version?: string
    operating_system?: string
    screen_resolution?: string
    viewport_size?: string
    city?: string
    region?: string
    country?: string
    timezone?: string
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_content?: string
    utm_term?: string
    landing_page?: string
    referrer?: string
    referrer_domain?: string
    metadata?: Record<string, any>
  }
  
  export interface CreateEventRequest {
    session_id: string
    property_id?: string
    event_type: EventType
    event_data?: Record<string, any>
  }
  
  export interface UpdateSessionRequest {
    session_id: string
    exit_page?: string
    duration_seconds?: number
    page_views_count?: number
  }