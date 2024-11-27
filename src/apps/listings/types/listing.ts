export type AmenityType = 'WIFI' | 'PARKING' | 'LAUNDRY' | 'DISHWASHER' | 'GYM' | 'POOL' | 'STUDY_ROOM' | 'TRASH_PICKUP' | 'CABLE_TV' | 'EV_CHARGING'
export type UtilityType = 'ELECTRICITY' | 'WATER' | 'GAS' | 'SEWER' | 'PEST_CONTROL'

// API response listing
export interface APIListing {
  id: string
  name: string
  bedCount: number
  bathCount: number
  address: string
  createdAt: string
  price: number
  description: string
  updatedAt: string
  locationLat: number
  locationLng: number
  availableFrom: string
  availableTo: string
  imageUrl: string[]
  amenities: AmenityType[]
  utilities: UtilityType[]
  city: string
  cityLat: number
  cityLng: number
  strictParking: boolean
  strictNoisePolicy: boolean
  guestsAllowed: boolean
  petsAllowed: boolean
  smokingAllowed: boolean
  createdById: string
}

// frontend listing
export interface Listing {
  id: string
  name: string
  address: string
  location: {
    lat: number
    lng: number
  }
  price: number
  available: {
    from: string
    to: string
  }
  imageUrl: string[]
  description: string
  amenities: AmenityType[]
  utilities: UtilityType[]
  city: string
  cityLat: number
  cityLng: number
  policies: {
    strictParking?: boolean
    strictNoisePolicy?: boolean
    guestsAllowed?: boolean
    petsAllowed?: boolean
    smokingAllowed?: boolean
  }
  bedCount: number
  bathCount: number
  createdAt: Date
  updatedAt: Date
  listerId: string
}

export interface ListingResponse {
  listings: Listing[]
  total: number
}

export interface ListingError {
  message: string
  field?: keyof Listing
}
