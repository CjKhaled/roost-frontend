/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { listingsService } from '../services/listing'
import { type Listing } from '../types/listing'
import { AuthProvider } from '../../../context/AuthContext'
import ListingDetails from '../pages/ListingDetails'

// Mock the listings service
vi.mock('../services/listing')

// Mock the Carousel component to avoid ResizeObserver issues
vi.mock('../../../components/ui/carousel', () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselPrevious: () => null,
  CarouselNext: () => null
}))

// Mock Intersection Observer
const mockObserve = vi.fn()
const mockUnobserve = vi.fn()
const mockDisconnect = vi.fn()

vi.mock('../../../components/ui/tabs', () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsTrigger: ({ children, value }: { children: React.ReactNode; value: string }) => (
      <button role="tab" data-value={value} data-state={value === 'overview' ? 'active' : 'inactive'}>
        {children}
      </button>
  ),
  TabsContent: ({ children, value }: { children: React.ReactNode; value: string }) => (
      <div data-value={value}>{children}</div>
  )
}))

vi.mock('../../../components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>
}))

vi.mock('../../../components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) => open ? <div role="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogClose: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock CustomAdvancedMarker
vi.mock('../components/CustomAdvancedMarker', () => ({
  default: ({ listing }: { listing: any }) => <div>Marker for {listing.name}</div>
}))

// Update the Google Maps mock to include AdvancedMarker
vi.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Map: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AdvancedMarker: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock ProfileMenu
vi.mock('../components/ProfileMenu', () => ({
  default: () => <div>Profile Menu</div>
}))

beforeEach(() => {
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: mockObserve,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect
  }))
})

// Mock ResizeObserver
beforeEach(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
  }))
})

// Mock window.matchMedia for the Carousel
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  })
})

// Mock History API
beforeEach(() => {
  Object.defineProperty(window, 'history', {
    value: {
      back: vi.fn(),
      pushState: vi.fn(),
      replaceState: vi.fn(),
      go: vi.fn(),
      state: {}
    },
    writable: true
  })
})

// Mock router hooks
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ id: '123' }),
    useNavigate: () => mockNavigate
  }
})

// Mock Google Maps component
vi.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Map: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

const mockListing: Listing = {
  id: '123',
  name: 'Cozy Apartment',
  description: 'A beautiful apartment',
  price: 1500,
  address: '123 Main St',
  location: { lat: 40.7128, lng: -74.0060 },
  imageUrl: ['image1.jpg', 'image2.jpg'],
  bedCount: 2,
  bathCount: 1,
  amenities: ['WIFI', 'POOL'],
  utilities: ['WATER', 'ELECTRICITY'],
  available: {
    from: '2024-01-01',
    to: '2024-12-31'
  },
  policies: {
    strictParking: true,
    strictNoisePolicy: false,
    guestsAllowed: true,
    petsAllowed: false,
    smokingAllowed: false
  },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  listerId: 'user123'
}

const mockLister = {
  id: 'user123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  createdListings: [{ id: '123' }]
}

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

