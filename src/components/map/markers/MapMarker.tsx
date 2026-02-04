// ========================================
// MAP MARKER UTILITIES
// Configurable marker creation for Leaflet maps
// ========================================

import L from 'leaflet'
import type { Property } from '../../../types/database'
import type { MapMarkerConfig } from '../../../config/map'
import { formatMarkerPrice, defaultMarkerConfig } from '../../../config/map'

// ----------------------------------------
// TYPES
// ----------------------------------------

export interface MarkerOptions {
  property: Property
  config?: Partial<MapMarkerConfig>
  onHover?: (propertyId: string | null) => void
  onClick?: (property: Property) => void
  getPopupContent?: (property: Property) => string
}

// ----------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------

/**
 * Generate SEO-friendly property URL
 * Uses url_slug from API if available
 */
export function getPropertyUrl(property: Property & { url_slug?: string | null }): string {
  // Use url_slug if available (from API)
  if ((property as any).url_slug) {
    return `/properties/${(property as any).url_slug}`
  }

  // Fallback: generate slug client-side (for legacy data)
  const parts: string[] = []

  // Bedrooms
  if (property.bedrooms === 0) {
    parts.push('studio')
  } else if (property.bedrooms && property.bedrooms > 0) {
    parts.push(`${property.bedrooms}-bed`)
  }

  // Property type
  if (property.property_type && property.property_type !== 'other') {
    parts.push(property.property_type.toLowerCase().replace(/\s+/g, '-'))
  }

  // Location (extract street name from address)
  const address = property.display_address || ''
  if (address) {
    const streetPart = address.split(',')[0]
      .replace(/^(flat|unit|apartment)\s*\d+[a-z]?\s*/i, '')
      .replace(/^\d+[a-z]?\s+/i, '')
    const locationSlug = streetPart
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50)
    if (locationSlug) parts.push(locationSlug)
  }

  // Fallback if no parts
  if (parts.length === 0) parts.push('property')

  return `/properties/${parts.join('-')}`
}

/**
 * Get the price for a property based on listing type
 */
export function getPropertyPrice(property: Property): number | null {
  const isSale = property.listing_type === 'sale' || property.listing_type === 'for-sale'
  return isSale ? property.asking_price : property.rent_amount
}

/**
 * Check if property is a sale listing
 */
export function isSaleListing(property: Property): boolean {
  return property.listing_type === 'sale' || property.listing_type === 'for-sale'
}

/**
 * Get image URL from property data
 */
export function getPropertyImage(property: Property): string | null {
  return (property as any).main_image_url || property.property_media?.[0]?.file_url || null
}

// ----------------------------------------
// MARKER CREATION
// ----------------------------------------

/**
 * Create a price pin marker icon
 */
export function createPriceMarkerIcon(
  price: number,
  isSale: boolean,
  isFeatured: boolean = false,
  config: MapMarkerConfig = defaultMarkerConfig
): L.DivIcon {
  const priceDisplay = formatMarkerPrice(price, isSale)

  // Determine marker class based on type
  const typeClass = isFeatured ? 'featured' : isSale ? 'sale' : 'let'

  return L.divIcon({
    className: 'custom-price-marker',
    html: `
      <div class="price-pin ${typeClass}">
        ${priceDisplay}
      </div>
    `,
    iconSize: [config.size.width, config.size.height],
    iconAnchor: [config.size.width / 2, config.size.height]
  })
}

/**
 * Create a dot marker icon
 */
export function createDotMarkerIcon(
  isSale: boolean,
  isFeatured: boolean = false,
  config: MapMarkerConfig = defaultMarkerConfig
): L.DivIcon {
  const color = isFeatured
    ? config.colors.featured
    : isSale
      ? config.colors.sale
      : config.colors.let

  return L.divIcon({
    className: 'custom-dot-marker',
    html: `
      <div class="dot-marker" style="
        width: 12px;
        height: 12px;
        background: ${color};
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      "></div>
    `,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  })
}

/**
 * Create a marker for a property
 */
export function createPropertyMarker(options: MarkerOptions): L.Marker | null {
  const { property, config: configOverride } = options
  const config: MapMarkerConfig = { ...defaultMarkerConfig, ...configOverride }

  const price = getPropertyPrice(property)
  if (!price || !property.latitude || !property.longitude) {
    return null
  }

  const isSale = isSaleListing(property)
  const isFeatured = property.is_featured || false

  // Create icon based on style
  let icon: L.DivIcon
  switch (config.style) {
    case 'dot':
      icon = createDotMarkerIcon(isSale, isFeatured, config)
      break
    case 'price-pin':
    default:
      icon = createPriceMarkerIcon(price, isSale, isFeatured, config)
      break
  }

  const marker = L.marker([property.latitude, property.longitude], { icon })

  return marker
}

// ----------------------------------------
// POPUP CONTENT
// ----------------------------------------

/**
 * Generate default popup content for a property
 */
export function getDefaultPopupContent(property: Property): string {
  const price = getPropertyPrice(property)
  const isSale = isSaleListing(property)
  const imageUrl = getPropertyImage(property)
  const propertyUrl = getPropertyUrl(property)

  const priceDisplay = price
    ? isSale
      ? `£${(price / 1000).toFixed(0)}k`
      : `£${price}pcm`
    : 'POA'

  const houseIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`

  return `
    <div class="property-popup">
      ${imageUrl
        ? `<img src="${imageUrl}" alt="${property.display_address}" />`
        : `<div class="popup-no-image">${houseIcon}</div>`
      }
      <div class="popup-content">
        <div class="popup-price">${priceDisplay}</div>
        <div class="popup-details">${property.bedrooms} bed • ${property.property_type}</div>
        <div class="popup-address">${property.display_address}</div>
        <a href="${propertyUrl}" class="popup-link">View Details →</a>
      </div>
    </div>
  `
}

// ----------------------------------------
// CLUSTER ICON
// ----------------------------------------

/**
 * Create a cluster icon function for MarkerClusterGroup
 */
export function createClusterIconFunction(config: MapMarkerConfig = defaultMarkerConfig) {
  return (cluster: L.MarkerCluster): L.DivIcon => {
    const count = cluster.getChildCount()
    let size = count > 30 ? 48 : count > 10 ? 44 : 40

    return L.divIcon({
      html: `<div class="cluster-icon" style="
        background: linear-gradient(135deg, ${config.colors.cluster.replace('var(--color-primary, ', '').replace(')', '')} 0%, ${config.colors.cluster.replace('var(--color-primary, ', '').replace(')', '')} 100%);
        color: white;
        border-radius: 50%;
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: ${count > 99 ? '12px' : '14px'};
        font-family: Inter, system-ui, sans-serif;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2), 0 4px 16px rgba(255,90,95,0.3);
      ">${count}</div>`,
      className: 'custom-cluster-icon',
      iconSize: L.point(size, size)
    })
  }
}
