/**
 * Stratos Tracking - Blog Tracking Module
 *
 * Handles blog article view, duration, scroll depth, and engagement tracking.
 *
 * @module tracking/modules/blog
 */

import type { RequiredTrackerConfig } from '../types'
import { sendEvent, sendBeacon, buildEventPayload } from '../core/api'

// ========================================
// BLOG TRACKING
// ========================================

/**
 * Track blog view
 * Call this when visitor views a blog article page
 */
export function trackBlogView(
  config: RequiredTrackerConfig,
  articleId: string,
  log: (...args: any[]) => void,
  additionalData?: Record<string, any>
): void {
  const payload = buildEventPayload('blog_view', {
    article_id: articleId,
    page_url: window.location.href,
    ...additionalData,
  })

  sendEvent(config, payload, log)
  log('Blog view tracked:', articleId)
}

/**
 * Track blog read time / duration
 * Call this when visitor leaves blog page
 */
export function trackBlogDuration(
  config: RequiredTrackerConfig,
  articleId: string,
  startTime: number,
  maxScrollDepth: number,
  log: (...args: any[]) => void
): void {
  if (!startTime) return

  const duration = Math.floor((Date.now() - startTime) / 1000)

  // Only track if they spent at least 5 seconds reading
  if (duration < 5) return

  sendBeacon(config, 'blog_read_time', {
    article_id: articleId,
    read_duration_seconds: duration,
    max_scroll_depth: maxScrollDepth,
    page_url: window.location.href,
  }, log)

  log('Blog duration tracked:', articleId, duration, 'seconds')
}

/**
 * Set up automatic blog duration tracking
 * Call this on blog pages to automatically track when visitor leaves
 */
export function setupBlogDurationTracking(
  config: RequiredTrackerConfig,
  articleId: string,
  getStartTime: () => number,
  getMaxScrollDepth: () => number,
  log: (...args: any[]) => void
): void {
  const trackDuration = () => {
    trackBlogDuration(config, articleId, getStartTime(), getMaxScrollDepth(), log)
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

  log('Blog duration tracking setup for:', articleId)
}

/**
 * Set up scroll depth tracking for blog articles
 * Returns a function to get current max scroll depth
 */
export function setupScrollDepthTracking(
  config: RequiredTrackerConfig,
  articleId: string,
  log: (...args: any[]) => void
): { getMaxScrollDepth: () => number } {
  let maxScrollDepth = 0

  const trackScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0

    // Track milestone depths (25%, 50%, 75%, 100%)
    const milestones = [25, 50, 75, 100]
    const currentMilestone = milestones.find((m) => scrollPercent >= m && maxScrollDepth < m)

    if (currentMilestone && scrollPercent > maxScrollDepth) {
      maxScrollDepth = scrollPercent

      const payload = buildEventPayload('blog_scroll_depth', {
        article_id: articleId,
        scroll_depth: currentMilestone,
        page_url: window.location.href,
      })

      sendEvent(config, payload, log)
      log('Blog scroll depth tracked:', articleId, currentMilestone + '%')
    } else if (scrollPercent > maxScrollDepth) {
      maxScrollDepth = scrollPercent
    }
  }

  window.addEventListener('scroll', trackScroll, { passive: true })

  return {
    getMaxScrollDepth: () => maxScrollDepth,
  }
}

/**
 * Track blog share
 */
export function trackBlogShare(
  config: RequiredTrackerConfig,
  articleId: string,
  shareMethod: string,
  log: (...args: any[]) => void
): void {
  const payload = buildEventPayload('blog_share', {
    article_id: articleId,
    share_method: shareMethod,
    page_url: window.location.href,
  })

  sendEvent(config, payload, log)
  log('Blog share tracked:', articleId, shareMethod)
}

/**
 * Track link click within blog article
 */
export function trackBlogLinkClick(
  config: RequiredTrackerConfig,
  articleId: string,
  linkUrl: string,
  log: (...args: any[]) => void,
  linkText?: string
): void {
  const payload = buildEventPayload('blog_link_click', {
    article_id: articleId,
    link_url: linkUrl,
    link_text: linkText,
    page_url: window.location.href,
  })

  sendEvent(config, payload, log)
  log('Blog link click tracked:', articleId, linkUrl)
}

/**
 * Track related article click
 */
export function trackRelatedArticleClick(
  config: RequiredTrackerConfig,
  articleId: string,
  relatedArticleId: string,
  log: (...args: any[]) => void,
  relatedArticleTitle?: string
): void {
  const payload = buildEventPayload('blog_related_click', {
    article_id: articleId,
    related_article_id: relatedArticleId,
    related_article_title: relatedArticleTitle,
    page_url: window.location.href,
  })

  sendEvent(config, payload, log)
  log('Related article click tracked:', articleId, '->', relatedArticleId)
}
