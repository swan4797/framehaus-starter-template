// ========================================
// MAP FILTERS PANEL COMPONENT
// Property search filters for map view
// ========================================

import { useState, useEffect } from 'react'

export interface MapFilters {
  listing_type?: 'sale' | 'let'
  min_price?: number
  max_price?: number
  bedrooms?: number
  bathrooms?: number
  property_type?: string
  property_style?: string
  is_featured?: boolean
  location?: string  // NEW: Location search (town, postcode, street)
}

interface MapFiltersPanelProps {
  filters: MapFilters
  onFiltersChange: (filters: MapFilters) => void
  propertyCount: number
  isLoading?: boolean
}

export function MapFiltersPanel({
  filters,
  onFiltersChange,
  propertyCount,
  isLoading = false
}: MapFiltersPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<MapFilters>(filters)

  // Count active filters
  const activeFilterCount = Object.keys(localFilters).filter(key => {
    const value = localFilters[key as keyof MapFilters]
    return value !== undefined && value !== null && value !== ''
  }).length

  // Update local filters when prop changes
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  // Clear price filters when listing type changes (sale vs rent have different price ranges)
  useEffect(() => {
    if (localFilters.listing_type) {
      setLocalFilters(prev => ({
        ...prev,
        min_price: undefined,
        max_price: undefined
      }))
    }
  }, [localFilters.listing_type])

  // Apply filters
  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
  }

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters: MapFilters = {}
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  // Update individual filter
  const updateFilter = (key: keyof MapFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
  }

  // Property types
  const propertyTypes = [
    { value: 'house', label: 'House' },
    { value: 'flat', label: 'Flat/Apartment' },
    { value: 'bungalow', label: 'Bungalow' },
    { value: 'cottage', label: 'Cottage' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'land', label: 'Land' },
  ]

  // Property styles
  const propertyStyles = [
    { value: 'detached', label: 'Detached' },
    { value: 'semi_detached', label: 'Semi-Detached' },
    { value: 'terraced', label: 'Terraced' },
    { value: 'mews', label: 'Mews' },
    { value: 'penthouse', label: 'Penthouse' },
  ]

  // Sale price options
  const salePrices = [
    { value: 100000, label: '£100,000' },
    { value: 150000, label: '£150,000' },
    { value: 200000, label: '£200,000' },
    { value: 250000, label: '£250,000' },
    { value: 300000, label: '£300,000' },
    { value: 400000, label: '£400,000' },
    { value: 500000, label: '£500,000' },
    { value: 600000, label: '£600,000' },
    { value: 750000, label: '£750,000' },
    { value: 1000000, label: '£1,000,000' },
    { value: 1500000, label: '£1,500,000' },
    { value: 2000000, label: '£2,000,000' },
    { value: 3000000, label: '£3,000,000' },
  ]

  // Rental price options (per calendar month)
  const rentalPrices = [
    { value: 500, label: '£500 pcm' },
    { value: 600, label: '£600 pcm' },
    { value: 750, label: '£750 pcm' },
    { value: 1000, label: '£1,000 pcm' },
    { value: 1250, label: '£1,250 pcm' },
    { value: 1500, label: '£1,500 pcm' },
    { value: 1750, label: '£1,750 pcm' },
    { value: 2000, label: '£2,000 pcm' },
    { value: 2500, label: '£2,500 pcm' },
    { value: 3000, label: '£3,000 pcm' },
    { value: 4000, label: '£4,000 pcm' },
    { value: 5000, label: '£5,000 pcm' },
  ]

  // Get appropriate price options based on listing type
  const priceOptions = localFilters.listing_type === 'let' ? rentalPrices : salePrices
  const priceLabel = localFilters.listing_type === 'let' ? 'Monthly Rent' : 'Price'

  return (
    <>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          zIndex: 1000,
          padding: '0.75rem 1rem',
          backgroundColor: '#3c5b4b',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          transition: 'all 0.2s',
          fontFamily: 'Garet, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#2d4538'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#3c5b4b'
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
        Filters
        {activeFilterCount > 0 && (
          <span style={{
            backgroundColor: '#f6f4f4',
            color: '#3c5b4b',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 700
          }}>
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 1001,
              animation: 'fadeIn 0.2s ease-out'
            }}
          />

          {/* Panel */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: '360px',
              maxWidth: '90vw',
              backgroundColor: 'white',
              boxShadow: '2px 0 12px rgba(0, 0, 0, 0.15)',
              zIndex: 1002,
              overflowY: 'auto',
              animation: 'slideInLeft 0.3s ease-out',
              fontFamily: 'Garet, sans-serif'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '2px solid #e5e7eb',
              position: 'sticky',
              top: 0,
              backgroundColor: 'white',
              zIndex: 10
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <h2 style={{
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#111827'
                }}>
                  Filters
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: '#6b7280',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#6b7280'
              }}>
                {isLoading ? 'Loading...' : `${propertyCount} properties`}
              </p>
            </div>

            {/* Filters */}
            <div style={{ padding: '1.5rem' }}>
              
              {/* Listing Type */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  Listing Type
                </label>
                <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  {['sale', 'let'].map(type => (
                    <button
                      key={type}
                      onClick={() => updateFilter('listing_type', type === localFilters.listing_type ? undefined : type as 'sale' | 'let')}
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: `2px solid ${localFilters.listing_type === type ? '#3c5b4b' : '#e5e7eb'}`,
                        backgroundColor: localFilters.listing_type === type ? '#3c5b4b' : 'white',
                        color: localFilters.listing_type === type ? 'white' : '#374151',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textTransform: 'capitalize'
                      }}
                    >
                      {type === 'sale' ? 'For Sale' : 'To Let'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Search */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  Location
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Town, postcode, or street..."
                    value={localFilters.location || ''}
                    onChange={(e) => updateFilter('location', e.target.value || undefined)}
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 40px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3c5b4b'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                  />
                  {/* Location Icon */}
                  <div style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#6b7280'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  {/* Clear Button */}
                  {localFilters.location && (
                    <button
                      onClick={() => updateFilter('location', undefined)}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: '#6b7280',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6'
                        e.currentTarget.style.color = '#111827'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = '#6b7280'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    </button>
                  )}
                </div>
                <p style={{
                  margin: '0.5rem 0 0 0',
                  fontSize: '12px',
                  color: '#6b7280',
                  fontStyle: 'italic'
                }}>
                  e.g., "Abergavenny", "NP7", "High Street"
                </p>
              </div>

              {/* Price Range */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  {priceLabel}
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px'
                }}>
                  <div>
                    <select
                      value={localFilters.min_price || ''}
                      onChange={(e) => updateFilter('min_price', e.target.value ? parseInt(e.target.value) : undefined)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#3c5b4b'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                    >
                      <option value="">Min</option>
                      {priceOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={localFilters.max_price || ''}
                      onChange={(e) => updateFilter('max_price', e.target.value ? parseInt(e.target.value) : undefined)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#3c5b4b'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                    >
                      <option value="">Max</option>
                      {priceOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Bedrooms */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  Bedrooms
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '8px'
                }}>
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      onClick={() => updateFilter('bedrooms', localFilters.bedrooms === num ? undefined : num)}
                      style={{
                        padding: '12px 8px',
                        border: `2px solid ${localFilters.bedrooms === num ? '#3c5b4b' : '#e5e7eb'}`,
                        backgroundColor: localFilters.bedrooms === num ? '#3c5b4b' : 'white',
                        color: localFilters.bedrooms === num ? 'white' : '#374151',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  Bathrooms
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px'
                }}>
                  {[1, 2, 3, 4].map(num => (
                    <button
                      key={num}
                      onClick={() => updateFilter('bathrooms', localFilters.bathrooms === num ? undefined : num)}
                      style={{
                        padding: '12px 8px',
                        border: `2px solid ${localFilters.bathrooms === num ? '#3c5b4b' : '#e5e7eb'}`,
                        backgroundColor: localFilters.bathrooms === num ? '#3c5b4b' : 'white',
                        color: localFilters.bathrooms === num ? 'white' : '#374151',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  Property Type
                </label>
                <select
                  value={localFilters.property_type || ''}
                  onChange={(e) => updateFilter('property_type', e.target.value || undefined)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3c5b4b'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                >
                  <option value="">Any Type</option>
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Style */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  Property Style
                </label>
                <select
                  value={localFilters.property_style || ''}
                  onChange={(e) => updateFilter('property_style', e.target.value || undefined)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3c5b4b'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                >
                  <option value="">Any Style</option>
                  {propertyStyles.map(style => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Featured Only */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={localFilters.is_featured || false}
                    onChange={(e) => updateFilter('is_featured', e.target.checked || undefined)}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                      accentColor: '#3c5b4b'
                    }}
                  />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#111827'
                  }}>
                    Featured properties only
                  </span>
                </label>
              </div>

            </div>

            {/* Footer Actions */}
            <div style={{
              padding: '1.5rem',
              borderTop: '2px solid #e5e7eb',
              position: 'sticky',
              bottom: 0,
              backgroundColor: 'white',
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={handleClearFilters}
                disabled={activeFilterCount === 0}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  backgroundColor: 'white',
                  color: '#374151',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: activeFilterCount === 0 ? 'not-allowed' : 'pointer',
                  opacity: activeFilterCount === 0 ? 0.5 : 1,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (activeFilterCount > 0) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  handleApplyFilters()
                  setIsOpen(false)
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  backgroundColor: '#3c5b4b',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2d4538'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3c5b4b'
                }}
              >
                Show Results
              </button>
            </div>
          </div>

          {/* Animations */}
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideInLeft {
              from {
                transform: translateX(-100%);
              }
              to {
                transform: translateX(0);
              }
            }
          `}</style>
        </>
      )}
    </>
  )
}