export interface Listing {
  id: number
  title: string
  address: string
  location: {
    lat: number
    lng: number
  }
  price: number
  availableFrom: string
  imageUrl: string
  amenities: string[]
  type: string
  bedrooms: number
  bathrooms: number
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface ListingFilters {
  priceRange?: {
    min: number
    max: number
  }
  bedrooms?: number
  bathrooms?: number
  amenities?: string[]
  type?: string
}

export interface ListingResponse {
  listings: Listing[]
  total: number
}

export interface ListingError {
  message: string
  field?: keyof Listing
}
