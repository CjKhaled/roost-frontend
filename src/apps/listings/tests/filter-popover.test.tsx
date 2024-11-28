/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { type Listing } from '../types/listing'
import FilterPopover from '../components/FilterPopover'
import { listingsService } from '../services/listing'

// Mock the listings service
vi.mock('../services/listing')
const mockObserve = vi.fn()
const mockUnobserve = vi.fn()
const mockDisconnect = vi.fn()

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect
}))

describe('Filter Popover', () => {
  const mockListings: Listing[] = [
    {
      id: '1',
      name: 'Budget Apartment',
      address: '123 Test St',
      description: 'A test listing',
      price: 1000,
      bedCount: 2,
      bathCount: 1,
      imageUrl: ['test1.jpg'],
      location: { lat: 29.6516, lng: -82.3248 },
      available: {
        from: '2024-01-01T05:00:00.000Z',
        to: '2024-12-31T05:00:00.000Z'
      },
      amenities: ['WIFI', 'PARKING'],
      utilities: ['WATER', 'ELECTRICITY'],
      policies: {
        strictParking: true,
        strictNoisePolicy: false,
        guestsAllowed: true,
        petsAllowed: false,
        smokingAllowed: false
      },
      city: 'Gainesville, FL',
      cityLat: 29.6519563,
      cityLng: -82.324998,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      listerId: 'user1'
    },
    {
      id: '2',
      name: 'Luxury Apartment',
      address: '456 Test Ave',
      description: 'Another test listing',
      price: 2000,
      bedCount: 3,
      bathCount: 2,
      imageUrl: ['test2.jpg'],
      location: { lat: 29.6517, lng: -82.3249 },
      available: {
        from: '2024-06-01T05:00:00.000Z',
        to: '2025-05-31T04:00:00.000Z'
      },
      amenities: ['WIFI', 'GYM', 'POOL'],
      utilities: ['WATER', 'GAS'],
      policies: {
        strictParking: false,
        strictNoisePolicy: true,
        guestsAllowed: true,
        petsAllowed: true,
        smokingAllowed: false
      },
      city: 'Gainesville, FL',
      cityLat: 29.6519563,
      cityLng: -82.324998,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      listerId: 'user2'
    }
  ]

  const mockOnFiltersChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Clear ResizeObserver mocks
    mockObserve.mockClear()
    mockUnobserve.mockClear()
    mockDisconnect.mockClear()
    // Default successful response
    vi.mocked(listingsService.getListings).mockResolvedValue(mockListings)
  })

  it('should render filter popover', async () => {
    const user = userEvent.setup()
    render(
          <BrowserRouter>
            <FilterPopover onFiltersChange={mockOnFiltersChange} listings={mockListings} />
          </BrowserRouter>
    )

    // Open filter popover
    const filterButton = screen.getByRole('button', { name: /filters/i })
    await user.click(filterButton)

    // Check if all filter sections are present
    expect(screen.getByText('Maximum Price')).toBeInTheDocument()
    expect(screen.getByText('Bedrooms')).toBeInTheDocument()
    expect(screen.getByText('Bathrooms')).toBeInTheDocument()
    expect(screen.getByText('Amenities')).toBeInTheDocument()
    expect(screen.getByText('Date Range')).toBeInTheDocument()
  })

  it('changing max price and clicking apply filter should show the right listings', async () => {
    const user = userEvent.setup()
    render(
          <BrowserRouter>
            <FilterPopover onFiltersChange={mockOnFiltersChange} listings={mockListings} />
          </BrowserRouter>
    )

    // Open filter popover
    await user.click(screen.getByRole('button', { name: /filters/i }))

    // Change price slider (we'll use the lower value that should only include the budget apartment)
    const slider = screen.getByTestId('price-slider')
    act(() => {
      // @ts-expect-error - we know this prop exists
      slider.__ondrag?.(2000)
    })

    // Apply filters
    await user.click(screen.getByRole('button', { name: /apply filters/i }))

    // Check if onFiltersChange was called with correct parameters
    expect(mockOnFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        price: 2000,
        bedCount: '',
        bathCount: '',
        amenities: []
      })
    )
  })

  it('changing bedrooms and clicking apply filter should show the right listings', async () => {
    const user = userEvent.setup()
    render(
          <BrowserRouter>
            <FilterPopover onFiltersChange={mockOnFiltersChange} listings={mockListings} />
          </BrowserRouter>
    )

    // Open filter popover
    await user.click(screen.getByRole('button', { name: /filters/i }))

    // Select 3 bedrooms
    await user.click(screen.getByRole('button', { name: '3 bedrooms' }))

    // Apply filters
    await user.click(screen.getByRole('button', { name: /apply filters/i }))

    expect(mockOnFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        bedCount: 3
      })
    )
  })

  it('changing bathrooms and clicking apply filter should show the right listings', async () => {
    const user = userEvent.setup()
    render(
          <BrowserRouter>
            <FilterPopover onFiltersChange={mockOnFiltersChange} listings={mockListings} />
          </BrowserRouter>
    )

    // Open filter popover
    await user.click(screen.getByRole('button', { name: /filters/i }))

    // Select 2 bathrooms
    await user.click(screen.getByRole('button', { name: '2 bathrooms' }))

    // Apply filters
    await user.click(screen.getByRole('button', { name: /apply filters/i }))

    expect(mockOnFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        bathCount: 2
      })
    )
  })

  it('changing amenities and clicking apply filter should show the right listings', async () => {
    const user = userEvent.setup()
    render(
          <BrowserRouter>
            <FilterPopover onFiltersChange={mockOnFiltersChange} listings={mockListings} />
          </BrowserRouter>
    )

    // Open filter popover
    await user.click(screen.getByRole('button', { name: /filters/i }))

    // Select Pool amenity
    const poolCheckbox = screen.getByRole('checkbox', { name: /pool/i })
    await user.click(poolCheckbox)

    // Apply filters
    await user.click(screen.getByRole('button', { name: /apply filters/i }))

    expect(mockOnFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        amenities: ['POOL']
      })
    )
  })

  it('changing multiple filters and clicking apply filter should show the right listings', async () => {
    const user = userEvent.setup()
    render(
          <BrowserRouter>
            <FilterPopover onFiltersChange={mockOnFiltersChange} listings={mockListings} />
          </BrowserRouter>
    )

    // Open filter popover
    await user.click(screen.getByRole('button', { name: /filters/i }))

    // Set price
    const slider = screen.getByTestId('price-slider')
    act(() => {
      // @ts-expect-error - we know this prop exists
      slider.__ondrag?.(2000)
    })

    // Set bedrooms
    await user.click(screen.getByRole('button', { name: '3 bedrooms' }))

    // Set amenity
    const gymCheckbox = screen.getByRole('checkbox', { name: /gym/i })
    await user.click(gymCheckbox)

    // Apply filters
    await user.click(screen.getByRole('button', { name: /apply filters/i }))

    expect(mockOnFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        price: 2000,
        bedCount: 3,
        amenities: ['GYM']
      })
    )
  })

  it('changing multiple filters and clicking apply filter should show the right listings, and clicking clear all and then apply filter should show all listings', async () => {
    const user = userEvent.setup()
    render(
          <BrowserRouter>
            <FilterPopover onFiltersChange={mockOnFiltersChange} listings={mockListings} />
          </BrowserRouter>
    )

    // Open filter popover
    await user.click(screen.getByRole('button', { name: /filters/i }))

    // Set multiple filters
    await user.click(screen.getByRole('button', { name: '3 bedrooms' }))
    const poolCheckbox = screen.getByRole('checkbox', { name: /pool/i })
    await user.click(poolCheckbox)

    // Apply filters
    await user.click(screen.getByRole('button', { name: /apply filters/i }))

    // Verify filters were applied
    expect(mockOnFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        bedCount: 3,
        amenities: ['POOL']
      })
    )

    // Open filter popover again
    await user.click(screen.getByRole('button', { name: /filters/i }))

    // Click clear all
    await user.click(screen.getByRole('button', { name: /clear all/i }))

    // Apply filters
    await user.click(screen.getByRole('button', { name: /apply filters/i }))

    // Verify filters were cleared
    expect(mockOnFiltersChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        price: expect.any(Number),
        bedCount: '',
        bathCount: '',
        amenities: [],
        dateRange: undefined
      })
    )
  })
})
