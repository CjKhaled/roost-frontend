import { type APIListing, type Listing } from '../types/listing'

interface ListingsResponse {
  listings: APIListing[]
}

interface ListingResponse {
  listing: APIListing
}

export const transformAPIListing = (apiListing: APIListing): Listing => {
  return {
    id: apiListing.id,
    name: apiListing.name,
    address: apiListing.address,
    location: {
      lat: apiListing.locationLat,
      lng: apiListing.locationLng
    },
    price: apiListing.price,
    description: apiListing.description,
    available: {
      from: apiListing.availableFrom,
      to: apiListing.availableTo
    },
    imageUrl: apiListing.imageUrl,
    amenities: apiListing.amenities,
    utilities: apiListing.utilities,
    policies: {
      strictParking: apiListing.strictParking,
      strictNoisePolicy: apiListing.strictNoisePolicy,
      guestsAllowed: apiListing.guestsAllowed,
      petsAllowed: apiListing.petsAllowed,
      smokingAllowed: apiListing.smokingAllowed
    },
    bedCount: apiListing.bedCount,
    bathCount: apiListing.bathCount,
    createdAt: new Date(apiListing.createdAt),
    updatedAt: new Date(apiListing.updatedAt),
    listerId: apiListing.createdById
  }
}

export class ListingsService {
  private readonly API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

  async getListings (): Promise<Listing[]> {
    try {
      const response = await fetch(`${this.API_URL}/listings`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch listings')
      }

      const data = await response.json() as ListingsResponse
      return data.listings.map(transformAPIListing)
    } catch (error) {
      console.error('Error fetching listings:', error)
      throw error
    }
  }

  async getListingById (id: string): Promise<Listing> {
    try {
      const response = await fetch(`${this.API_URL}/listings/${id}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch listing')
      }

      const data = await response.json() as ListingResponse
      return transformAPIListing(data.listing)
    } catch (error) {
      console.error('Error fetching listing:', error)
      throw error
    }
  }
}

export const listingsService = new ListingsService()
