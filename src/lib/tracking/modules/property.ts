/**
 * Stratos Tracking - Property Tracking Module
 *
 * Handles property view, duration, and engagement tracking.
 * Includes: views, virtual tours, map, gallery, similar properties.
 *
 * @module tracking/modules/property
 */

import type { RequiredTrackerConfig } from '../types'
import { sendEvent, sendBeacon, buildEventPayload } from '../core/api'

// ========================================
// PROPERTY TRACKING
// ========================================

/**
 * Track property view
 * Call this when visitor views a property page
 */
export function trackPropertyView(
  config: RequiredTrackerConfig,
  propertyId: string,
  log: (...args: any[]) => void,
  additionalData?: Record<string, any>
): void {
  const payload = buildEventPayload('property_view', {
    property_id: propertyId,
    page_url: window.location.href,
    ...additionalData,
  })

  sendEvent(config, payload, log)
  log('Property view tracked:', propertyId)
}

/**
 * Track property view duration
 * Call this when visitor leaves property page
 */
export function trackPropertyDuration(
  config: RequiredTrackerConfig,
  propertyId: string,
  startTime: number,
  log: (...args: any[]) => void
): void {
  if (!startTime) return

  const duration = Math.floor((Date.now() - startTime) / 1000)

  // Only track if they spent at least 3 seconds
  if (duration < 3) return

  sendBeacon(config, 'property_view', {
    property_id: propertyId,
    view_duration_seconds: duration,
    page_url: window.location.href,
  }, log)

  log('Property duration tracked:', propertyId, duration, 'seconds')
}

/**
 * Set up automatic property duration tracking
 * Call this on property pages to automatically track when visitor leaves
 */
export function setupPropertyDurationTracking(
  config: RequiredTrackerConfig,
  propertyId: string,
  getStartTime: () => number,
  log: (...args: any[]) => void
): void {
  const trackDuration = () => {
    trackPropertyDuration(config, propertyId, getStartTime(), log)
  }

  // Track on page exit
  window.addEventListener('beforeunload', trackDuration)
  window.addEventListener('pagehide', trackDuration)

  // Track on visibility change (tab switch)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      trackDuration()
    }
  })

  log('Property duration tracking setup for:', propertyId)
}

// ========================================
// PROPERTY ENGAGEMENT TRACKING
// ========================================

/**
 * Track virtual tour click
 * Call when visitor clicks to view virtual tour
 */
export function trackVirtualTourClick(
  config: RequiredTrackerConfig,
  propertyId: string,
  log: (...args: any[]) => void,
  tourType?: string
): void {
  const payload = buildEventPayload('virtual_tour_click', {
    property_id: propertyId,
    tour_type: tourType,
    page_url: window.location.href,
  })

  sendEvent(config, payload, log)
  log('Virtual tour click tracked:', propertyId)
}

/**
 * Track map view interaction
 * Call when visitor interacts with property map
 */
export function trackMapView(
  config: RequiredTrackerConfig,
  propertyId: string,
  log: (...args: any[]) => void,
  mapAction?: string
): void {
  const payload = buildEventPayload('map_view', {
    property_id: propertyId,
    map_action: mapAction, // 'open', 'zoom', 'pan', 'streetview'
    page_url: window.location.href,
  })

  sendEvent(config, payload, log)
  log('Map view tracked:', propertyId, mapAction)
}

/**
 * Track gallery view interaction
 * Call when visitor opens or navigates the image gallery
 */
export function trackGalleryView(
  config: RequiredTrackerConfig,
  propertyId: string,
  log: (...args: any[]) => void,
  imageIndex?: number,
  totalImages?: number
): void {
  const payload = buildEventPayload('gallery_view', {
    property_id: propertyId,
    image_index: imageIndex,
    total_images: totalImages,
    page_url: window.location.href,
  })

  sendEvent(config, payload, log)
  log('Gallery view tracked:', propertyId, `image ${imageIndex}/${totalImages}`)
}

/**
 * Track similar properties click
 * Call when visitor clicks on a similar/related property
 */
export function trackSimilarPropertiesClick(
  config: RequiredTrackerConfig,
  propertyId: string,
  clickedPropertyId: string,
  log: (...args: any[]) => void,
  position?: number
): void {
  const payload = buildEventPayload('similar_properties_click', {
    property_id: propertyId,
    clicked_property_id: clickedPropertyId,
    position: position,
    page_url: window.location.href,
  })

  sendEvent(config, payload, log)
  log('Similar property click tracked:', propertyId, '->', clickedPropertyId)
}
