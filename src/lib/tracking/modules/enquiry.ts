/**
 * Stratos Tracking - Enquiry Tracking Module
 *
 * Handles tracking of enquiry form interactions.
 * Tracks when users start and submit enquiry forms.
 *
 * @module tracking/modules/enquiry
 */

import type { RequiredTrackerConfig } from '../types'
import { sendEvent, buildEventPayload } from '../core/api'

// ========================================
// ENQUIRY TRACKING
// ========================================

/**
 * Track enquiry form started
 * Call when visitor begins filling out an enquiry form
 */
export function trackEnquiryStarted(
  config: RequiredTrackerConfig,
  log: (...args: any[]) => void,
  enquiryData?: {
    property_id?: string
    enquiry_type?: 'general' | 'property' | 'viewing' | 'valuation'
    form_location?: string
  }
): void {
  const payload = buildEventPayload('enquiry_started', {
    property_id: enquiryData?.property_id,
    enquiry_type: enquiryData?.enquiry_type || 'general',
    form_location: enquiryData?.form_location,
    page_url: window.location.href,
  })

  sendEvent(config, payload, log)
  log('Enquiry started tracked:', enquiryData?.enquiry_type)
}

/**
 * Track enquiry form submitted
 * Call when visitor successfully submits an enquiry form
 */
export function trackEnquirySubmitted(
  config: RequiredTrackerConfig,
  log: (...args: any[]) => void,
  enquiryData?: {
    property_id?: string
    enquiry_type?: 'general' | 'property' | 'viewing' | 'valuation'
    form_location?: string
    has_phone?: boolean
    has_message?: boolean
  }
): void {
  const payload = buildEventPayload('enquiry_submitted', {
    property_id: enquiryData?.property_id,
    enquiry_type: enquiryData?.enquiry_type || 'general',
    form_location: enquiryData?.form_location,
    has_phone: enquiryData?.has_phone,
    has_message: enquiryData?.has_message,
    page_url: window.location.href,
  })

  sendEvent(config, payload, log)
  log('Enquiry submitted tracked:', enquiryData?.enquiry_type)
}

/**
 * Set up automatic enquiry form tracking
 * Automatically tracks when users focus on and submit enquiry forms
 */
export function setupEnquiryFormTracking(
  config: RequiredTrackerConfig,
  formSelector: string,
  log: (...args: any[]) => void,
  options?: {
    property_id?: string
    enquiry_type?: 'general' | 'property' | 'viewing' | 'valuation'
  }
): void {
  const forms = document.querySelectorAll(formSelector)

  forms.forEach((form) => {
    let hasStartedTracking = false

    // Track when user focuses on any input (form started)
    form.querySelectorAll('input, textarea, select').forEach((input) => {
      input.addEventListener('focus', () => {
        if (!hasStartedTracking) {
          hasStartedTracking = true
          trackEnquiryStarted(config, log, {
            property_id: options?.property_id,
            enquiry_type: options?.enquiry_type,
            form_location: formSelector,
          })
        }
      }, { once: true })
    })

    // Track form submission
    form.addEventListener('submit', () => {
      const formData = new FormData(form as HTMLFormElement)
      trackEnquirySubmitted(config, log, {
        property_id: options?.property_id,
        enquiry_type: options?.enquiry_type,
        form_location: formSelector,
        has_phone: !!formData.get('phone') || !!formData.get('telephone'),
        has_message: !!formData.get('message') || !!formData.get('comments'),
      })
    })
  })

  log('Enquiry form tracking setup for:', formSelector)
}
