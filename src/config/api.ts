// src/config/api.ts
export const API_CONFIG = {
    endpoint: import.meta.env.PUBLIC_STRATOS_API_ENDPOINT,
    apiKey: import.meta.env.PUBLIC_STRATOS_API_KEY,
    agencyId: import.meta.env.PUBLIC_AGENCY_ID,
  }
  
  // Example: How search connects to CRM analytics
  /*
  1. USER searches for "3 bed houses in Manchester"
     ↓
  2. SearchForm.astro submits to /properties/search?location=Manchester&min_beds=3
     ↓
  3. search.astro (SSR) calls Edge Function: /search-properties
     ↓
  4. Edge Function queries Supabase properties table
     ↓
  5. Returns 24 properties matching criteria
     ↓
  6. User clicks on "123 Oak Avenue"
     ↓
  7. Tracker.ts fires: trackEvent('property_view', { property_id: 'abc-123' })
     ↓
  8. Data saved to session_events table
     ↓
  9. CRM Dashboard queries session_events
     ↓
  10. Agent sees: "123 Oak Avenue" has 247 views, 18 detail views, 3 enquiries
  */