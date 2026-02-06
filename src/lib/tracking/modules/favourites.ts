/**
 * Stratos Tracking - Favourites Module
 *
 * Handles favourite/save functionality for properties.
 *
 * @module tracking/modules/favourites
 */

import type { RequiredTrackerConfig } from '../types'
import { sendEvent, buildEventPayload } from '../core/api'
import { getSessionId, getVisitorId } from '../session'

// ========================================
// FAVOURITES METHODS
// ========================================

/**
 * Toggle favourite (add/remove)
 * Returns true if now favourited, false if unfavourited
 */
export async function toggleFavourite(
  config: RequiredTrackerConfig,
  propertyId: string,
  log: (...args: any[]) => void,
  source: string = 'unknown'
): Promise<boolean> {
  const visitorId = getVisitorId()
  const sessionId = getSessionId()

  try {
    // Check current state
    const isFavouritedNow = await isFavourited(config, propertyId, log)
    const action = isFavouritedNow ? 'unfavourite' : 'favourite'

    log('Toggling favourite:', action, propertyId)

    // Call API
    const response = await fetch(
      `${config.apiUrl}/functions/v1/toggle-favourite`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
        },
        credentials: 'omit', // Prevent CORS credential issues
        body: JSON.stringify({
          visitor_id: visitorId,
          session_id: sessionId,
          property_id: propertyId,
          action,
          source,
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('[StratosTracker] Toggle favourite failed:', error)
      return isFavouritedNow // Return current state on error
    }

    const result = await response.json()
    log('Favourite toggled:', result)

    // Track as event for analytics
    const payload = buildEventPayload(
      action === 'favourite' ? 'property_favourited' : 'property_unfavourited',
      {
        property_id: propertyId,
        source,
      }
    )

    sendEvent(config, payload, log)

    return result.is_favourited
  } catch (error) {
    console.error('[StratosTracker] Error toggling favourite:', error)
    return false
  }
}

/**
 * Get all favourites for current visitor
 */
export async function getFavourites(
  config: RequiredTrackerConfig,
  log: (...args: any[]) => void
): Promise<any[]> {
  const visitorId = getVisitorId()

  try {
    log('Getting favourites for visitor:', visitorId)

    const response = await fetch(
      `${config.apiUrl}/functions/v1/get-favourites?visitor_id=${visitorId}`,
      {
        method: 'GET',
        headers: {
          'x-api-key': config.apiKey,
        },
        credentials: 'omit', // Prevent CORS credential issues
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('[StratosTracker] Get favourites failed:', error)
      return []
    }

    const result = await response.json()
    log('Favourites retrieved:', result.count)

    return result.favourites || []
  } catch (error) {
    console.error('[StratosTracker] Error getting favourites:', error)
    return []
  }
}

/**
 * Check if a property is favourited
 */
export async function isFavourited(
  config: RequiredTrackerConfig,
  propertyId: string,
  log: (...args: any[]) => void
): Promise<boolean> {
  try {
    const favourites = await getFavourites(config, log)
    return favourites.some((f) => f.property.id === propertyId)
  } catch (error) {
    console.error('[StratosTracker] Error checking favourite status:', error)
    return false
  }
}

/**
 * Get favourites count
 */
export async function getFavouritesCount(
  config: RequiredTrackerConfig,
  log: (...args: any[]) => void
): Promise<number> {
  try {
    const favourites = await getFavourites(config, log)
    return favourites.length
  } catch (error) {
    console.error('[StratosTracker] Error getting favourites count:', error)
    return 0
  }
}
