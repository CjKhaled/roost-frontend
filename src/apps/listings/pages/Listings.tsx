import { useState } from 'react'
import {
  Search,
  Leaf
} from 'lucide-react'
import { Input } from '../../../components/ui/input'

import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps'
import FilterPopover from '../components/FilterPopover'
import { type DateRange } from 'react-day-picker'
import ListingCard from '../components/ListingCard'
import ProfileMenu from '../components/ProfileMenu'

const listings = [
  {
    id: 1,
    title: 'Cozy Studio near Campus',
    address: '123 College Ave',
    location: { lat: 29.6436, lng: -82.3549 },
    price: 800,
    availableFrom: 'Aug 1 - Jul 31',
    imageUrl: 'https://www.decorilla.com/online-decorating/wp-content/uploads/2020/07/Sleek-and-transitional-modern-apartment-design-scaled.jpg',
    amenities: ['WiFi', 'Furnished', 'Utilities Included'],
    type: 'Studio',
    bedrooms: 0,
    bathrooms: 1
  },
  {
    id: 2,
    title: 'Modern 2BR with City View',
    address: '456 University Dr',
    location: { lat: 29.6516, lng: -82.3248 },
    price: 1200,
    availableFrom: 'Aug 1 - Jul 31',
    imageUrl: 'https://www.decorilla.com/online-decorating/wp-content/uploads/2020/07/Sleek-and-transitional-modern-apartment-design-scaled.jpg',
    amenities: ['Parking', 'Laundry', 'Dishwasher'],
    type: '2 Bedroom',
    bedrooms: 2,
    bathrooms: 2
  },
  {
    id: 3,
    title: 'Luxury 1BR Downtown',
    address: '789 Main St',
    location: { lat: 29.6552, lng: -82.3357 },
    price: 1500,
    availableFrom: 'Aug 1 - Jul 31',
    imageUrl: 'https://www.decorilla.com/online-decorating/wp-content/uploads/2020/07/Sleek-and-transitional-modern-apartment-design-scaled.jpg',
    amenities: ['Gym', 'Pool', 'Pet Friendly', 'Parking'],
    type: '1 Bedroom',
    bedrooms: 1,
    bathrooms: 1
  },
  {
    id: 4,
    title: 'Student Housing Special',
    address: '321 Dorm Lane',
    location: { lat: 29.6486, lng: -82.3431 },
    price: 650,
    availableFrom: 'Aug 1 - Jul 31',
    imageUrl: 'https://www.decorilla.com/online-decorating/wp-content/uploads/2020/07/Sleek-and-transitional-modern-apartment-design-scaled.jpg',
    amenities: ['Study Room', 'Meal Plan', 'WiFi'],
    type: 'Studio',
    bedrooms: 1,
    bathrooms: 1
  }
]

interface FilterState {
  price: number
  bedrooms: number | ''
  bathrooms: number | ''
  amenities: string[]
  dateRange: DateRange | undefined
}

const Listings = (): JSX.Element => {
  const MAPS_API_KEY: string = import.meta.env.VITE_MAPS_API_KEY
  const GAINESVILLE_CENTER = { lat: 29.6516, lng: -82.3248 }
  const [filteredListings, setFilteredListings] = useState(listings)

  const handleFiltersChange = (newFilters: FilterState) => {
    const filtered = listings.filter(listing => {
      const priceMatch = listing.price <= newFilters.price
      const bedroomsMatch = !newFilters.bedrooms || listing.bedrooms === newFilters.bedrooms
      const bathroomsMatch = !newFilters.bathrooms || listing.bathrooms === newFilters.bathrooms
      const amenitiesMatch = newFilters.amenities.length === 0 ||
        newFilters.amenities.every(amenity => listing.amenities.includes(amenity))

      const dateMatch = !newFilters.dateRange || true // Implement your date logic here

      return priceMatch && bedroomsMatch && bathroomsMatch && amenitiesMatch && dateMatch
    })

    setFilteredListings(filtered)
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
        <div className='w-1/4 overflow-y-auto p-6 border-r'>
          <div className='grid grid-cols-1 gap-6'>
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>

        {/* Map Panel */}
        <div className='w-3/4 bg-amber-50'>
          <div className='h-full flex items-center justify-center text-amber-700'>
            <APIProvider apiKey={MAPS_API_KEY}>
              <Map mapId='a595f3d0fe04f9cf' defaultZoom={13} defaultCenter={GAINESVILLE_CENTER}>
                {filteredListings.map((listing) => (
                  <AdvancedMarker key={listing.id} position={listing.location}>
                    <Pin background='#b45309' />
                  </AdvancedMarker>
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
