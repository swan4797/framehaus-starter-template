// ========================================
// SIMILAR PROPERTIES COMPONENT
// Displays properties similar to the current one
// ========================================

import { useEffect, useState } from 'react'
import { getSimilarProperties, type SimilarProperty, type SimilarityMode } from '../../lib/api'

// Helper to generate SEO-friendly property URL
// Uses url_slug from API if available
function getPropertyUrl(property: SimilarProperty): string {
  // Use url_slug if available (from API)
  if (property.url_slug) {
    return `/properties/${property.url_slug}`
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
  if (property.display_address) {
    const streetPart = property.display_address.split(',')[0]
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

interface SimilarPropertiesProps {
  propertyId: string
  listingType: string // Accepts 'sale', 'for-sale', 'let', 'to-let', etc.
  limit?: number
}

export function SimilarProperties({ propertyId, listingType, limit = 4 }: SimilarPropertiesProps) {
  const [properties, setProperties] = useState<SimilarProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modeDescription, setModeDescription] = useState('')

  // Normalize listing type for display logic
  const isSale = listingType === 'sale' || listingType === 'for-sale'

  useEffect(() => {
    const fetchSimilar = async () => {
      setLoading(true)
      setError(null)
      console.log('[SimilarProperties] Fetching for property:', propertyId)

      try {
        const result = await getSimilarProperties(propertyId, undefined, limit)
        console.log('[SimilarProperties] API Result:', result)

        if (result && result.properties) {
          setProperties(result.properties)
          setModeDescription(result.mode_description || '')
          console.log('[SimilarProperties] Found', result.properties.length, 'similar properties')
        } else {
          console.log('[SimilarProperties] No similar properties found or invalid response')
          setProperties([])
        }
      } catch (err) {
        console.error('[SimilarProperties] Error fetching:', err)
        setError(err instanceof Error ? err.message : 'Failed to load similar properties')
      }

      setLoading(false)
    }

    if (propertyId) {
      fetchSimilar()
    }
  }, [propertyId, limit])

  if (loading) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#111827',
          marginBottom: '16px',
          fontFamily: "'Garet', -apple-system, BlinkMacSystemFont, sans-serif"
        }}>
          Similar Properties
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              style={{
                background: '#f3f4f6',
                borderRadius: '12px',
                height: '280px',
                animation: 'pulse 2s infinite'
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    )
  }

  // Show error state if API failed
  if (error) {
    console.error('[SimilarProperties] Rendering error state:', error)
    return null // Silently fail - don't show broken UI
  }

  if (properties.length === 0) {
    // Return null for clean UI when no similar properties
    return null
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#111827',
            marginBottom: '4px',
            fontFamily: "'Garet', -apple-system, BlinkMacSystemFont, sans-serif"
          }}>
            Similar Properties
          </h2>
          {modeDescription && (
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: 0
            }}>
              {modeDescription}
            </p>
          )}
        </div>
        <a
          href={`/search?listing_type=${listingType}`}
          style={{
            fontSize: '0.875rem',
            color: '#3c5b4b',
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          View All →
        </a>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '16px'
      }}>
        {properties.map(property => {
          const price = isSale ? property.asking_price : property.rent_amount
          const priceDisplay = price
            ? `£${price.toLocaleString()}${!isSale ? ' pcm' : ''}`
            : 'Price on application'

          return (
            <a
              key={property.id}
              href={getPropertyUrl(property)}
              style={{
                display: 'block',
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Image */}
              <div style={{
                width: '100%',
                height: '160px',
                overflow: 'hidden',
                position: 'relative',
                background: '#f3f4f6'
              }}>
                {property.main_image_url ? (
                  <img
                    src={property.main_image_url}
                    alt={property.display_address}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                    fontSize: '2rem'
                  }}>
                    🏠
                  </div>
                )}

                {/* Featured badge */}
                {property.is_featured && (
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    background: '#3c5b4b',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}>
                    Featured
                  </span>
                )}

                {/* Similarity score badge */}
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 500
                }}>
                  {property.similarity_score}% match
                </span>
              </div>

              {/* Details */}
              <div style={{ padding: '14px' }}>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: '#111827',
                  marginBottom: '6px',
                  fontFamily: "'Garet', -apple-system, BlinkMacSystemFont, sans-serif"
                }}>
                  {priceDisplay}
                </div>

                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '8px',
                  fontSize: '0.75rem',
                  color: '#4b5563'
                }}>
                  <span style={{
                    background: '#f3f4f6',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {property.bedrooms} bed
                  </span>
                  {property.bathrooms && (
                    <span style={{
                      background: '#f3f4f6',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {property.bathrooms} bath
                    </span>
                  )}
                  <span style={{
                    background: '#f3f4f6',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    textTransform: 'capitalize'
                  }}>
                    {property.property_type}
                  </span>
                </div>

                <div style={{
                  fontSize: '0.8125rem',
                  color: '#6b7280',
                  lineHeight: 1.3,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {property.display_address}
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
