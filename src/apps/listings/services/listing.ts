import { type APIListing, type Listing } from '../types/listing'

interface ListingsResponse {
  listings: APIListing[]
}

interface ListingResponse {
  listing: APIListing
}

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  createdListings: Array<{ id: string }>
}

interface UserResponse {
  user: User
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

  async getUserWhoCreatedListing (id: string): Promise<User> {
    try {
      const response = await fetch(`${this.API_URL}/users/${id}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user')
      }

      const data = await response.json() as UserResponse
      return data.user
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

  async getUserByID (listerID: string): Promise<{ firstName: string; lastName: string }> {
    try {
      const response = await fetch(`${this.API_URL}/users/${listerID}`, {
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Failed to fetch lister')
      }
      const { user } = await response.json() // Destructure the `user` object
      console.log(user)
      return user
    } catch (error) {
      console.error('Error fetching user:', error)
      throw error
    }
  }

  async createListing (listing: Partial<Listing>): Promise<Listing> {
    try {
      const response = await fetch(`${this.API_URL}/listings/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name: listing.name,
          description: listing.description,
          bedCount: listing.bedCount,
          bathCount: listing.bathCount,
          address: listing.address,
          price: listing.price,
          location: {
            lat: listing.location?.lat,
            lng: listing.location?.lng
          },
          available: {
            from: listing.available?.from,
            to: listing.available?.to
          },
          imageUrl: listing.imageUrl,
          amenities: listing.amenities,
          utilities: listing.utilities,
          policies: listing.policies
        })
      })

      if (!response.ok) {
        const error = await response.json()
        console.log(error)
        throw new Error('Failed to create listing')
      }

      const data = await response.json() as { listing: APIListing }
      return transformAPIListing(data.listing)
    } catch (error) {
      console.error('Error creating listing:', error)
      throw error
    }
  }

  async updateListing (id: string, listing: Partial<Listing>): Promise<Listing> {
    try {
      const response = await fetch(`${this.API_URL}/listings/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name: listing.name,
          description: listing.description,
          bedCount: listing.bedCount,
          bathCount: listing.bathCount,
          address: listing.address,
          price: listing.price,
          location: {
            lat: listing.location?.lat,
            lng: listing.location?.lng
          },
          available: {
            from: listing.available?.from,
            to: listing.available?.to
          },
          imageUrl: listing.imageUrl,
          amenities: listing.amenities,
          utilities: listing.utilities,
          policies: listing.policies
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update listing')
      }

      const data = await response.json() as { listing: APIListing }
      return transformAPIListing(data.listing)
    } catch (error) {
      console.error('Error updating listing:', error)
      throw error
    }
  }

  async deleteListing (id: string): Promise<Listing> {
    try {
      const response = await fetch(`${this.API_URL}/listings/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to delete listing')
      }

      const data = await response.json() as { listing: APIListing }
      return transformAPIListing(data.listing)
    } catch (error) {
      console.error('Error deleting listing:', error)
      throw error
    }
  }

  async getUserListings (userId: string): Promise<Listing[]> {
    try {
      // First get the user's created listings
      const userResponse = await fetch(`${this.API_URL}/users/${userId}`, {
        credentials: 'include'
      })

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data')
      }

      const userData = await userResponse.json() as UserResponse
      const listingIds = userData.user.createdListings.map(listing => listing.id)

      // Then fetch full listing details for each listing
      const listingPromises = listingIds.map(async id => await this.getListingById(id))
      const listings = await Promise.all(listingPromises)

      return listings
    } catch (error) {
      console.error('Error fetching user listings:', error)
      throw error
    }
  }
}

export const listingsService = new ListingsService()
