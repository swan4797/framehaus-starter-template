/**
 * Stratos Tracking - Interactions Tracking Module
 *
 * Handles tracking of user interactions: phone clicks, email clicks,
 * filter changes, CTA clicks, and shares.
 *
 * @module tracking/modules/interactions
 */

import type { RequiredTrackerConfig } from '../types'
import { sendEvent, sendBeacon, buildEventPayload } from '../core/api'

// ========================================
// INTERACTION TRACKING
// ========================================

/**
 * Track phone click
 */
export function trackPhoneClick(
  config: RequiredTrackerConfig,
  log: (...args: any[]) => void,
  phoneNumber?: string
): void {
  const payload = buildEventPayload('phone_click', {
    phone_number: phoneNumber,
    page_url: window.location.href,
  })

  sendEvent(config, payload, log)
  log('Phone click tracked:', phoneNumber)
}

/**
 * Track email click
 */
export function trackEmailClick(
  config: RequiredTrackerConfig,
  log: (...args: any[]) => void,
  email?: string
): void {
  const payload = buildEventPayload('email_click', {
    email_address: email,
    page_url: window.location.href,
  })

  sendEvent(config, payload, log)
  log('Email click tracked:', email)
}

/**
 * Track search - uses beacon to survive page navigation
 */
export function trackSearch(
  config: RequiredTrackerConfig,
  searchData: Record<string, any>,
  log: (...args: any[]) => void
): void {
  // Use beacon since search typically triggers navigation
  sendBeacon(config, 'search', {
    page_url: window.location.href,
    search_params: searchData,
  }, log)

  log('Search tracked:', searchData)
}

/**
 * Track filter change
 */
export function trackFilterChange(
  config: RequiredTrackerConfig,
  filterName: string,
  filterValue: any,
  log: (...args: any[]) => void
): void {
  const payload = buildEventPayload('filter_change', {
    page_url: window.location.href,
    filter_name: filterName,
    filter_value: filterValue,
  })

  sendEvent(config, payload, log)
  log('Filter change tracked:', filterName, filterValue)
}

/**
 * Track CTA click (Call to Action)
 */
export function trackCtaClick(
  config: RequiredTrackerConfig,
  ctaName: string,
  log: (...args: any[]) => void,
  ctaData?: Record<string, any>
): void {
  const payload = buildEventPayload('cta_click', {
    page_url: window.location.href,
    cta_name: ctaName,
    ...ctaData,
  })

  sendEvent(config, payload, log)
  log('CTA click tracked:', ctaName)
}

/**
 * Track share (property share)
 */
export function trackShare(
  config: RequiredTrackerConfig,
  propertyId: string,
  shareMethod: string,
  log: (...args: any[]) => void
): void {
  const payload = buildEventPayload('share', {
    property_id: propertyId,
    share_method: shareMethod,
    page_url: window.location.href,
  })

  sendEvent(config, payload, log)
  log('Share tracked:', propertyId, shareMethod)
}
