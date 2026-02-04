// ========================================
// PAGE CONTENT FETCHING UTILITIES
// For Astro client site - fetches dynamic content from Stratos CRM
// Section-based content model
// ========================================

import { config } from './config'

// ========================================
// TYPES
// ========================================

export interface ImageContent {
  url: string
  alt: string
}

export interface SectionContent {
  title: string
  content: string // Rich text HTML
  image: ImageContent | null
}

export interface ContentBlock {
  block_key: string
  order: number
  section: SectionContent
}

/**
 * Complete page content structure
 */
export interface PageContent {
  page_key: string
  page_title: string
  content?: string // Main rich text content (like Blog)
  content_blocks: ContentBlock[]
  hero_image_url?: string | null
  hero_image_alt?: string | null
  last_updated: string
}

interface PageContentResponse {
  success: boolean
  data: PageContent
  error?: boolean
  message?: string
}

interface AllPagesResponse {
  success: boolean
  data: Record<
    string,
    {
      page_title: string
      content?: string
      content_blocks: ContentBlock[]
      hero_image_url?: string | null
      hero_image_alt?: string | null
      last_updated: string
    }
  >
}

// ========================================
// CACHE
// ========================================

const contentCache = new Map<string, { data: PageContent; timestamp: number }>()
const CACHE_TTL = 60000 // 1 minute

// ========================================
// FETCH PAGE CONTENT
// ========================================

/**
 * Fetch content for a specific page from Stratos CRM
 * @param pageKey - The page identifier (e.g., 'homepage', 'about', 'contact')
 * @returns The page content object or null if not found
 */
