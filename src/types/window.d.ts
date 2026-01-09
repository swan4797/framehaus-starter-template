// ════════════════════════════════════════════════════════════════════════════
// WINDOW OBJECT EXTENSIONS
// ════════════════════════════════════════════════════════════════════════════
// Extends the global Window interface to include custom properties
// used by the Stratos tracking system

interface StratosTrackerInterface {
    /**
     * Get the current session ID
     * @returns Session UUID or null if not initialized
     */
    getSessionId(): string | null
  
    /**
     * Track a custom event
     * @param eventType - Type of event (page_view, property_view, etc)
     * @param eventData - Additional event data as key-value pairs
     */
    track(eventType: string, eventData?: Record<string, any>): void
  
    /**
     * Initialize the tracker
     * @param config - Configuration options
     */
    init(config: {
      apiEndpoint: string
      apiKey: string
      agencyId: string
    }): void
  }
  
  declare global {
    interface Window {
      /**
       * Stratos website tracking system
       * Handles session management, event tracking, and analytics
       */
      StratosTracker?: StratosTrackerInterface
    }
  }
  
  // This export is required to make this a module
  export {}