import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { type Listing } from '../types/listing'
import CustomAdvancedMarker from '../components/CustomAdvancedMarker'

// Mock DOM globals
class MockResizeObserver {
  observe () {}
  unobserve () {}
  disconnect () {}
}

global.ResizeObserver = MockResizeObserver
global.HTMLElement.prototype.scrollIntoView = vi.fn()
global.HTMLElement.prototype.hasPointerCapture = vi.fn()
global.HTMLElement.prototype.releasePointerCapture = vi.fn()

// Mock the Google Maps AdvancedMarker component
vi.mock('@vis.gl/react-google-maps', () => ({
  AdvancedMarker: ({ children, onMouseEnter, onMouseLeave }: {
    children: React.ReactNode
    onMouseEnter: () => void
    onMouseLeave: () => void
  }) => (
    <div
      data-testid="mock-advanced-marker"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  )
}))

describe('Custom Advanced Marker', () => {
  const mockListing: Listing = {
    id: '1',
    name: 'Test Listing',
    address: '123 Test St',
    description: 'A test listing',
    price: 1000,
    bedCount: 2,
    bathCount: 1,
    imageUrl: ['test-image.jpg'],
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
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    listerId: 'user1'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the marker', () => {
    render(
      <BrowserRouter>
        <CustomAdvancedMarker listing={mockListing} />
      </BrowserRouter>
    )

    expect(screen.getByTestId('mock-advanced-marker')).toBeInTheDocument()
    expect(screen.getByTestId('marker-pin')).toHaveClass('w-9')
    expect(screen.getByTestId('marker-pin')).not.toHaveClass('w-20')
    expect(screen.getByRole('img')).toHaveAttribute('src', 'test-image.jpg')
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test Listing')
  })

  it('should add a style when hovered', () => {
    render(
      <BrowserRouter>
        <CustomAdvancedMarker listing={mockListing} />
      </BrowserRouter>
    )

    const marker = screen.getByTestId('mock-advanced-marker')
    const pin = screen.getByTestId('marker-pin')

    expect(pin).toHaveClass('w-9')

    fireEvent.mouseEnter(marker)
    expect(pin).toHaveClass('w-20')

    fireEvent.mouseLeave(marker)
    expect(pin).toHaveClass('w-9')
  })

  it('should add a style when selected', () => {
    render(
      <BrowserRouter>
        <CustomAdvancedMarker listing={mockListing} isSelected={true} />
      </BrowserRouter>
    )

    expect(screen.getByTestId('marker-pin')).toHaveClass('w-20')
  })

  it('should show the listing image and hide icon when expanded', () => {
    render(
      <BrowserRouter>
        <CustomAdvancedMarker listing={mockListing} isSelected={true} />
      </BrowserRouter>
    )

    expect(screen.getByTestId('image-container')).toHaveClass('opacity-100')
    expect(screen.getByTestId('icon-container')).toHaveClass('opacity-0')
  })

  it('should maintain expanded style when both selected and hovered', () => {
    render(
      <BrowserRouter>
        <CustomAdvancedMarker listing={mockListing} isSelected={true} />
      </BrowserRouter>
    )

    const marker = screen.getByTestId('mock-advanced-marker')
    const pin = screen.getByTestId('marker-pin')

    expect(pin).toHaveClass('w-20')

    fireEvent.mouseEnter(marker)
    expect(pin).toHaveClass('w-20')

    fireEvent.mouseLeave(marker)
    expect(pin).toHaveClass('w-20')
  })
})
