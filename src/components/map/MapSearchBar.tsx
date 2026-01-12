// ========================================
// MAP SEARCH BAR COMPONENT
// Location search with geocoding and autocomplete
// ========================================

import { useState, useRef, useEffect } from 'react'

interface SearchResult {
  display_name: string
  lat: string
  lon: string
  place_id: string
  type: string
  boundingbox?: [string, string, string, string] // [south, north, west, east]
}

interface MapSearchBarProps {
  onLocationSelect: (lat: number, lng: number, zoom?: number, bounds?: { south: number, north: number, west: number, east: number }) => void
  placeholder?: string
  className?: string
}

export function MapSearchBar({
  onLocationSelect,
  placeholder = 'Search location...',
  className = ''
}: MapSearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchTimeout = useRef<NodeJS.Timeout>()
  const searchRef = useRef<HTMLDivElement>(null)

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search for locations using Nominatim
  const searchLocation = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 3) {
      setResults([])
      return
    }

    setIsSearching(true)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(searchQuery)}&` +
        `format=json&` +
        `limit=5&` +
        `countrycodes=gb&` + // UK only
        `addressdetails=1`,
        {
          headers: {
            'User-Agent': 'StratosReachAI/1.0'
          }
        }
      )

      if (!response.ok) throw new Error('Search failed')

      const data: SearchResult[] = await response.json()
      setResults(data)
      setShowResults(true)
    } catch (error) {
      console.error('Location search error:', error)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Debounced search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)

    // Clear existing timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }

    // Set new timeout
    if (value.length >= 3) {
      searchTimeout.current = setTimeout(() => {
        searchLocation(value)
      }, 300)
    } else {
      setResults([])
      setShowResults(false)
    }
  }

  // Handle location selection
  const handleSelectLocation = (result: SearchResult) => {
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)

    // Determine zoom level based on result type
    let zoom = 13
    if (result.type === 'city' || result.type === 'town') zoom = 12
    if (result.type === 'village' || result.type === 'hamlet') zoom = 14
    if (result.type === 'postcode' || result.type === 'road') zoom = 15
    if (result.type === 'house' || result.type === 'building') zoom = 17

    // Calculate bounds if available
    let bounds: { south: number, north: number, west: number, east: number } | undefined
    if (result.boundingbox) {
      const [south, north, west, east] = result.boundingbox.map(parseFloat)
      bounds = { south, north, west, east }
    }

    setQuery(result.display_name)
    setShowResults(false)
    onLocationSelect(lat, lng, zoom, bounds)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSelectLocation(results[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowResults(false)
    }
  }

  // Get icon for result type
  const getResultIcon = (type: string) => {
    if (type === 'city' || type === 'town') return '🏙️'
    if (type === 'village' || type === 'hamlet') return '🏘️'
    if (type === 'postcode') return '📮'
    if (type === 'road' || type === 'street') return '🛣️'
    if (type === 'house' || type === 'building') return '🏠'
    return '📍'
  }

  return (
    <div 
      ref={searchRef}
      className={`map-search-bar ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '400px'
      }}
    >
      {/* Search Input */}
      <div style={{
        position: 'relative',
        width: '100%'
      }}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '12px 40px 12px 16px',
            fontSize: '16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            outline: 'none',
            transition: 'all 0.2s',
            backgroundColor: '#f6f4f4',
            fontFamily: 'Garet, sans-serif'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3c5b4b'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#3c5b4b'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(60, 91, 75, 0.1)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />

        {/* Search Icon / Loading Spinner */}
        <div style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none'
        }}>
          {isSearching ? (
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #e5e7eb',
              borderTopColor: '#3c5b4b',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite'
            }} />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          )}
        </div>
      </div>

      {/* Results Dropdown */}
      {showResults && results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          maxHeight: '300px',
          overflowY: 'auto',
          zIndex: 1000
        }}>
          {results.map((result, index) => (
            <button
              key={result.place_id}
              onClick={() => handleSelectLocation(result)}
              style={{
                width: '100%',
                padding: '12px 16px',
                textAlign: 'left',
                border: 'none',
                backgroundColor: selectedIndex === index ? '#f3f4f6' : 'white',
                cursor: 'pointer',
                transition: 'background-color 0.15s',
                borderBottom: index < results.length - 1 ? '1px solid #f3f4f6' : 'none',
                fontFamily: 'Garet, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = selectedIndex === index ? '#f3f4f6' : 'white'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '20px' }}>
                  {getResultIcon(result.type)}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#111827',
                    marginBottom: '2px'
                  }}>
                    {result.display_name.split(',')[0]}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    {result.display_name.split(',').slice(1).join(',').trim()}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showResults && query.length >= 3 && results.length === 0 && !isSearching && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '16px',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '14px',
          fontFamily: 'Garet, sans-serif'
        }}>
          No locations found for "{query}"
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}