// ========================================
// MAP SEARCH LEAFLET - Modular Architecture
// Uses configurable components and utilities
// ========================================

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'

// Configuration
import type { MapConfig, MapCardConfig, MapMarkerConfig } from '../../config/map'
import { mapConfigs, getMapConfig, defaultCardConfig, defaultMarkerConfig } from '../../config/map'

// Components
import { MapPropertyCard, MapEmptyState, MapLoadingState, MapSidebarHeader } from './cards'
import { MapFiltersPanel, type MapFilters } from './MapFiltersPanel.tsx'

// Marker utilities
import {
  getPropertyUrl,
  getPropertyPrice,
  isSaleListing,
  getPropertyImage,
  createPriceMarkerIcon,
  getDefaultPopupContent,
  createClusterIconFunction,
} from './markers'

// API and types
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
  autoCenter?: boolean
  // Configuration options
  configPreset?: 'default' | 'compact' | 'fullMap' | 'vertical'
  cardConfig?: Partial<MapCardConfig>
  markerConfig?: Partial<MapMarkerConfig>
}

// ========================================
// COMPONENT
// ========================================

export function MapSearchLeaflet({
  initialCenter = [51.5074, -0.1276],
  initialZoom = 12,
  filters = {},
  onPropertyClick,
  autoCenter = true,
  configPreset = 'default',
  cardConfig: cardConfigOverride,
  markerConfig: markerConfigOverride,
}: MapSearchLeafletProps) {
  // Get configuration
  const config = getMapConfig(configPreset)
  const cardConfig: MapCardConfig = { ...config.card, ...cardConfigOverride }
  const markerConfig: MapMarkerConfig = { ...config.marker, ...markerConfigOverride }

  // Refs
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const markersLayer = useRef<L.MarkerClusterGroup | null>(null)
  const retryCount = useRef<number>(0)
  const maxRetries = 5

  // State
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [showSearchButton, setShowSearchButton] = useState(false)
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null)
  const [activeFilters, setActiveFilters] = useState<MapFilters>(filters || {})

  // ========================================
  // AUTO-CENTERING
  // ========================================

  const calculateCenter = (props: Property[]): [number, number] => {
    if (props.length === 0) return initialCenter

    const validProps = props.filter(p => p.latitude && p.longitude)
    if (validProps.length === 0) return initialCenter

    const avgLat = validProps.reduce((sum, p) => sum + p.latitude!, 0) / validProps.length
    const avgLng = validProps.reduce((sum, p) => sum + p.longitude!, 0) / validProps.length

    return [avgLat, avgLng]
  }

  const fetchAllPropertiesForCenter = async () => {
    setLoading(true)

    try {
      const wideBounds: MapBounds = {
        north: 85,
        south: -85,
        east: 180,
        west: -180
      }

      const result = await searchPropertiesMap(wideBounds, 5, filters)

      if (!result) {
        setLoading(false)
        return initialCenter
      }

      if (result.properties.length === 0) {
        setLoading(false)
        return initialCenter
      }

      setProperties(result.properties)
      setPriceRange(result.price_range)
      setLoading(false)

      return calculateCenter(result.properties)
    } catch (err) {
      console.error('[MapSearch] Error fetching properties:', err)
      setLoading(false)
      return initialCenter
    }
  }

  // ========================================
  // MAP INITIALIZATION
  // ========================================

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    const initMap = async () => {
      let mapCenter = initialCenter
      let mapZoom = initialZoom

      if (autoCenter) {
        const center = await fetchAllPropertiesForCenter()
        if (center) {
          mapCenter = center
          mapZoom = properties.length > 20 ? 11 : properties.length > 5 ? 12 : 13
        }
      }

      map.current = L.map(mapContainer.current).setView(mapCenter, mapZoom)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: config.maxZoom
      }).addTo(map.current)

      // Initialize marker cluster group with config
      markersLayer.current = L.markerClusterGroup({
        maxClusterRadius: config.cluster.maxRadius,
        spiderfyOnMaxZoom: config.cluster.spiderfyOnMaxZoom,
        showCoverageOnHover: config.cluster.showCoverageOnHover,
        zoomToBoundsOnClick: true,
        iconCreateFunction: createClusterIconFunction(markerConfig)
      })
      map.current.addLayer(markersLayer.current)

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
        updateMarkers(properties)
      }

      map.current.on('moveend', () => {
        setShowSearchButton(true)
      })
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
      updateMarkers(properties)
    }
  }, [properties])

  // ========================================
  // PROPERTY FETCHING
  // ========================================

  const fetchPropertiesInView = async (customFilters?: MapFilters) => {
    if (!map.current) return

    setLoading(true)

    const bounds = map.current.getBounds()
    const zoom = map.current.getZoom()

    const north = bounds.getNorth()
    const south = bounds.getSouth()
    const east = bounds.getEast()
    const west = bounds.getWest()

    const latDiff = north - south
    const lngDiff = Math.abs(east - west)

    if (
      isNaN(north) || isNaN(south) || isNaN(east) || isNaN(west) ||
      !isFinite(north) || !isFinite(south) || !isFinite(east) || !isFinite(west) ||
      latDiff <= 0.0001 || lngDiff <= 0.0001
    ) {
      setLoading(false)

      if (properties.length === 0 && retryCount.current < maxRetries) {
        retryCount.current++
        setTimeout(() => {
          if (map.current) {
            map.current.invalidateSize()
            fetchPropertiesInView(customFilters)
          }
        }, 500)
      }
      return
    }

    retryCount.current = 0
    const filtersToUse = customFilters || activeFilters

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

  // ========================================
  // MARKER MANAGEMENT
  // ========================================

  const updateMarkers = (newProperties: Property[]) => {
    if (!map.current || !markersLayer.current) return

    markersLayer.current.clearLayers()

    newProperties.forEach((property) => {
      const price = getPropertyPrice(property)
      if (!price || !property.latitude || !property.longitude) return

      const isSale = isSaleListing(property)
      const icon = createPriceMarkerIcon(price, isSale, property.is_featured || false, markerConfig)
      const marker = L.marker([property.latitude, property.longitude], { icon })

      // Bind popup
      marker.bindPopup(getDefaultPopupContent(property))

      // Event handlers
      marker.on('click', () => {
        setSelectedProperty(property.id)
        onPropertyClick?.(property)

        if (window.StratosTracker) {
          window.StratosTracker.trackEvent('map_property_click', {
            property_id: property.id,
            source: 'map_marker'
          })
        }

        const card = document.querySelector(`[data-property-card="${property.id}"]`)
        card?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })

      marker.on('mouseover', () => setHoveredProperty(property.id))
      marker.on('mouseout', () => setHoveredProperty(null))

      markersLayer.current?.addLayer(marker)
    })
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

  // ========================================
  // EVENT HANDLERS
  // ========================================

  const handleFiltersChange = (newFilters: MapFilters) => {
    setActiveFilters(newFilters)
    if (map.current) {
      fetchPropertiesInView(newFilters)
    }
  }

  const handlePropertyHover = (propertyId: string | null) => {
    setHoveredProperty(propertyId)

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

  const handlePropertyCardClick = (property: Property) => {
    setSelectedProperty(property.id)

    if (map.current && property.latitude && property.longitude) {
      map.current.setView([property.latitude, property.longitude], 16, {
        animate: true,
        duration: 0.5
      })

      if (markersLayer.current) {
        markersLayer.current.eachLayer((layer: any) => {
          if (layer instanceof L.Marker) {
            const markerLatLng = layer.getLatLng()
            if (
              Math.abs(markerLatLng.lat - property.latitude!) < 0.0001 &&
              Math.abs(markerLatLng.lng - property.longitude!) < 0.0001
            ) {
              layer.openPopup()
            }
          }
        })
      }
    }

    if (window.StratosTracker) {
      window.StratosTracker.trackEvent('map_property_click', {
        property_id: property.id,
        source: 'property_list'
      })
    }
  }

  // ========================================
  // RENDER
  // ========================================

  const showSidebar = config.sidebar.position !== 'none'

  return (
    <div className="map-search-container" style={{
      display: 'flex',
      flexDirection: config.sidebar.position === 'right' ? 'row-reverse' : 'row',
      height: '100%',
      width: '100%',
      position: 'relative'
    }}>
      {/* Property List Sidebar */}
      {showSidebar && (
        <div
          className="property-list-sidebar"
          style={{ width: config.sidebar.width }}
        >
          {/* Header */}
          {config.sidebar.showHeader && (
            <div className="list-header">
              <MapSidebarHeader
                count={properties.length}
                priceRange={priceRange}
                showPriceRange={config.sidebar.showPriceRange}
                isLoading={loading}
              />
            </div>
          )}

          {/* Property Cards */}
          <div className="property-cards-scroll">
            {properties.length === 0 && !loading && (
              <MapEmptyState
                title={config.emptyState.title}
                hint={config.emptyState.hint}
              />
            )}

            {properties.map((property) => (
              <MapPropertyCard
                key={property.id}
                property={property}
                config={cardConfig}
                isHovered={hoveredProperty === property.id}
                isSelected={selectedProperty === property.id}
                onHover={handlePropertyHover}
                onClick={handlePropertyCardClick}
                getPropertyUrl={getPropertyUrl}
              />
            ))}
          </div>
        </div>
      )}

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

        {/* Filters Panel */}
        <MapFiltersPanel
          filters={activeFilters}
          onFiltersChange={handleFiltersChange}
          propertyCount={properties.length}
          isLoading={loading}
        />

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
            <MapLoadingState />
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
