/**
 * Stratos Reach AI - Client-Side Tracker
 *
 * BACKWARD COMPATIBILITY RE-EXPORT
 *
 * This file re-exports from the new modular tracking system.
 * The actual implementation has been moved to src/lib/tracking/
 *
 * For new code, prefer importing directly from:
 * - import { StratosTracker } from '../lib/tracking'
 * - import { StratosTracker } from '../lib/tracking/core/StratosTracker'
 *
 * @module stratos-tracker
 * @deprecated Import from './tracking' instead
 */

// Re-export everything from the new modular system
export {
  StratosTracker,
  createTracker,
  getGlobalTracker,
} from './tracking/core/StratosTracker'

export type {
  TrackerConfig,
  EventData,
} from './tracking/types'

// Default export for backward compatibility
export { StratosTracker as default } from './tracking/core/StratosTracker'
