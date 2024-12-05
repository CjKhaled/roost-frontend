import { useState, useEffect, useRef } from 'react'
import {
  Leaf
} from 'lucide-react'
import { APIProvider, Map } from '@vis.gl/react-google-maps'
import FilterPopover from '../components/FilterPopover'
import { type DateRange } from 'react-day-picker'
import ListingCard from '../components/ListingCard'
import ProfileMenu from '../components/ProfileMenu'
import { type Listing, type AmenityType } from '../types/listing'
import { listingsService } from '../services/listing'
import MapContent from '../components/MapContent'
import { useLocation } from 'react-router-dom'
import MapsCityAutocomplete from '../components/MapsCityAutocomplete'

interface FilterState {
  price: number
  bedCount: number | ''
  bathCount: number | ''
  amenities: AmenityType[]
  dateRange: DateRange | undefined
}

interface LocationState {
  city: string
  coordinates: {
    lat: number
    lng: number
  }
}

const Listings = (): JSX.Element => {
  const MAPS_API_KEY: string = import.meta.env.VITE_MAPS_API_KEY
  const location = useLocation()
  const locationState = location.state as LocationState | null
  const DEFAULT_CENTER = { lat: 29.6516, lng: -82.3248 }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mapCenter, setMapCenter] = useState(
    locationState?.coordinates ?? DEFAULT_CENTER
  )
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedListing, setSelectedListing] = useState<string | null>(null)
  const listingsRef = useRef<HTMLDivElement>(null)
  const [selectedCity, setSelectedCity] = useState(locationState?.city ?? 'Gainesville, FL')

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true)
        const data = await listingsService.getListings()
        setListings(data)

        // Filter listings by city if one is selected
        if (selectedCity) {
          const cityFilteredListings = data.filter(
            listing => listing.city.toLowerCase() === selectedCity.toLowerCase()
          )
          setFilteredListings(cityFilteredListings)
        } else {
          setFilteredListings(data)
        }
      } catch (err) {
        setError('Failed to fetch listings')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchListings()
  }, [selectedCity])

  // when a user clicks anything besides a listing card, deselect
  useEffect(() => {
    const handleDeselectListing = (event: MouseEvent) => {
      const isOutsideListing = !(event.target as Element).closest('[data-listing-card]')
      if (isOutsideListing) {
        setSelectedListing(null)
      }
    }

    document.addEventListener('click', handleDeselectListing)

    return () => {
      document.removeEventListener('click', handleDeselectListing)
    }
  }, [])

  // a user can also deselct a listing by clicking it again
  const handleListingClick = (listing: Listing) => {
    if (selectedListing === listing.id) {
      setSelectedListing(null)
    } else {
      setSelectedListing(listing.id)
    }
  }

  const handleCitySelect = (cityState: string, lat?: number, lng?: number) => {
    setSelectedCity(cityState)
    if (lat && lng) {
      setMapCenter({ lat, lng })
    }
  }

  const handleFiltersChange = (newFilters: FilterState) => {
    const filtered = listings.filter(listing => {
      const priceMatch = listing.price <= newFilters.price
      const bedroomsMatch = !newFilters.bedCount || listing.bedCount === newFilters.bedCount
      const bathroomsMatch = !newFilters.bathCount || listing.bathCount === newFilters.bathCount
      const amenitiesMatch = newFilters.amenities.length === 0 ||
        newFilters.amenities.every(amenity => listing.amenities.includes(amenity))

      let dateMatch = true
      if (newFilters.dateRange?.from && newFilters.dateRange?.to) {
        const listingFrom = new Date(listing.available.from)
        const listingTo = new Date(listing.available.to)

        const selectedFrom = new Date(newFilters.dateRange.from)
        const selectedTo = new Date(newFilters.dateRange.to)

        dateMatch = listingFrom <= selectedTo && listingTo >= selectedFrom
      }

      const shouldInclude = priceMatch && bedroomsMatch && bathroomsMatch && amenitiesMatch && dateMatch
      return shouldInclude
    })

    setFilteredListings(filtered)
  }

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50'>
        <div className='text-amber-600'>Loading listings...</div>
      </div>
    )
  }

  if (error !== null) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50'>
        <div className='text-red-600'>{error}</div>
      </div>
    )
  }

  return (
    <div className='h-screen flex flex-col bg-gradient-to-br from-orange-100 to-amber-50'>
      {/* Header */}
      <div className='p-4 border-b bg-white/50 backdrop-blur-sm'>
        <div className='max-w-[1920px] mx-auto'>
          <div className='flex items-center justify-between gap-8'>
            {/* Logo Section */}
            <div className='flex items-center gap-3 min-w-fit'>
              <Leaf className='h-8 w-8 text-amber-600' />
              <span className='text-3xl font-bold text-amber-900'>Roost</span>
            </div>

            {/* Search bar section */}
            <div className='flex-1 flex gap-4 items-center'>
              <div className='relative flex-1'>
                <MapsCityAutocomplete
                  onSelect={handleCitySelect}
                  initialValue={selectedCity}
                />
              </div>
              <FilterPopover onFiltersChange={handleFiltersChange} listings={listings} />
              <ProfileMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Split View - This creates the parent stacking context */}
      <div className='flex-1 flex overflow-hidden relative'>
        {/* Listings Panel */}
        <div className='w-1/4 overflow-y-auto p-6 border-r' ref={listingsRef}>
          {filteredListings.length > 0
            ? (
            <div className='grid grid-cols-1 gap-6'>
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isSelected={selectedListing === listing.id}
                  onClick={() => { handleListingClick(listing) }}
                />
              ))}
            </div>
              )
            : (
            <div className="flex items-center justify-center h-full text-amber-700">
              No listings found
            </div>
              )}
        </div>

        {/* Map Panel - Give this a lower z-index */}
        <div className='w-3/4 bg-amber-50'>
          <div className='h-full flex items-center justify-center text-amber-700'>
            <APIProvider apiKey={MAPS_API_KEY} libraries={['marker', 'places']}>
              <Map mapId='a595f3d0fe04f9cf' defaultZoom={13} defaultCenter={mapCenter} disableDefaultUI={true} gestureHandling={'greedy'}>
                <MapContent filteredListings={filteredListings} selectedListing={selectedListing} />
              </Map>
            </APIProvider>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Listings
