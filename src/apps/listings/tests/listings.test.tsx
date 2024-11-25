/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Listings from '../pages/Listings'
import { listingsService } from '../services/listing'
import { type Listing } from '../types/listing'
import { AuthProvider } from '../../../context/AuthContext'

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

const mockBounds = {
  contains: vi.fn(() => true),
  extend: vi.fn(),
  getNorthEast: vi.fn(() => ({ lat: () => 30, lng: () => -82 })),
  getSouthWest: vi.fn(() => ({ lat: () => 29, lng: () => -83 }))
}

const mockMap = {
  panTo: vi.fn(),
  setZoom: vi.fn(),
  setCenter: vi.fn(),
  getBounds: vi.fn(() => mockBounds),
  getCenter: vi.fn(() => ({ lat: () => 29.6516, lng: () => -82.3248 })),
  getZoom: vi.fn(() => 13)
}

// Mock the Google Maps components and hooks
vi.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Map: ({ children }: { children: React.ReactNode }) => <div data-testid="map">{children}</div>,
  useMap: () => mockMap,
  AdvancedMarker: ({ children, position }: { children: React.ReactNode; position: any }) => (
      <div data-testid="marker" data-position={JSON.stringify(position)}>{children}</div>
  ),
  InfoWindow: ({ children }: { children: React.ReactNode }) => <div data-testid="info-window">{children}</div>
}))

const mockAuthContext = {
  isAuthenticated: true,
  user: {
    id: 'test-user',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User'
  },
  login: vi.fn(),
  logout: vi.fn(),
  signup: vi.fn()
}

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

