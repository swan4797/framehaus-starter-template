// ========================================
// MAP PROPERTY CARD COMPONENT
// Configurable property card for map sidebar
// ========================================

import type { Property } from '../../../types/database'
import type { MapCardConfig } from '../../../config/map'
import { formatCardPrice, defaultCardConfig } from '../../../config/map'

// ----------------------------------------
// TYPES
// ----------------------------------------

export interface MapPropertyCardProps {
  property: Property
  config?: Partial<MapCardConfig>
  isHovered?: boolean
  isSelected?: boolean
  onHover?: (propertyId: string | null) => void
  onClick?: (property: Property) => void
  getPropertyUrl: (property: Property) => string
}

// ----------------------------------------
// ICONS
// ----------------------------------------

const icons = {
  bed: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 4v16"/><path d="M2 8h18a2 2 0 012 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>
    </svg>
  ),
  bath: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 6L6.5 3.5a1.5 1.5 0 00-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 002 2h12a2 2 0 002-2v-5"/>
      <line x1="2" x2="22" y1="12" y2="12"/>
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  house: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
}

// ----------------------------------------
// COMPONENT
// ----------------------------------------

export function MapPropertyCard({
  property,
  config: configOverride,
  isHovered = false,
  isSelected = false,
  onHover,
  onClick,
  getPropertyUrl,
}: MapPropertyCardProps) {
  // Merge config with defaults
  const config: MapCardConfig = { ...defaultCardConfig, ...configOverride }

  // Calculate price
  const isSale = property.listing_type === 'sale' || property.listing_type === 'for-sale'
  const price = isSale ? property.asking_price : property.rent_amount

  if (!price) return null

  // Get image URL
  const imageUrl = (property as any).main_image_url || property.property_media?.[0]?.file_url

  // Build class names based on layout
  const cardClasses = [
    'map-property-card',
    config.layout,
    isHovered ? 'hovered' : '',
    isSelected ? 'selected' : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      data-property-card={property.id}
      className={cardClasses}
      onMouseEnter={() => onHover?.(property.id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onClick?.(property)}
    >
      {/* Image */}
      {config.showImage && (
        <div
          className="card-image-wrapper"
          style={config.layout === 'horizontal' ? { width: config.imageWidth } : undefined}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={property.display_address}
              className="card-image"
              loading="lazy"
            />
          ) : (
            <div className="card-image-placeholder">
              {icons.house}
            </div>
          )}

          {/* Badges */}
          {config.showBadges && (
            <>
              <span className={`card-badge ${isSale ? 'sale' : 'let'}`}>
                {isSale ? 'Sale' : 'Rent'}
              </span>

              {property.is_featured && (
                <span className="card-badge featured">
                  {icons.star}
                </span>
              )}
            </>
          )}
        </div>
      )}

      {/* Content */}
      <div className="card-content">
        <div className="card-header">
          <div className="card-price">
            {formatCardPrice(price)}
            {!isSale && <span className="price-suffix"> pcm</span>}
          </div>
        </div>

        <h3
          className="card-address"
          style={{ WebkitLineClamp: config.truncateAddress }}
        >
          {property.display_address}
        </h3>

        {/* Specs */}
        {config.showSpecs && (
          <div className="card-specs">
            <span className="spec">
              {icons.bed}
              {property.bedrooms}
            </span>
            {property.bathrooms && (
              <span className="spec">
                {icons.bath}
                {property.bathrooms}
              </span>
            )}
            {property.property_type && (
              <span className="spec type">{property.property_type}</span>
            )}
          </div>
        )}

        {/* View Link */}
        {config.showViewLink && (
          <a
            href={getPropertyUrl(property)}
            className="card-link"
            onClick={(e) => e.stopPropagation()}
          >
            View
            {icons.arrow}
          </a>
        )}
      </div>
    </div>
  )
}

// ----------------------------------------
// EMPTY STATE COMPONENT
// ----------------------------------------

export interface MapEmptyStateProps {
  title: string
  hint: string
}

export function MapEmptyState({ title, hint }: MapEmptyStateProps) {
  return (
    <div className="map-empty-state">
      <div className="empty-icon">
        {icons.house}
      </div>
      <p className="empty-title">{title}</p>
      <p className="empty-hint">{hint}</p>
    </div>
  )
}

// ----------------------------------------
// LOADING STATE COMPONENT
// ----------------------------------------

export function MapLoadingState() {
  return (
    <div className="map-loading-state">
      <svg className="spinner-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
      </svg>
      <span>Loading...</span>
    </div>
  )
}

// ----------------------------------------
// SIDEBAR HEADER COMPONENT
// ----------------------------------------

export interface MapSidebarHeaderProps {
  count: number
  priceRange?: { min: number; max: number } | null
  showPriceRange?: boolean
  isLoading?: boolean
}

export function MapSidebarHeader({
  count,
  priceRange,
  showPriceRange = true,
  isLoading = false,
}: MapSidebarHeaderProps) {
  if (isLoading) {
    return (
      <div className="map-sidebar-header">
        <MapLoadingState />
      </div>
    )
  }

  return (
    <div className="map-sidebar-header">
      <h2 className="count-text">
        <strong>{count}</strong> {count === 1 ? 'property' : 'properties'}
      </h2>
      {showPriceRange && priceRange && priceRange.min && priceRange.max && (
        <p className="price-summary">
          £{(priceRange.min / 1000).toFixed(0)}k - £{(priceRange.max / 1000).toFixed(0)}k
        </p>
      )}
    </div>
  )
}
