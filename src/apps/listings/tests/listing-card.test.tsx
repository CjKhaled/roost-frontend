import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import ListingCard from '../components/ListingCard'
import { type Listing } from '../types/listing'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

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

describe('Listing Card', () => {
  const mockListing: Listing = {
    id: '1',
    name: 'Test Listing',
    address: '123 Test St',
    description: 'A test listing',
    price: 1000,
    bedCount: 2,
    bathCount: 1,
    imageUrl: ['test1.jpg'],
    location: { lat: 29.6516, lng: -82.3248 },
    available: {
      from: '2023-12-01T05:00:00.000Z',
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
    listerId: 'user1',
    favoritedByIds: []
  }

  const mockOnClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render listing card', () => {
    render(
      <BrowserRouter>
        <ListingCard listing={mockListing} />
      </BrowserRouter>
    )

    expect(screen.getByText('Test Listing')).toBeInTheDocument()
    expect(screen.getByText('123 Test St')).toBeInTheDocument()
    expect(screen.getByText('$1000/mo')).toBeInTheDocument()
  })

  it('should show correct information for listing', () => {
    render(
      <BrowserRouter>
        <ListingCard listing={mockListing} />
      </BrowserRouter>
    )

    expect(screen.getByText('2 bed')).toBeInTheDocument()
    expect(screen.getByText('1 bath')).toBeInTheDocument()
    expect(screen.getByAltText('Test Listing')).toHaveAttribute('src', 'test1.jpg')
    mockListing.amenities.forEach(amenity => {
      const formattedAmenity = amenity.toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      expect(screen.getByText(formattedAmenity)).toBeInTheDocument()
    })
  })

  it('should be styled when hovered', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <ListingCard listing={mockListing} />
      </BrowserRouter>
    )

    const card = screen.getByTestId('listing-card')
    await user.hover(card)
    expect(card).toHaveClass('ring-2')
    expect(card).toHaveClass('ring-amber-500')

    await user.unhover(card)
    expect(card).not.toHaveClass('ring-2')
    expect(card).not.toHaveClass('ring-amber-500')
  })

  it('should be styled when selected', () => {
    render(
      <BrowserRouter>
        <ListingCard listing={mockListing} isSelected={true} />
      </BrowserRouter>
    )

    const card = screen.getByTestId('listing-card')
    expect(card).toHaveClass('ring-2')
    expect(card).toHaveClass('ring-amber-500')
    expect(card).toHaveClass('shadow-lg')
    expect(card).toHaveClass('transform')
    expect(card).toHaveClass('scale-[1.02]')
  })

  it('favorite button should favorite the listing', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <ListingCard listing={mockListing} />
      </BrowserRouter>
    )

    const favoriteButton = screen.getByRole('button', { name: /favorite/i })
    const heartIcon = favoriteButton.querySelector('svg')

    // Initially not favorited
    expect(heartIcon).toHaveClass('stroke-gray-600')
    expect(heartIcon).not.toHaveClass('fill-red-500')

    // Click to favorite
    await user.click(favoriteButton)
    expect(heartIcon).toHaveClass('lucide lucide-heart h-5 w-5 stroke-gray-600')
    expect(heartIcon).toHaveClass('lucide lucide-heart h-5 w-5 stroke-gray-600')

    // Click to unfavorite
    await user.click(favoriteButton)
    expect(heartIcon).not.toHaveClass('fill-red-500')
    expect(heartIcon).toHaveClass('stroke-gray-600')
  })

  it('should format the date correctly', () => {
    render(
      <BrowserRouter>
        <ListingCard listing={mockListing} />
      </BrowserRouter>
    )

    const dateContainer = screen.getByTestId('date-range')
    expect(dateContainer).toHaveTextContent('Dec 2023 - Dec 2024')
  })

  it('should format the amenity label correctly', () => {
    render(
      <BrowserRouter>
        <ListingCard listing={mockListing} />
      </BrowserRouter>
    )

    expect(screen.getByText('Wifi')).toBeInTheDocument()
    expect(screen.getByText('Parking')).toBeInTheDocument()
  })

  it('should navigate to the listing when view details is clicked', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <ListingCard listing={mockListing} onClick={mockOnClick} />
      </BrowserRouter>
    )

    const viewDetailsButton = screen.getByText('View Details')
    await user.click(viewDetailsButton)

    expect(mockNavigate).toHaveBeenCalledWith('/listings/1')
  })

  it('clicking favorite button should not select or deselect the listing', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <ListingCard listing={mockListing} onClick={mockOnClick} />
      </BrowserRouter>
    )

    const favoriteButton = screen.getByRole('button', { name: /favorite/i })
    await user.click(favoriteButton)

    expect(mockOnClick).not.toHaveBeenCalled()
  })
})
