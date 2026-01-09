// ════════════════════════════════════════════════════════════════════════════
// STRATOS WEBSITE TRACKER - CLIENT SIDE
// ════════════════════════════════════════════════════════════════════════════

import type {
    TrackerConfig,
    StratosTrackerInterface,
    EventType,
    SessionData,
    CreateSessionRequest,
    CreateEventRequest,
    UpdateSessionRequest,
  } from '../../types/tracking'
  
  class StratosTracker implements StratosTrackerInterface {
    private config: TrackerConfig | null = null
    private sessionId: string | null = null
    private visitorId: string | null = null
    private sessionStartTime: number | null = null
    private pageViewCount: number = 0
    private isInitialized: boolean = false
    private eventQueue: CreateEventRequest[] = []
    private isProcessingQueue: boolean = false
  
    // Cookie/Storage keys
    private readonly VISITOR_ID_KEY = 'stratos_visitor_id'
    private readonly SESSION_ID_KEY = 'stratos_session_id'
    private readonly SESSION_START_KEY = 'stratos_session_start'
    private readonly COOKIE_CONSENT_KEY = 'stratos_cookie_consent'
    private readonly SESSION_TIMEOUT = 30 // minutes
  
    /**
     * Initialize the tracker
     */
    public init(config: TrackerConfig): void {
      this.config = config
      this.isInitialized = true
  
      if (this.config.debug) {
        console.log('[StratosTracker] Initialized with config:', config)
      }
  
      // Check cookie consent
      const hasConsent = this.getCookieConsent()
      if (!hasConsent && !this.config.cookieConsent) {
        console.warn('[StratosTracker] Cookie consent not granted. Tracking disabled.')
        return
      }
  
      // Get or create visitor ID
      this.visitorId = this.getOrCreateVisitorId()
  
      // Check for existing session or create new one
      this.sessionId = this.getStoredSessionId()
      if (this.sessionId && this.isSessionValid()) {
        if (this.config.debug) {
          console.log('[StratosTracker] Resuming existing session:', this.sessionId)
        }
        this.updateLastActivity()
      } else {
        // Start new session
        this.startSession()
      }
  
      // Track page view automatically
      this.trackPageView()
  
      // Set up beforeunload handler
      this.setupUnloadHandler()
  
      // Set up activity tracking
      this.setupActivityTracking()
    }
  
    /**
     * Start a new session
     */
    public async startSession(): Promise<void> {
      if (!this.config) {
        throw new Error('Tracker not initialized')
      }
  
      try {
        const sessionData = this.collectSessionData()
  
        const response = await fetch(`${this.config.apiEndpoint}/create-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`,
          },
          body: JSON.stringify(sessionData),
        })
  
        if (!response.ok) {
          throw new Error('Failed to create session')
        }
  
        const data = await response.json()
        this.sessionId = data.session_id
        this.sessionStartTime = Date.now()
        this.pageViewCount = 0
  
        // Store session info
        this.storeSessionId(this.sessionId)
        this.storeSessionStart(this.sessionStartTime)
  
        if (this.config.debug) {
          console.log('[StratosTracker] New session started:', this.sessionId)
        }
      } catch (error) {
        console.error('[StratosTracker] Failed to start session:', error)
      }
    }
  
    /**
     * End the current session
     */
    public async endSession(): Promise<void> {
      if (!this.sessionId || !this.sessionStartTime) return
  
      try {
        const duration = Math.floor((Date.now() - this.sessionStartTime) / 1000)
  
        const updateData: UpdateSessionRequest = {
          session_id: this.sessionId,
          exit_page: window.location.href,
          duration_seconds: duration,
          page_views_count: this.pageViewCount,
        }
  
        await fetch(`${this.config!.apiEndpoint}/update-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config!.apiKey}`,
          },
          body: JSON.stringify(updateData),
        })
  
        if (this.config!.debug) {
          console.log('[StratosTracker] Session ended:', this.sessionId)
        }
      } catch (error) {
        console.error('[StratosTracker] Failed to end session:', error)
      }
    }
  
    /**
     * Track a custom event
     */
    public async track(eventType: EventType, eventData?: Record<string, any>): Promise<void> {
      if (!this.isInitialized || !this.sessionId) {
        console.warn('[StratosTracker] Tracker not initialized or no active session')
        return
      }
  
      const event: CreateEventRequest = {
        session_id: this.sessionId,
        event_type: eventType,
        event_data: eventData,
      }
  
      // Add to queue
      this.eventQueue.push(event)
  
      // Process queue
      this.processEventQueue()
    }
  
    /**
     * Track page view
     */
    public async trackPageView(page?: string, title?: string): Promise<void> {
      this.pageViewCount++
  
      await this.track('page_view', {
        page: page || window.location.pathname,
        title: title || document.title,
        referrer: document.referrer,
      })
  
      if (this.config?.debug) {
        console.log('[StratosTracker] Page view tracked:', page || window.location.pathname)
      }
    }
  
    /**
     * Track property view
     */
    public async trackPropertyView(propertyId: string, eventData?: Record<string, any>): Promise<void> {
      if (!this.sessionId) return
  
      const event: CreateEventRequest = {
        session_id: this.sessionId,
        property_id: propertyId,
        event_type: 'property_view',
        event_data: eventData,
      }
  
      this.eventQueue.push(event)
      this.processEventQueue()
  
      if (this.config?.debug) {
        console.log('[StratosTracker] Property view tracked:', propertyId)
      }
    }
  
    /**
     * Get current session ID
     */
    public getSessionId(): string | null {
      return this.sessionId
    }
  
    /**
     * Get visitor ID
     */
    public getVisitorId(): string | null {
      return this.visitorId
    }
  
    /**
     * Set cookie consent
     */
    public setCookieConsent(consent: boolean): void {
      localStorage.setItem(this.COOKIE_CONSENT_KEY, consent ? 'true' : 'false')
  
      if (consent && !this.isInitialized && this.config) {
        this.init(this.config)
      }
    }
  
    // ═══════════════════════════════════════════════════════════
    // PRIVATE METHODS
    // ═══════════════════════════════════════════════════════════
  
    private getCookieConsent(): boolean {
      const consent = localStorage.getItem(this.COOKIE_CONSENT_KEY)
      return consent === 'true'
    }
  
    private getOrCreateVisitorId(): string {
      let visitorId = localStorage.getItem(this.VISITOR_ID_KEY)
  
      if (!visitorId) {
        visitorId = this.generateUUID()
        localStorage.setItem(this.VISITOR_ID_KEY, visitorId)
      }
  
      return visitorId
    }
  
    private getStoredSessionId(): string | null {
      return sessionStorage.getItem(this.SESSION_ID_KEY)
    }
  
    private storeSessionId(sessionId: string): void {
      sessionStorage.setItem(this.SESSION_ID_KEY, sessionId)
    }
  
    private storeSessionStart(timestamp: number): void {
      sessionStorage.setItem(this.SESSION_START_KEY, timestamp.toString())
    }
  
    private isSessionValid(): boolean {
      const startTime = sessionStorage.getItem(this.SESSION_START_KEY)
      if (!startTime) return false
  
      const elapsed = (Date.now() - parseInt(startTime)) / 1000 / 60 // minutes
      const timeout = this.config?.sessionTimeout || this.SESSION_TIMEOUT
  
      return elapsed < timeout
    }
  
    private updateLastActivity(): void {
      sessionStorage.setItem(this.SESSION_START_KEY, Date.now().toString())
    }
  
    private collectSessionData(): CreateSessionRequest {
      const urlParams = new URLSearchParams(window.location.search)
      const referrerUrl = document.referrer ? new URL(document.referrer) : null
  
      return {
        agency_id: this.config!.agencyId,
        visitor_id: this.visitorId!,
        device_type: this.getDeviceType(),
        browser: this.getBrowser(),
        operating_system: this.getOS(),
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        utm_source: urlParams.get('utm_source') || undefined,
        utm_medium: urlParams.get('utm_medium') || undefined,
        utm_campaign: urlParams.get('utm_campaign') || undefined,
        utm_content: urlParams.get('utm_content') || undefined,
        utm_term: urlParams.get('utm_term') || undefined,
        landing_page: window.location.href,
        referrer: document.referrer || undefined,
        referrer_domain: referrerUrl?.hostname || undefined,
      }
    }
  
    private async processEventQueue(): Promise<void> {
      if (this.isProcessingQueue || this.eventQueue.length === 0) return
  
      this.isProcessingQueue = true
  
      while (this.eventQueue.length > 0) {
        const event = this.eventQueue.shift()!
  
        try {
          await fetch(`${this.config!.apiEndpoint}/track-event`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.config!.apiKey}`,
            },
            body: JSON.stringify(event),
          })
  
          if (this.config!.debug) {
            console.log('[StratosTracker] Event tracked:', event.event_type)
          }
        } catch (error) {
          console.error('[StratosTracker] Failed to track event:', error)
          // Re-add to queue to retry
          this.eventQueue.unshift(event)
          break
        }
      }
  
      this.isProcessingQueue = false
    }
  
    private setupUnloadHandler(): void {
      window.addEventListener('beforeunload', () => {
        this.endSession()
      })
    }
  
    private setupActivityTracking(): void {
      // Update activity on user interaction
      const updateActivity = () => this.updateLastActivity()
  
      window.addEventListener('click', updateActivity)
      window.addEventListener('scroll', updateActivity)
      window.addEventListener('keydown', updateActivity)
    }
  
    private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
      const ua = navigator.userAgent
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet'
      }
      if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'mobile'
      }
      return 'desktop'
    }
  
    private getBrowser(): string {
      const ua = navigator.userAgent
      if (ua.includes('Firefox')) return 'Firefox'
      if (ua.includes('Chrome')) return 'Chrome'
      if (ua.includes('Safari')) return 'Safari'
      if (ua.includes('Edge')) return 'Edge'
      if (ua.includes('Opera')) return 'Opera'
      return 'Unknown'
    }
  
    private getOS(): string {
      const ua = navigator.userAgent
      if (ua.includes('Win')) return 'Windows'
      if (ua.includes('Mac')) return 'macOS'
      if (ua.includes('Linux')) return 'Linux'
      if (ua.includes('Android')) return 'Android'
      if (ua.includes('iOS')) return 'iOS'
      return 'Unknown'
    }
  
    private generateUUID(): string {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    }
  }
  
  // Create singleton instance
  const tracker = new StratosTracker()
  
  // Export singleton
  export default tracker