describe('Listing Details', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock the service calls
    vi.mocked(listingsService.getListingById).mockResolvedValue(mockListing)
    vi.mocked(listingsService.getUserWhoCreatedListing).mockResolvedValue(mockLister)
  })

  const renderComponent = () => {
    return render(
          <AuthProvider>
            <MemoryRouter initialEntries={[`/listings/${mockListing.id}`]}>
              <ListingDetails />
            </MemoryRouter>
          </AuthProvider>
    )
  }

  it('should render the listing details page', async () => {
    renderComponent()

    // Check loading state
    expect(screen.getByText('Loading listing details...')).toBeInTheDocument()

    // Wait for content to load
    await waitFor(() => {
      expect(screen.queryByText('Loading listing details...')).not.toBeInTheDocument()
      expect(screen.getByText('Cozy Apartment')).toBeInTheDocument()
    })
  })

  it('should load the listing before showing the page', async () => {
    renderComponent()

    await waitFor(() => {
      expect(listingsService.getListingById).toHaveBeenCalledWith('123')
      expect(listingsService.getUserWhoCreatedListing).toHaveBeenCalledWith('user123')
    })
  })

  it('should show an error if there is one', async () => {
    vi.mocked(listingsService.getListingById).mockRejectedValueOnce(new Error('Failed to fetch'))

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch listing details')).toBeInTheDocument()
    })
  })

  it('should render the correct information from the listing and the lister', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.queryByText('Loading listing details...')).not.toBeInTheDocument()
    })

    // Check basic listing info
    expect(screen.getByText('Cozy Apartment')).toBeInTheDocument()
    expect(screen.getByText('123 Main St')).toBeInTheDocument()
    expect(screen.getByText('$1500')).toBeInTheDocument()

    // Check features
    expect(screen.getByText('2 Bedrooms')).toBeInTheDocument()
    expect(screen.getByText('1 Bathrooms')).toBeInTheDocument()

    // Check utilities
    expect(screen.getByText('Water')).toBeInTheDocument()
    expect(screen.getByText('Electricity')).toBeInTheDocument()

    // Check lister info
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('should show the overview when first loaded', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.queryByText('Loading listing details...')).not.toBeInTheDocument()
    })

    const overviewTab = screen.getByRole('tab', { name: /overview/i })
    expect(overviewTab).toHaveAttribute('data-state', 'active')
    expect(screen.getByText('Property Features')).toBeInTheDocument()
  })

  it('should show the details and amenities when the badge is clicked', async () => {
    const user = userEvent.setup()
    renderComponent()

    await waitFor(() => {
      expect(screen.queryByText('Loading listing details...')).not.toBeInTheDocument()
    })

    const detailsTab = screen.getByRole('tab', { name: /details/i })
    await user.click(detailsTab)

    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('A beautiful apartment')).toBeInTheDocument()
    expect(screen.getByText('Amenities')).toBeInTheDocument()
    expect(screen.getByText('Wifi')).toBeInTheDocument()
    expect(screen.getByText('Pool')).toBeInTheDocument()
  })

  it('should show the policies when the badge is clicked', async () => {
    const user = userEvent.setup()
    renderComponent()

    await waitFor(() => {
      expect(screen.queryByText('Loading listing details...')).not.toBeInTheDocument()
    })

    const policiesTab = screen.getByRole('tab', { name: /policies/i })
    await user.click(policiesTab)

    expect(screen.getByText('Lease Policies')).toBeInTheDocument()
    expect(screen.getByText('Strict parking policy')).toBeInTheDocument()
    expect(screen.getByText('No pets allowed')).toBeInTheDocument()
    expect(screen.getByText('No smoking')).toBeInTheDocument()
  })

  it('should open the image modal when the image is clicked', async () => {
    const user = userEvent.setup()
    renderComponent()

    await waitFor(() => {
      expect(screen.queryByText('Loading listing details...')).not.toBeInTheDocument()
    })

    const firstImage = screen.getByAltText('Cozy Apartment - Image 1')
    await user.click(firstImage)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should navigate back when the back button is clicked', async () => {
    const user = userEvent.setup()
    renderComponent()

    await waitFor(() => {
      expect(screen.queryByText('Loading listing details...')).not.toBeInTheDocument()
    })

    const backButton = screen.getByTestId('back-to-listings-button')
    await user.click(backButton)

    expect(window.history.back).toHaveBeenCalled()
  })

  it('should toggle favorite status when the save button is clicked', async () => {
    const user = userEvent.setup()
    renderComponent()

    await waitFor(() => {
      expect(screen.queryByText('Loading listing details...')).not.toBeInTheDocument()
    })

    const saveButton = screen.getByTestId('save-button')
    await user.click(saveButton)

    expect(screen.getByTestId('save-button')).toHaveTextContent('Saved')

    await user.click(saveButton)
    expect(screen.getByTestId('save-button')).toHaveTextContent('Save')
  })
})