describe('Listings Page', () => {
  const mockListings: Listing[] = [
    {
      id: '1',
      name: 'Test Listing 1',
      address: '123 Test St',
      price: 1000,
      bedCount: 2,
      bathCount: 1,
      description: 'A nice place',
      imageUrl: ['test1.jpg'],
      location: { lat: 29.6516, lng: -82.3248 },
      available: { from: '2024-01-01', to: '2024-12-31' },
      amenities: ['WIFI', 'PARKING'],
      utilities: ['WATER', 'ELECTRICITY'],
      policies: {
        strictParking: true,
        strictNoisePolicy: false,
        guestsAllowed: true,
        petsAllowed: false,
        smokingAllowed: false
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      listerId: 'user1'
    },
    {
      id: '2',
      name: 'Test Listing 2',
      address: '456 Test Ave',
      price: 1500,
      bedCount: 3,
      bathCount: 2,
      description: 'Another nice place',
      imageUrl: ['test2.jpg'],
      location: { lat: 29.6517, lng: -82.3249 },
      available: { from: '2024-02-01', to: '2024-12-31' },
      amenities: ['WIFI', 'GYM'],
      utilities: ['WATER', 'GAS'],
      policies: {
        strictParking: false,
        strictNoisePolicy: true,
        guestsAllowed: true,
        petsAllowed: true,
        smokingAllowed: false
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      listerId: 'user2'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    // Clear ResizeObserver mocks
    mockObserve.mockClear()
    mockUnobserve.mockClear()
    mockDisconnect.mockClear()
    // Default successful response
    vi.mocked(listingsService.getListings).mockResolvedValue(mockListings)
  })

  it('should render the listings page', async () => {
    render(
      <AuthProvider>
          <BrowserRouter>
                <Listings />
            </BrowserRouter>
        </AuthProvider>
    )

    // Check for loading state
    expect(screen.getByText('Loading listings...')).toBeInTheDocument()

    // Wait for listings to load
    await waitFor(() => {
      expect(screen.queryByText('Loading listings...')).not.toBeInTheDocument()
    })

    // Check if main components are rendered
    expect(screen.getByPlaceholderText('Search by location')).toBeInTheDocument()
    expect(screen.getByTestId('map')).toBeInTheDocument()
    expect(screen.getByText('Test Listing 1')).toBeInTheDocument()
    expect(screen.getByText('Test Listing 2')).toBeInTheDocument()
  })

  it('should load listings before showing the page', async () => {
    render(
        <AuthProvider>
            <BrowserRouter>
                <Listings />
            </BrowserRouter>
        </AuthProvider>
    )

    // Verify loading state is shown
    expect(screen.getByText('Loading listings...')).toBeInTheDocument()

    // Verify service was called
    expect(listingsService.getListings).toHaveBeenCalledTimes(1)

    // Wait for content to load
    await waitFor(() => {
      expect(screen.getByText('Test Listing 1')).toBeInTheDocument()
      expect(screen.getByText('Test Listing 2')).toBeInTheDocument()
    })
  })

  it('should show an error if there is one', async () => {
    const errorMessage = 'Failed to fetch listings'
    vi.mocked(listingsService.getListings).mockRejectedValueOnce(new Error(errorMessage))

    render(
        <AuthProvider>
            <BrowserRouter>
                <Listings />
            </BrowserRouter>
        </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('should only render filtered listings', async () => {
    render(
        <AuthProvider>
            <BrowserRouter>
                <Listings />
            </BrowserRouter>
        </AuthProvider>
    )

    const user = userEvent.setup()

    await waitFor(() => {
      expect(screen.getByText('Test Listing 1')).toBeInTheDocument()
      expect(screen.getByText('Test Listing 2')).toBeInTheDocument()
    })

    // Open filter popover
    const filterButton = screen.getByRole('button', { name: /filters/i })
    await user.click(filterButton)

    // Find the bedrooms label and then the "2" button within that section
    const bedroomsLabel = screen.getByText('Bedrooms')
    const bedroomsSection = bedroomsLabel.parentElement
    const twoBedButton = bedroomsSection?.querySelector('button[aria-label="2 bedrooms"]') ??
                        bedroomsSection?.querySelector('button:nth-of-type(2)') // Fallback

    expect(twoBedButton).toBeInTheDocument()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await user.click(twoBedButton!)

    // Apply filters
    const applyButton = screen.getByRole('button', { name: /apply filters/i })
    await user.click(applyButton)

    // Check filtered results
    await waitFor(() => {
      expect(screen.getByText('Test Listing 1')).toBeInTheDocument()
      expect(screen.queryByText('Test Listing 2')).not.toBeInTheDocument()
    })
  })

  it('clicking on a listing should select it', async () => {
    render(
        <AuthProvider>
            <BrowserRouter>
                <Listings />
            </BrowserRouter>
        </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Listing 1')).toBeInTheDocument()
    })

    const listingCard = screen.getByText('Test Listing 1').closest('[data-listing-card]')
    expect(listingCard).toBeInTheDocument()

    // Click the listing
    if (listingCard) {
      fireEvent.click(listingCard)
      expect(listingCard).toHaveClass('ring-2')
      expect(listingCard).toHaveClass('ring-amber-500')
    }
  })

  it('clicking on a selected listing should deselect it', async () => {
    render(
        <AuthProvider>
            <BrowserRouter>
                <Listings />
            </BrowserRouter>
        </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Listing 1')).toBeInTheDocument()
    })

    const listingCard = screen.getByText('Test Listing 1').closest('[data-listing-card]')
    expect(listingCard).toBeInTheDocument()

    if (listingCard) {
      // Select the listing
      fireEvent.click(listingCard)
      expect(listingCard).toHaveClass('ring-2')

      // Deselect the listing
      fireEvent.click(listingCard)
      expect(listingCard).not.toHaveClass('ring-2')
    }
  })

  it('when a listing is selected, clicking anywhere else should deselect it', async () => {
    render(
        <AuthProvider>
            <BrowserRouter>
                <Listings />
            </BrowserRouter>
        </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Listing 1')).toBeInTheDocument()
    })

    const listingCard = screen.getByText('Test Listing 1').closest('[data-listing-card]')
    expect(listingCard).toBeInTheDocument()

    if (listingCard) {
      // Select the listing
      fireEvent.click(listingCard)
      expect(listingCard).toHaveClass('ring-2')

      // Click outside (on the map)
      const map = screen.getByTestId('map')
      fireEvent.click(map)

      // Verify listing is deselected
      expect(listingCard).not.toHaveClass('ring-2')
    }
  })
})
