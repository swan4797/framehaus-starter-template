export type ListingType = 'sale' | 'rent'
export type PropertyType = 'house' | 'flat' | 'bungalow' | 'maisonette' | 'land' | 'commercial'
export type PropertyStyle = 'detached' | 'semi_detached' | 'terraced' | 'end_terrace' | 'apartment' | 'studio'
export type Furnishing = 'furnished' | 'unfurnished' | 'part_furnished'
export type Tenure = 'freehold' | 'leasehold' | 'share_of_freehold' | 'commonhold'
export type Parking = 'none' | 'on_street' | 'driveway' | 'garage' | 'allocated' | 'underground'
export type EPCRating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'

export interface PropertyMedia {
  media_id: string
  file_url: string
  thumbnail_url?: string
  media_type: string
  is_primary: boolean
  display_order: number
}

export interface Property {
  id: string
  agency_id: string
  branch_id: string
  agent_ref: string
  property_type: PropertyType
  property_style: PropertyStyle
  listing_type: ListingType
  display_address: string
  city: string
  county: string
  postcode: string
  latitude: number
  longitude: number
  bedrooms: number
  bathrooms: number
  receptions: number
  internal_area: number
  area_unit: 'sqft' | 'sqm'
  asking_price: number
  rent_amount: number
  rent_frequency: 'weekly' | 'monthly' | 'yearly'
  furnishing: Furnishing
  tenure: Tenure
  listing_status: string
  summary: string
  description: string
  key_features: string[]
  epc_rating: EPCRating
  epc_current_score: number
  parking: Parking
  created_at: string
  updated_at: string
  listed_date: string
  price_changed_at: string
  media: PropertyMedia[]
}

export interface SearchFilters {
  listing_type: ListingType
  location?: string
  postcode?: string
  property_types?: PropertyType[]
  min_price?: number
  max_price?: number
  min_bedrooms?: number
  max_bedrooms?: number
  min_bathrooms?: number
  furnishing?: Furnishing[]
  tenure?: Tenure[]
  parking?: Parking[]
  epc_rating?: EPCRating[]
  has_garden?: boolean
  has_parking?: boolean
  new_build?: boolean
  chain_free?: boolean
  pet_friendly?: boolean
  sort_by?: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'reduced'
  page?: number
  limit?: number
}

export interface SearchResponse {
  properties: Property[]
  total: number
  page: number
  limit: number
  total_pages: number
}