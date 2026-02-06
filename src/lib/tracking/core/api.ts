/**
 * Stratos Tracking - API Communication
 *
 * Handles sending events to the Stratos API via fetch and sendBeacon.
 *
 * @module tracking/core/api
 */

import type { EventData, RequiredTrackerConfig } from '../types'
import { getSessionId, getVisitorId } from '../session'

// ========================================
// API COMMUNICATION
// ========================================

/**
 * Send event to Stratos API using fetch
 */
export async function sendEvent(
  config: RequiredTrackerConfig,
  payload: EventData,
  log: (...args: any[]) => void
): Promise<void> {
  try {
    const url = `${config.apiUrl}/functions/v1/track-event`

    log('Sending event:', payload.event_type, payload)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
      },
      credentials: 'omit', // Prevent CORS credential issues
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('[StratosTracker] Event failed:', error)
      return
    }

    const result = await response.json()
    log('Event sent successfully:', result)
  } catch (error) {
    console.error('[StratosTracker] Error sending event:', error)
  }
}

/**
 * Send event using sendBeacon (for page exit events)
 * More reliable than fetch for unload events
 *
 * NOTE: sendBeacon cannot send custom headers, so we include the API key
 * as a query parameter for authentication. We use text/plain content type
 * to avoid triggering CORS preflight (application/json requires preflight).
 */
export function sendBeacon(
  config: RequiredTrackerConfig,
  eventType: string,
  eventData: Record<string, any> | undefined,
  log: (...args: any[]) => void
): void {
  const sessionId = getSessionId()
  const visitorId = getVisitorId()

  const payload: EventData = {
    event_type: eventType,
    session_id: sessionId,
    visitor_id: visitorId,
    page_url: window.location.href,
    page_title: document.title,
    event_data: eventData,
  }

  if (eventData?.property_id) {
    payload.property_id = eventData.property_id
  }

  if (eventData?.article_id) {
    payload.article_id = eventData.article_id
  }

  // Include API key as query param since sendBeacon can't set headers
  // Use text/plain to avoid CORS preflight (application/json triggers preflight)
  const url = `${config.apiUrl}/functions/v1/track-event?api_key=${encodeURIComponent(config.apiKey)}`
  const blob = new Blob([JSON.stringify(payload)], { type: 'text/plain' })

  if (navigator.sendBeacon) {
    const success = navigator.sendBeacon(url, blob)
    log('Beacon sent:', eventType, success ? '(success)' : '(failed)')
  } else {
    // Fallback for browsers without sendBeacon
    sendEvent(config, payload, log)
  }
}

/**
 * Build a standard event payload
 */
export function buildEventPayload(
  eventType: string,
  eventData?: Record<string, any>
): EventData {
  const sessionId = getSessionId()
  const visitorId = getVisitorId()

  const payload: EventData = {
    event_type: eventType,
    session_id: sessionId,
    visitor_id: visitorId,
    page_url: window.location.href,
    page_title: document.title,
    referrer: document.referrer || undefined,
    event_data: eventData,
  }

  // Add property_id to top level if present
  if (eventData?.property_id) {
    payload.property_id = eventData.property_id
  }

  // Add article_id to top level if present
  if (eventData?.article_id) {
    payload.article_id = eventData.article_id
  }

  return payload
}
