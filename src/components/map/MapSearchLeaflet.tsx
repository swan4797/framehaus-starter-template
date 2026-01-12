// ========================================
// MAP SEARCH LEAFLET - Integrated with Stratos Architecture
// Uses existing api.ts, session.ts, and stratos-tracker.ts
// ========================================

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'

// Import search and filter components
// import { MapSearchBar } from './MapSearchBar.tsx'
import { MapFiltersPanel, type MapFilters } from './MapFiltersPanel.tsx'

// Import from existing lib structure
import { searchPropertiesMap, type MapBounds } from '../../lib/api'
import type { Property } from '../../types/database'

// Fix Leaflet default marker icon issue with bundlers
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

// ========================================
// TYPES
// ========================================

interface MapSearchLeafletProps {
  initialCenter?: [number, number]
  initialZoom?: number
  filters?: any
  onPropertyClick?: (property: Property) => void
  autoCenter?: boolean  // NEW: Auto-center on properties
}

// ========================================
// COMPONENT
// ========================================

export function MapSearchLeaflet({
  initialCenter = [51.5074, -0.1276], // London [lat, lng]
  initialZoom = 12,
  filters = {},
  onPropertyClick,
  autoCenter = true  // Default to auto-centering
}: MapSearchLeafletProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const markersLayer = useRef<L.MarkerClusterGroup | null>(null)
  const retryCount = useRef<number>(0)
  const maxRetries = 5
  
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [showSearchButton, setShowSearchButton] = useState(false)
  const [priceRange, setPriceRange] = useState<any>(null)
  const [activeFilters, setActiveFilters] = useState<MapFilters>(filters || {})

  // ========================================
  // AUTO-CENTERING FUNCTIONS
  // ========================================

  const calculateCenter = (props: Property[]): [number, number] => {
    if (props.length === 0) return initialCenter

    const validProps = props.filter(p => p.latitude && p.longitude)
    if (validProps.length === 0) return initialCenter

    const avgLat = validProps.reduce((sum, p) => sum + p.latitude!, 0) / validProps.length
    const avgLng = validProps.reduce((sum, p) => sum + p.longitude!, 0) / validProps.length

    console.log('[MapSearch] Auto-calculated center:', { lat: avgLat, lng: avgLng, properties: validProps.length })
    return [avgLat, avgLng]
  }

  const fetchAllPropertiesForCenter = async () => {
    console.log('[MapSearch] Auto-centering enabled - fetching all properties...')
    setLoading(true)

    try {
      // Fetch with very wide bounds to get all properties
      const wideBounds: MapBounds = {
        north: 85,
        south: -85,
        east: 180,
        west: -180
      }

      console.log('[MapSearch] API call params:', { bounds: wideBounds, zoom: 5, filters })
      
      // Check API config first
      console.log('[MapSearch] API config:', {
        baseUrl: window.location.origin,
        hasApiKey: !!import.meta.env.PUBLIC_WEBSITE_API_KEY
      })

      const result = await searchPropertiesMap(wideBounds, 5, filters)
      
      console.log('[MapSearch] API response:', result)

      if (!result) {
        console.error('[MapSearch] ❌ API returned null/undefined')
        console.error('[MapSearch] Check browser console for "Map search error:" message above')
        console.error('[MapSearch] Common causes:')
        console.error('  1. PUBLIC_WEBSITE_API_KEY not set in .env')
        console.error('  2. Edge Function not deployed')
        console.error('  3. Network error or CORS issue')
        console.error('  4. API endpoint URL wrong')
        setLoading(false)
        return initialCenter
      }

      if (result.properties.length === 0) {
        console.warn('[MapSearch] ⚠️ API returned 0 properties')
        console.warn('[MapSearch] Check: 1) Properties published, 2) Properties have agency_id, 3) API key valid')
        setLoading(false)
        return initialCenter
      }

      console.log('[MapSearch] ✅ Found', result.properties.length, 'properties')
      setProperties(result.properties)
      setPriceRange(result.price_range)
      setLoading(false)

      const center = calculateCenter(result.properties)
      return center
    } catch (err) {
      console.error('[MapSearch] Error fetching properties:', err)
      setLoading(false)
      return initialCenter
    }
  }

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    const initMap = async () => {
      let mapCenter = initialCenter
      let mapZoom = initialZoom

      // Auto-center: Fetch properties first, then calculate center
      if (autoCenter) {
        const center = await fetchAllPropertiesForCenter()
        if (center) {
          mapCenter = center
          // Use wider zoom for auto-center
          mapZoom = properties.length > 20 ? 11 : properties.length > 5 ? 12 : 13
          console.log('[MapSearch] Using auto-calculated center:', mapCenter, 'zoom:', mapZoom)
        }
      }

      // Create map
      map.current = L.map(mapContainer.current).setView(mapCenter, mapZoom)

      // Add OpenStreetMap tiles (free!)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map.current)

      // Initialize marker cluster group
      markersLayer.current = L.markerClusterGroup({
        maxClusterRadius: 60,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount()
          let size = 'small'
          if (count > 30) size = 'large'
          else if (count > 10) size = 'medium'

          return L.divIcon({
            html: `<div style="
              background: #3c5b4b;
              color: white;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">${count}</div>`,
            className: 'custom-cluster-icon',
            iconSize: L.point(40, 40)
          })
        }
      })
      map.current.addLayer(markersLayer.current)

      // If not auto-centering, fetch properties for current view
      if (!autoCenter) {
        map.current.whenReady(() => {
          setTimeout(() => {
            if (map.current) {
              map.current.invalidateSize()
              fetchPropertiesInView()
            }
          }, 200)
        })
      } else {
        // Already have properties from auto-center
        updateMarkers(properties)
      }

      // Show "Search this area" button when map moves
      map.current.on('moveend', () => {
        setShowSearchButton(true)
      })

      console.log('[MapSearch] Map initialized')
    }

    initMap()

    return () => {
      markersLayer.current?.clearLayers()
      map.current?.remove()
      map.current = null
    }
  }, [])

  // Update markers when properties change
  useEffect(() => {
    if (properties.length > 0 && map.current && markersLayer.current) {
      console.log('[MapSearch] Updating markers with', properties.length, 'properties')
      updateMarkers(properties)
    }
  }, [properties])

  // Fetch properties using existing API client
  const fetchPropertiesInView = async (customFilters?: MapFilters) => {
    if (!map.current) return

    setLoading(true)

    const bounds = map.current.getBounds()
    const zoom = map.current.getZoom()

    // Validate bounds are properly initialized
    const north = bounds.getNorth()
    const south = bounds.getSouth()
    const east = bounds.getEast()
    const west = bounds.getWest()

    console.log('[MapSearch] Current bounds:', { north, south, east, west, zoom })

    // Calculate bounds dimensions
    const latDiff = north - south
    const lngDiff = Math.abs(east - west)
    
    // Check if bounds are valid
    if (
      isNaN(north) || isNaN(south) || isNaN(east) || isNaN(west) ||
      !isFinite(north) || !isFinite(south) || !isFinite(east) || !isFinite(west) ||
      latDiff <= 0.0001 || // Bounds too small (essentially a point)
      lngDiff <= 0.0001
    ) {
      console.error('[MapSearch] Invalid bounds - too small or malformed:', { 
        north, south, east, west,
        latDiff, lngDiff,
        retries: retryCount.current
      })
      setLoading(false)
      
      // Try again after a delay if this is the initial load AND we haven't exceeded max retries
      if (properties.length === 0 && retryCount.current < maxRetries) {
        retryCount.current++
        console.log(`[MapSearch] Retrying in 500ms... (attempt ${retryCount.current}/${maxRetries})`)
        setTimeout(() => {
          if (map.current) {
            map.current.invalidateSize()
            fetchPropertiesInView(customFilters)
          }
        }, 500)
      } else if (retryCount.current >= maxRetries) {
        console.error('[MapSearch] Max retries reached. Map container may not have proper dimensions.')
        console.error('[MapSearch] Check that map container has explicit height (e.g., height: 100vh)')
      }
      return
    }

    // Reset retry counter on successful bounds
    retryCount.current = 0

    console.log('[MapSearch] Fetching properties with valid bounds:', {
      north, south, east, west, zoom,
      size: { latDiff, lngDiff }
    })

    // Use custom filters if provided, otherwise use active filters
    const filtersToUse = customFilters || activeFilters

    console.log('[MapSearch] Using filters:', filtersToUse)

    // Use existing API function from lib/api.ts
    const result = await searchPropertiesMap(
      { north, south, east, west },
      Math.floor(zoom),
      filtersToUse
    )

    if (result) {
      setProperties(result.properties || [])
      setPriceRange(result.price_range)
      updateMarkers(result.properties || [])
      setShowSearchButton(false)

      // Track map view event using existing tracker
      if (window.StratosTracker) {
        window.StratosTracker.trackEvent('map_view', {
          properties_count: result.properties?.length || 0,
          zoom_level: Math.floor(zoom),
          has_filters: Object.keys(filters).length > 0
        })
      }
    }

    setLoading(false)
  }

  // Handle location search from search bar
  const handleLocationSearch = (lat: number, lng: number, zoom?: number, bounds?: { south: number, north: number, west: number, east: number }) => {
    if (!map.current) return

    console.log('[MapSearch] Location search:', { lat, lng, zoom, bounds })

    // If bounds provided, fit to bounds
    if (bounds) {
      map.current.fitBounds([
        [bounds.south, bounds.west],
        [bounds.north, bounds.east]
      ], {
        padding: [50, 50],
        maxZoom: 15
      })
    } else {
      // Otherwise just center and zoom
      map.current.setView([lat, lng], zoom || 13, {
        animate: true
      })
    }

    // Fetch properties in new area after a short delay
    setTimeout(() => {
      fetchPropertiesInView()
    }, 500)
  }

  // Handle filter changes
  const handleFiltersChange = (newFilters: MapFilters) => {
    console.log('[MapSearch] Filters changed:', newFilters)
    setActiveFilters(newFilters)
    // Fetch properties with new filters
    if (map.current) {
      fetchPropertiesInView(newFilters)
    }
  }

  // Update map markers
  const updateMarkers = (newProperties: Property[]) => {
    if (!map.current || !markersLayer.current) {
      console.warn('[MapSearch] Cannot update markers - map or markersLayer not ready')
      return
    }

    console.log('[MapSearch] updateMarkers called with', newProperties.length, 'properties')

    // Clear existing markers
    markersLayer.current.clearLayers()

    let addedCount = 0
    let skippedCount = 0
    const skippedReasons: Record<string, number> = {
      noPrice: 0,
      noCoords: 0
    }

    // Add new markers with custom price pins
    newProperties.forEach((property, index) => {
      // Calculate price from asking_price or rent_amount
      const price = property.listing_type === 'sale' || property.listing_type === 'for-sale'
        ? property.asking_price
        : property.rent_amount

      // Debug first few properties
      if (index < 3) {
        console.log(`[MapSearch] Property ${index + 1}:`, {
          address: property.display_address,
          listing_type: property.listing_type,
          asking_price: property.asking_price,
          rent_amount: property.rent_amount,
          calculated_price: price,
          lat: property.latitude,
          lng: property.longitude
        })
      }

      if (!price) {
        skippedCount++
        skippedReasons.noPrice++
        if (index < 3) console.warn(`[MapSearch] Skipping ${property.display_address} - no price`)
        return
      }

      if (!property.latitude || !property.longitude) {
        skippedCount++
        skippedReasons.noCoords++
        if (index < 3) console.warn(`[MapSearch] Skipping ${property.display_address} - no coordinates`)
        return
      }

      const isSale = property.listing_type === 'sale' || property.listing_type === 'for-sale'
      const priceDisplay = isSale
        ? `£${(price / 1000).toFixed(0)}k`
        : `£${price}pcm`

      // Create custom marker with price
      const icon = L.divIcon({
        className: 'custom-price-marker',
        html: `
          <div class="price-pin ${property.is_featured ? 'featured' : ''}" data-property-id="${property.id}">
            ${priceDisplay}
          </div>
        `,
        iconSize: [60, 30],
        iconAnchor: [30, 30]
      })

      const marker = L.marker([property.latitude, property.longitude], { icon })

      // Get primary image URL
      const primaryImage = property.property_media?.find(m => m.is_primary)
      const imageUrl = primaryImage?.file_url || property.property_media?.[0]?.file_url

      // Popup on click
      const popupContent = `
        <div class="property-popup">
          ${imageUrl ? `<img src="${imageUrl}" alt="${property.display_address}" />` : ''}
          <div class="popup-content">
            <div class="popup-price">${priceDisplay}</div>
            <div class="popup-details">${property.bedrooms} bed • ${property.property_type}</div>
            <div class="popup-address">${property.display_address}</div>
            <a href="/property/${property.agent_ref || property.id}" class="popup-link">View Details →</a>
          </div>
        </div>
      `
      marker.bindPopup(popupContent)

      // Click handler
      marker.on('click', () => {
        setSelectedProperty(property.id)
        onPropertyClick?.(property)
        
        // Track marker click
        if (window.StratosTracker) {
          window.StratosTracker.trackEvent('map_property_click', {
            property_id: property.id,
            source: 'map_marker'
          })
        }
        
        // Scroll to property in list
        const card = document.querySelector(`[data-property-card="${property.id}"]`)
        card?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })

      // Hover handler
      marker.on('mouseover', () => {
        setHoveredProperty(property.id)
      })
      marker.on('mouseout', () => {
        setHoveredProperty(null)
      })

      markersLayer.current?.addLayer(marker)
      addedCount++
    })

    console.log('[MapSearch] Markers update complete:', {
      total: newProperties.length,
      added: addedCount,
      skipped: skippedCount,
      reasons: skippedReasons
    })

    // Check if markers are visible in DOM
    setTimeout(() => {
      const markerElements = document.querySelectorAll('.leaflet-marker-icon')
      console.log('[MapSearch] Marker elements in DOM:', markerElements.length)
    }, 100)
  }

  // Update marker styles based on hover/selected state
  useEffect(() => {
    const markers = document.querySelectorAll('.price-pin')
    markers.forEach((pin) => {
      const propertyId = pin.getAttribute('data-property-id')
      pin.classList.toggle('hovered', propertyId === hoveredProperty)
      pin.classList.toggle('selected', propertyId === selectedProperty)
    })
  }, [hoveredProperty, selectedProperty])

  // Handle property card hover
  const handlePropertyHover = (propertyId: string | null) => {
    setHoveredProperty(propertyId)
    
    // Pan map to property
    if (propertyId && map.current) {
      const property = properties.find(p => p.id === propertyId)
      if (property && property.latitude && property.longitude) {
        map.current.setView([property.latitude, property.longitude], map.current.getZoom(), {
          animate: true,
          duration: 0.5
        })
      }
    }
  }

  // Handle property card click
  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property.id)
    onPropertyClick?.(property)

    // Track list click
    if (window.StratosTracker) {
      window.StratosTracker.trackEvent('map_property_click', {
        property_id: property.id,
        source: 'property_list'
      })
    }
  }

  return (
    <div className="map-search-container" style={{ 
      display: 'flex', 
      height: '100%', 
      width: '100%',
      position: 'relative'
    }}>
      {/* Property List Sidebar */}
      <div className="property-list-sidebar" style={{
        width: '400px',
        height: '100%',
        overflowY: 'auto',
        backgroundColor: 'white',
        borderRight: '1px solid #e5e7eb',
        flexShrink: 0
      }}>
        <div className="list-header" style={{
          padding: '1rem',
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 10
        }}>
          <div className="results-count">
            {loading ? (
              <div className="loading-spinner">🔄</div>
            ) : (
              <>
                <h2 className="count-text" style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  color: '#111827'
                }}>
                  <strong>{properties.length}</strong> properties
                </h2>
                {priceRange && (
                  <p className="price-summary" style={{
                    margin: '0.25rem 0 0 0',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    £{(priceRange.min / 1000).toFixed(0)}k - £{(priceRange.max / 1000).toFixed(0)}k
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="property-cards-scroll" style={{
          padding: '1rem'
        }}>
          {properties.length === 0 && !loading && (
            <div className="empty-state" style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#6b7280'
            }}>
              <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>No properties in this area</p>
              <p className="empty-hint" style={{ 
                margin: '0.5rem 0 0 0',
                fontSize: '0.875rem'
              }}>Try zooming out or moving the map</p>
            </div>
          )}

          {properties.map(property => {
            // Calculate price
            const price = property.listing_type === 'sale' || property.listing_type === 'for-sale'
              ? property.asking_price
              : property.rent_amount

            if (!price) return null

            // Get primary image
            const primaryImage = property.property_media?.find(m => m.is_primary)
            const imageUrl = primaryImage?.file_url || property.property_media?.[0]?.file_url

            return (
              <a
                key={property.id}
                href={`/property/${property.agent_ref || property.id}`}
                data-property-card={property.id}
                className={`property-card ${hoveredProperty === property.id ? 'hovered' : ''} ${selectedProperty === property.id ? 'selected' : ''}`}
                style={{
                  display: 'block',
                  marginBottom: '1rem',
                  borderRadius: '0.5rem',
                  border: `2px solid ${selectedProperty === property.id ? '#3c5b4b' : hoveredProperty === property.id ? '#3c5b4b50' : '#e5e7eb'}`,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  backgroundColor: 'white'
                }}
                onMouseEnter={() => handlePropertyHover(property.id)}
                onMouseLeave={() => handlePropertyHover(null)}
                onClick={(e) => {
                  e.preventDefault()
                  handlePropertyClick(property)
                }}
              >
                <div className="card-image">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={property.display_address}
                      loading="lazy"
                    />
                  ) : (
                    <div className="placeholder-image">
                      🏠
                    </div>
                  )}
                  {property.is_featured && (
                    <span className="featured-badge">Featured</span>
                  )}
                </div>

                <div className="card-content">
                  <div className="card-price">
                    £{price.toLocaleString()}
                    {(property.listing_type === 'let' || property.listing_type === 'to-let') && 
                      <span className="price-suffix">pcm</span>
                    }
                  </div>
                  
                  <div className="card-details">
                    <span>{property.bedrooms} bed</span>
                    {property.bathrooms && <span>{property.bathrooms} bath</span>}
                    {property.receptions && <span>{property.receptions} rec</span>}
                    <span>{property.property_type}</span>
                  </div>

                  <div className="card-address">
                    {property.display_address}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>

      {/* Map Container */}
      <div className="map-view" style={{
        flex: 1,
        height: '100%',
        position: 'relative'
      }}>
        <div 
          ref={mapContainer} 
          className="map-container" 
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        />
        
        {/* Location Search Bar */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          zIndex: 1000
        }}>
          {/* <MapSearchBar
            onLocationSelect={handleLocationSearch}
            placeholder="Search locations..."
          /> */}
        </div>

        {/* Filters Panel */}
        <MapFiltersPanel
          filters={activeFilters}
          onFiltersChange={handleFiltersChange}
          propertyCount={properties.length}
          isLoading={loading}
        />

        {/* Search This Area Button */}
        {/* {showSearchButton && (
          <button 
            className="search-area-btn"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              zIndex: 1000,
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3c5b4b',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              transition: 'all 0.2s',
              fontFamily: 'Garet, sans-serif'
            }}
            onClick={fetchPropertiesInView}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2d4538'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3c5b4b'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            🔍 Search this area
          </button>
        )} */}

        {/* Loading Overlay */}
        {loading && (
          <div className="map-loading-overlay" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999
          }}>
            <div className="loading-spinner-text" style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#3c5b4b'
            }}>🔄 Loading properties...</div>
          </div>
        )}
      </div>
    </div>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    StratosTracker?: {
      trackEvent: (eventType: string, data?: Record<string, any>) => void
    }
  }
}