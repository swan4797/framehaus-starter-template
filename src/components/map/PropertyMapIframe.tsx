// ========================================
// PROPERTY MAP IFRAME COMPONENT
// Embeddable maps for property detail pages
// ========================================

interface PropertyMapIframeProps {
    latitude: number
    longitude: number
    address?: string
    postcode?: string
    height?: string
    width?: string
    zoom?: number
    provider?: 'openstreetmap' | 'google'
    googleApiKey?: string
    showMarker?: boolean
    allowFullscreen?: boolean
  }
  
  export function PropertyMapIframe({
    latitude,
    longitude,
    address = '',
    postcode = '',
    height = '450px',
    width = '100%',
    zoom = 15,
    provider = 'openstreetmap',
    googleApiKey,
    showMarker = true,
    allowFullscreen = true
  }: PropertyMapIframeProps) {
    
    // Generate iframe URL based on provider
    const getMapUrl = () => {
      if (provider === 'google' && googleApiKey) {
        // Google Maps Embed API
        const query = address || `${latitude},${longitude}`
        return `https://www.google.com/maps/embed/v1/place?key=${googleApiKey}&q=${encodeURIComponent(query)}&zoom=${zoom}&center=${latitude},${longitude}`
      } else {
        // OpenStreetMap (free, no API key needed)
        // Calculate bounding box for the view
        const delta = 0.005 / zoom * 15 // Adjust bbox based on zoom
        const bbox = `${longitude - delta},${latitude - delta},${longitude + delta},${latitude + delta}`
        
        return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${showMarker ? `&marker=${latitude},${longitude}` : ''}`
      }
    }
  
    const mapUrl = getMapUrl()
  
    return (
      <div 
        className="property-map-iframe-container"
        style={{
          width,
          height,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          backgroundColor: '#f3f4f6'
        }}
      >
        <iframe
          title="Property Location Map"
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          loading="lazy"
          allowFullScreen={allowFullscreen}
          referrerPolicy="no-referrer-when-downgrade"
        />
        
        {/* View Larger Link */}
        <a
          href={provider === 'google' 
            ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
            : `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoom}/${latitude}/${longitude}`
          }
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            backgroundColor: '#3c5b4b',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 600,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'Garet, sans-serif',
            transition: 'all 0.2s',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2d4538'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3c5b4b'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          View Larger Map
        </a>
      </div>
    )
  }
  
  // ========================================
  // PROPERTY MAP SECTION
  // Complete map section with heading and links
  // ========================================
  
  interface PropertyMapSectionProps {
    latitude: number
    longitude: number
    address: string
    postcode?: string
    displayAddress?: string
    provider?: 'openstreetmap' | 'google'
    googleApiKey?: string
  }
  
  export function PropertyMapSection({
    latitude,
    longitude,
    address,
    postcode,
    displayAddress,
    provider = 'openstreetmap',
    googleApiKey
  }: PropertyMapSectionProps) {
    return (
      <section 
        className="property-map-section"
        style={{
          marginTop: '3rem',
          fontFamily: 'Garet, sans-serif'
        }}
      >
        {/* Section Header */}
        <div style={{
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid #e5e7eb'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Location
          </h2>
          <p style={{
            margin: 0,
            fontSize: '1rem',
            color: '#6b7280',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {displayAddress || address}
            {postcode && `, ${postcode}`}
          </p>
        </div>
  
        {/* Map */}
        <PropertyMapIframe
          latitude={latitude}
          longitude={longitude}
          address={address}
          postcode={postcode}
          provider={provider}
          googleApiKey={googleApiKey}
        />
  
        {/* Quick Links */}
        <div style={{
          marginTop: '1rem',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              backgroundColor: 'white',
              color: '#3c5b4b',
              textDecoration: 'none',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3c5b4b'
              e.currentTarget.style.backgroundColor = '#f6f4f4'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.backgroundColor = 'white'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="10" r="3" />
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
            </svg>
            Open in Google Maps
          </a>
  
          <a
            href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              backgroundColor: 'white',
              color: '#3c5b4b',
              textDecoration: 'none',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3c5b4b'
              e.currentTarget.style.backgroundColor = '#f6f4f4'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.backgroundColor = 'white'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Street View
          </a>
  
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              backgroundColor: 'white',
              color: '#3c5b4b',
              textDecoration: 'none',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3c5b4b'
              e.currentTarget.style.backgroundColor = '#f6f4f4'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.backgroundColor = 'white'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
              <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
            </svg>
            Get Directions
          </a>
        </div>
      </section>
    )
  }