export async function getPageContent(
  pageKey: string
): Promise<PageContent | null> {
  const cacheKey = `page:${pageKey}`
  const cached = contentCache.get(cacheKey)

  // Return cached data if still valid
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[Pages] Using cached data for: ${pageKey}`)
    return cached.data
  }

  try {
    const apiUrl = config.api.baseUrl
    const apiKey = config.api.apiKey

    console.log(`[Pages] Fetching page content for: ${pageKey}`)
    console.log(`[Pages] API URL: ${apiUrl}`)
    console.log(`[Pages] API Key: ${apiKey ? '***' + apiKey.slice(-4) : 'NOT SET'}`)

    if (!apiUrl || !apiKey) {
      console.error('[Pages] Missing API configuration for page content')
      return null
    }

    const url = `${apiUrl}${config.api.functionsPath}/get-page-content?page=${pageKey}`
    console.log(`[Pages] Full URL: ${url}`)

    const response = await fetch(url, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    })

    console.log(`[Pages] Response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Pages] Failed to fetch page content: ${response.status}`, errorText)
      return null
    }

    const result: PageContentResponse = await response.json()
    console.log(`[Pages] Response success: ${result.success}`)

    if (!result.success || result.error) {
      console.warn(`[Pages] Page content not found: ${pageKey}`, result)
      return null
    }

    console.log(`[Pages] Got page content with ${result.data?.content_blocks?.length || 0} sections`)

    // Cache the result
    contentCache.set(cacheKey, {
      data: result.data,
      timestamp: Date.now(),
    })

    return result.data
  } catch (error) {
    console.error('[Pages] Error fetching page content:', error)
    return null
  }
}

/**
 * Fetch content for all published pages
 * Useful for build-time static generation or preloading
 */
export async function getAllPageContent(): Promise<Record<string, PageContent>> {
  try {
    const apiUrl = config.api.baseUrl
    const apiKey = config.api.apiKey

    if (!apiUrl || !apiKey) {
      console.error('Missing API configuration for page content')
      return {}
    }

    const response = await fetch(
      `${apiUrl}${config.api.functionsPath}/get-page-content`,
      {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error(`Failed to fetch all page content: ${response.status}`)
      return {}
    }

    const result: AllPagesResponse = await response.json()

    if (!result.success) {
      return {}
    }

    // Transform and cache each page
    const pages: Record<string, PageContent> = {}
    for (const [key, data] of Object.entries(result.data)) {
      const pageContent: PageContent = {
        page_key: key,
        page_title: data.page_title,
        content: data.content,
        content_blocks: data.content_blocks,
        hero_image_url: data.hero_image_url,
        hero_image_alt: data.hero_image_alt,
        last_updated: data.last_updated,
      }
      pages[key] = pageContent
      contentCache.set(`page:${key}`, {
        data: pageContent,
        timestamp: Date.now(),
      })
    }

    return pages
  } catch (error) {
    console.error('Error fetching all page content:', error)
    return {}
  }
}

// ========================================
// PAGE-LEVEL ACCESSORS
// ========================================

/**
 * Get the main page content (rich text HTML)
 */
export function getMainContent(page: PageContent | null, fallback = ''): string {
  return page?.content || fallback
}

/**
 * Get the hero image
 */
export function getHeroImage(page: PageContent | null): ImageContent | null {
  if (!page?.hero_image_url) return null
  return {
    url: page.hero_image_url,
    alt: page.hero_image_alt || '',
  }
}

/**
 * Check if page has main content
 */
export function hasMainContent(page: PageContent | null): boolean {
  return !!(page?.content && page.content.trim().length > 0)
}

/**
 * Check if page has hero image
 */
export function hasHeroImage(page: PageContent | null): boolean {
  return !!(page?.hero_image_url)
}

// ========================================
// SECTION ACCESSORS
// ========================================

/**
 * Get a section (content block) by its key
 */
export function getSection(
  page: PageContent | null,
  blockKey: string
): ContentBlock | null {
  if (!page?.content_blocks) return null
  return page.content_blocks.find((b) => b.block_key === blockKey) || null
}

/**
 * Get section title
 */
export function getSectionTitle(
  page: PageContent | null,
  blockKey: string,
  fallback = ''
): string {
  const block = getSection(page, blockKey)
  if (!block?.section) return fallback
  return block.section.title || fallback
}

/**
 * Get section content (rich text HTML)
 */
export function getSectionContent(
  page: PageContent | null,
  blockKey: string,
  fallback = ''
): string {
  const block = getSection(page, blockKey)
  if (!block?.section) return fallback
  return block.section.content || fallback
}

/**
 * Get section image
 */
export function getSectionImage(
  page: PageContent | null,
  blockKey: string
): ImageContent | null {
  const block = getSection(page, blockKey)
  if (!block?.section?.image) return null
  return block.section.image
}

/**
 * Get all sections sorted by order
 */
export function getAllSections(page: PageContent | null): ContentBlock[] {
  if (!page?.content_blocks) return []
  return [...page.content_blocks].sort((a, b) => a.order - b.order)
}

/**
 * Check if a section key exists
 */
export function hasSection(page: PageContent | null, blockKey: string): boolean {
  return !!getSection(page, blockKey)
}

// ========================================
// CONTENT CHECKS
// ========================================

/**
 * Check if a section has content (title or rich text)
 */
export function hasSectionContent(page: PageContent | null, blockKey: string): boolean {
  const block = getSection(page, blockKey)
  if (!block?.section) return false
  return !!(block.section.title || block.section.content)
}

/**
 * Check if a section has an image
 */
export function hasSectionImage(page: PageContent | null, blockKey: string): boolean {
  const block = getSection(page, blockKey)
  return !!(block?.section?.image?.url)
}

/**
 * Check if page has any content sections
 */
export function hasContent(page: PageContent | null): boolean {
  return (page?.content_blocks?.length || 0) > 0
}

/**
 * Get the section count
 */
export function getSectionCount(page: PageContent | null): number {
  return page?.content_blocks?.length || 0
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Clear the content cache (useful for forcing fresh data)
 */
export function clearContentCache(): void {
  contentCache.clear()
}

/**
 * Get cache status for debugging
 */
export function getCacheStatus(): { size: number; keys: string[] } {
  return {
    size: contentCache.size,
    keys: Array.from(contentCache.keys()),
  }
}

/**
 * Create empty page content (useful for fallbacks)
 */
export function createEmptyPageContent(pageKey: string): PageContent {
  return {
    page_key: pageKey,
    page_title: pageKey.charAt(0).toUpperCase() + pageKey.slice(1),
    content_blocks: [],
    last_updated: new Date().toISOString(),
  }
}

// ========================================
// LEGACY COMPATIBILITY
// Aliases for old function names
// ========================================

export const getBlock = getSection
export const getAllBlocks = getAllSections
export const hasBlock = hasSection
export const getBlockCount = getSectionCount

// Old block-type accessors (now use section accessors)
export function getBlockText(
  page: PageContent | null,
  blockKey: string,
  fallback = ''
): string {
  // First try title, then content
  const title = getSectionTitle(page, blockKey)
  if (title) return title
  return getSectionContent(page, blockKey, fallback)
}

export function getBlockImage(
  page: PageContent | null,
  blockKey: string
): ImageContent | null {
  return getSectionImage(page, blockKey)
}

// CTA is no longer a separate type, return null for compatibility
export function getBlockCTA(
  page: PageContent | null,
  blockKey: string
): { label: string; url: string } | null {
  return null
}

export function getBlocksByType(
  page: PageContent | null,
  type: string
): ContentBlock[] {
  // All blocks are sections now, return all
  return getAllSections(page)
}
