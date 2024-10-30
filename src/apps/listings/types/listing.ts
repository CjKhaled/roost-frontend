export type AmenityType = 'WiFi' | 'Parking' | 'Laundry' | 'Dishwasher' | 'Gym' | 'Pool' | 'Study Room' | 'Trash Pickup' | 'Cable TV' | 'Electric Vehicle Charging'
export type UtilityType = 'Electricity' | 'Water' | 'Gas' | 'Sewer' | 'Pest Control'

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
  lister: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export interface ListingResponse {
  listings: Listing[]
  total: number
}

export interface ListingError {
  message: string
  field?: keyof Listing
}
