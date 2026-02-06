/**
 * Search Tracker - Reliable Search Event Tracking
 *
 * BACKWARD COMPATIBILITY RE-EXPORT
 *
 * This file re-exports from the new modular tracking system.
 * The actual implementation has been moved to src/lib/tracking/modules/search.ts
 *
 * For new code, prefer importing directly from:
 * - import { storeSearchForTracking, sendPendingSearchEvent } from '../lib/tracking'
 * - import { storeSearchForTracking } from '../lib/tracking/modules/search'
 *
 * @module search-tracker
 * @deprecated Import from './tracking' instead
 */

// Re-export everything from the new modular system
export {
  storeSearchForTracking,
  sendPendingSearchEvent,
  extractSearchParamsFromUrl,
} from './tracking/modules/search'

export type { SearchTrackingData } from './tracking/types'
