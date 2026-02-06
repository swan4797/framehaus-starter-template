/**
 * Stratos Tracking - Page Tracking Module
 *
 * Handles page view and page exit tracking.
 *
 * @module tracking/modules/page
 */

import type { RequiredTrackerConfig } from '../types'
import { sendEvent, sendBeacon, buildEventPayload } from '../core/api'

// ========================================
// PAGE TRACKING
// ========================================

/**
 * Track page view
 * GDPR: Only tracks if consent given (checked by caller)
 */
export function trackPageView(
  config: RequiredTrackerConfig,
  log: (...args: any[]) => void,
  additionalData?: Record<string, any>
): void {
  const payload = buildEventPayload('page_view', {
    page_url: window.location.href,
    page_title: document.title,
    referrer: document.referrer || undefined,
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    ...additionalData,
  })

  sendEvent(config, payload, log)
}

/**
 * Track page exit (sends time on page)
 */
export function trackPageExit(
  config: RequiredTrackerConfig,
  pageLoadTime: number,
  log: (...args: any[]) => void
): void {
  if (!pageLoadTime) return

  const timeOnPage = Math.floor((Date.now() - pageLoadTime) / 1000)

  // Only track if they spent at least 3 seconds
  if (timeOnPage < 3) return

  // Use sendBeacon for reliable exit tracking
  sendBeacon(config, 'page_exit', {
    page_url: window.location.href,
    time_on_page_seconds: timeOnPage,
  }, log)
}

/**
 * Set up automatic page exit tracking
 */
export function setupPageExitTracking(
  config: RequiredTrackerConfig,
  getPageLoadTime: () => number,
  log: (...args: any[]) => void
): void {
  const trackExit = () => {
    trackPageExit(config, getPageLoadTime(), log)
  }

  // Track page exit
  window.addEventListener('beforeunload', trackExit)

  // Also track on page hide (for mobile)
  window.addEventListener('pagehide', trackExit)

  // Track visibility changes (tab switching)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      trackExit()
    }
  })
}

// ========================================
// SESSION TRACKING
// ========================================

/**
 * Track session end
 * Call when the session is explicitly ending (logout, long inactivity, etc.)
 */
export function trackSessionEnd(
  config: RequiredTrackerConfig,
  sessionStartTime: number,
  log: (...args: any[]) => void,
  additionalData?: Record<string, any>
): void {
  const durationSeconds = sessionStartTime
    ? Math.floor((Date.now() - sessionStartTime) / 1000)
    : 0

  sendBeacon(config, 'session_end', {
    duration_seconds: durationSeconds,
    page_url: window.location.href,
    ...additionalData,
  }, log)

  log('Session end tracked, duration:', durationSeconds, 'seconds')
}
