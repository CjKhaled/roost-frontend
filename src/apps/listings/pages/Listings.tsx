import { useState, useEffect, useRef } from 'react'
import {
  Search,
  Leaf
} from 'lucide-react'
import { Input } from '../../../components/ui/input'

import { APIProvider, Map } from '@vis.gl/react-google-maps'
import FilterPopover from '../components/FilterPopover'
import { type DateRange } from 'react-day-picker'
import ListingCard from '../components/ListingCard'
import ProfileMenu from '../components/ProfileMenu'
import { type Listing, type AmenityType } from '../types/listing'
import { listingsService } from '../services/listing'
import CustomAdvancedMarker from '../components/CustomAdvancedMarker'

interface FilterState {
  price: number
  bedCount: number | ''
  bathCount: number | ''
  amenities: AmenityType[]
  dateRange: DateRange | undefined
}

const Listings = (): JSX.Element => {
  const MAPS_API_KEY: string = import.meta.env.VITE_MAPS_API_KEY
  const GAINESVILLE_CENTER = { lat: 29.6516, lng: -82.3248 }
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedListing, setSelectedListing] = useState<string | null>(null)
  const listingsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await listingsService.getListings()
        setListings(data)
        setFilteredListings(data)
      } catch (err) {
        setError('Failed to fetch listings')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchListings()
  }, [])

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

  const handleFiltersChange = (newFilters: FilterState) => {
    const filtered = listings.filter(listing => {
      const priceMatch = listing.price <= newFilters.price
      const bedroomsMatch = !newFilters.bedCount || listing.bedCount === newFilters.bedCount
      const bathroomsMatch = !newFilters.bathCount || listing.bathCount === newFilters.bathCount
      const amenitiesMatch = newFilters.amenities.length === 0 ||
        newFilters.amenities.every(amenity => listing.amenities.includes(amenity))

      const dateMatch = !newFilters.dateRange || true // Implement date logic here

      return priceMatch && bedroomsMatch && bathroomsMatch && amenitiesMatch && dateMatch
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

            {/* Search and Controls Section */}
            <div className='flex-1 flex gap-4 items-center'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                <Input
                  placeholder='Search by location, price, or amenities...'
                  className='pl-10 border-amber-200 focus:border-amber-500'
                />
              </div>
              <FilterPopover onFiltersChange={handleFiltersChange} listings={listings} />
              <ProfileMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Split View */}
      <div className='flex-1 flex overflow-hidden'>
        {/* Listings Panel */}
        <div className='w-1/4 overflow-y-auto p-6 border-r' ref={listingsRef}>
          <div className='grid grid-cols-1 gap-6'>
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} isSelected={selectedListing === listing.id} onClick={() => { handleListingClick(listing) }} />
            ))}
          </div>
        </div>

        {/* Map Panel */}
        <div className='w-3/4 bg-amber-50'>
          <div className='h-full flex items-center justify-center text-amber-700'>
            <APIProvider apiKey={MAPS_API_KEY} libraries={['marker']}>
              <Map mapId='a595f3d0fe04f9cf' defaultZoom={13} defaultCenter={GAINESVILLE_CENTER} disableDefaultUI={true} gestureHandling={'greedy'}>
              {filteredListings.map((listing) => (
                  <CustomAdvancedMarker listing={listing} />
              ))}
              </Map>
            </APIProvider>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Listings
