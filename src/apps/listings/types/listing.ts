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

// export interface Listing {
//   id: number
//   name: string
//   address: string
//   location: {
//     lat: number
//     lng: number
//   }
//   price: number
//   availableFrom: string
//   imageUrl: string
//   amenities: ('WiFi' | 'Parking' | 'Laundry' | 'Dishwasher' | 'Gym' | 'Pool' | 'Study Room' | 'Trash Pickup' | 'Cable TV' | 'Electric Vehicle Charging')[]
//   utilities: ('Electricity' | 'Water' | 'Gas' | 'Sewer' | 'Pest Control')[]
//   policies: {
//     strictParking?: boolean
//     strictNoisePolicy?: boolean
//     guests?: boolean
//     pets?: boolean
//     smoking?: boolean
//   }
//   bedCount: number
//   bathCount: number
//   createdAt: Date
//   updatedAt: Date
//   lister: {
//     id: number
//     firstName: string
//     lastName: string
//     email: string
//   }
// }
