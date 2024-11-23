import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { listingsService, transformAPIListing } from '../services/listing'
import { type Listing, type AmenityType, type UtilityType } from '../types/listing'

describe('ListingsService', () => {
  const mockFetch = vi.fn()
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = mockFetch
    vi.clearAllMocks()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  const mockAPIListing = {
    id: '1',
    name: 'Test Listing',
    address: '123 Test St',
    locationLat: 40.7128,
    locationLng: -74.0060,
    price: 1500,
    description: 'A test listing',
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    imageUrl: ['test1.jpg', 'test2.jpg'],
    amenities: ['WIFI', 'PARKING'] as AmenityType[],
    utilities: ['ELECTRICITY', 'WATER'] as UtilityType[],
    strictParking: true,
    strictNoisePolicy: true,
    guestsAllowed: true,
    petsAllowed: false,
    smokingAllowed: false,
    bedCount: 2,
    bathCount: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    createdById: 'user123'
  }

  describe('transformAPIListing', () => {
    it('should correctly transform API listing to frontend listing', () => {
      const transformed = transformAPIListing(mockAPIListing)

      expect(transformed).toEqual({
        id: '1',
        name: 'Test Listing',
        address: '123 Test St',
        location: {
          lat: 40.7128,
          lng: -74.0060
        },
        price: 1500,
        description: 'A test listing',
        available: {
          from: '2024-01-01',
          to: '2024-12-31'
        },
        imageUrl: ['test1.jpg', 'test2.jpg'],
        amenities: ['WIFI', 'PARKING'],
        utilities: ['ELECTRICITY', 'WATER'],
        policies: {
          strictParking: true,
          strictNoisePolicy: true,
          guestsAllowed: true,
          petsAllowed: false,
          smokingAllowed: false
        },
        bedCount: 2,
        bathCount: 1,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
        listerId: 'user123'
      })
    })
  })

  describe('getListings', () => {
    it('should fetch all listings successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ listings: [mockAPIListing] })
      })

      const listings = await listingsService.getListings()
      expect(listings).toHaveLength(1)
      expect(listings[0]).toEqual(transformAPIListing(mockAPIListing))
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/listings'),
        expect.objectContaining({
          credentials: 'include'
        })
      )
    })

    it('should handle fetch failure', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false })
      await expect(listingsService.getListings()).rejects.toThrow('Failed to fetch listings')
    })
  })

  describe('getListingById', () => {
    it('should fetch a single listing successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ listing: mockAPIListing })
      })

      const listing = await listingsService.getListingById('1')
      expect(listing).toEqual(transformAPIListing(mockAPIListing))
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/listings/1'),
        expect.objectContaining({
          credentials: 'include'
        })
      )
    })

    it('should handle fetch failure for single listing', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false })
      await expect(listingsService.getListingById('1')).rejects.toThrow('Failed to fetch listing')
    })
  })

  describe('createListing', () => {
    const newListing: Partial<Listing> = {
      name: 'New Listing',
      description: 'A new test listing',
      bedCount: 2,
      bathCount: 1,
      address: '123 New St',
      price: 2000,
      location: {
        lat: 40.7128,
        lng: -74.0060
      },
      available: {
        from: '2024-01-01',
        to: '2024-12-31'
      },
      imageUrl: ['new1.jpg', 'new2.jpg'],
      amenities: ['WIFI', 'GYM'],
      utilities: ['WATER', 'GAS'],
      policies: {
        strictParking: true,
        strictNoisePolicy: true,
        guestsAllowed: true,
        petsAllowed: false,
        smokingAllowed: false
      }
    }

    it('should create a listing successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ listing: mockAPIListing })
      })

      const listing = await listingsService.createListing(newListing)
      expect(listing).toEqual(transformAPIListing(mockAPIListing))
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/listings/create'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(newListing)
        })
      )
    })

    it('should handle creation failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue({ message: 'Failed to create listing' })
      })

      await expect(listingsService.createListing(newListing)).rejects.toThrow('Failed to create listing')
    })
  })

  describe('updateListing', () => {
    const updateData: Partial<Listing> = {
      name: 'Updated Listing',
      price: 2500,
      location: {
        lat: 40.7128,
        lng: -74.006
      },
      available: {
        from: '2024-01-01',
        to: '2024-12-31'
      },
      imageUrl: ['updated1.jpg', 'updated2.jpg'],
      amenities: ['WIFI', 'POOL'],
      utilities: ['ELECTRICITY', 'PEST_CONTROL']
    }

    it('should update a listing successfully', async () => {
      const updatedAPIListing = {
        ...mockAPIListing,
        name: updateData.name,
        price: updateData.price,
        imageUrl: updateData.imageUrl,
        amenities: updateData.amenities,
        utilities: updateData.utilities
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ listing: updatedAPIListing })
      })

      const listing = await listingsService.updateListing('1', updateData)
      expect(listing.name).toBe(updateData.name)
      expect(listing.price).toBe(updateData.price)
      expect(listing.imageUrl).toEqual(updateData.imageUrl)
      expect(listing.amenities).toEqual(updateData.amenities)
      expect(listing.utilities).toEqual(updateData.utilities)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/listings/update/1',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(updateData)
        }
      )
    })

    it('should handle update failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Failed to update listing' })
      })

      await expect(listingsService.updateListing('1', updateData)).rejects.toThrow('Failed to update listing')
    })
  })

  describe('getUserListings', () => {
    const mockUser = {
      id: 'user123',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      createdListings: [{ id: '1' }, { id: '2' }]
    }

    it('should fetch user listings successfully', async () => {
      // Mock user fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser })
      })

      // Mock individual listing fetches
      const secondMockListing = {
        ...mockAPIListing,
        id: '2',
        name: 'Second Test Listing',
        imageUrl: ['second1.jpg', 'second2.jpg']
      }

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ listing: mockAPIListing })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ listing: secondMockListing })
        })

      const listings = await listingsService.getUserListings('user123')
      expect(listings).toHaveLength(2)
      expect(mockFetch).toHaveBeenCalledTimes(3) // One for user, two for listings
      expect(listings[0]).toEqual(transformAPIListing(mockAPIListing))
      expect(listings[1]).toEqual(transformAPIListing(secondMockListing))
    })

    it('should handle user fetch failure', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false })
      await expect(listingsService.getUserListings('user123')).rejects.toThrow('Failed to fetch user data')
    })

    it('should handle listing fetch failure', async () => {
      // Mock successful user fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser })
      })

      // Mock failed listing fetch
      mockFetch.mockResolvedValueOnce({ ok: false })

      await expect(listingsService.getUserListings('user123')).rejects.toThrow('Failed to fetch listing')
    })
  })
})
