import { useState } from 'react'
import {
  MapPin,
  Calendar as CalendarIcon,
  Search,
  Bed,
  Bath,
  Filter,
  Heart,
  User,
  MessageSquare,
  Settings,
  Leaf,
  House
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardFooter } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../components/ui/dropdown-menu'
import { type Listing } from '../types/listing'
import { Slider } from '../../../components/ui/slider'
import { Label } from '../../../components/ui/label'
import { Checkbox } from '../../../components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../components/ui/popover'
import { format } from 'date-fns'
import { type DateRange } from 'react-day-picker'
import { Calendar as CalendarComponent } from '../../../components/ui/calendar'
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps'
import { cn } from '../../../lib/utils'

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

interface FilterPopoverProps {
  onFiltersChange: (filters: FilterState) => void
  listings: Listing[]
}

const FilterPopover = ({ onFiltersChange, listings }: FilterPopoverProps): JSX.Element => {
  const calculatePriceRange = (listings: Listing[]): [number, number] => {
    const prices = listings.map(l => l.price)
    const minPrice = Math.floor(Math.min(...prices) / 100) * 100
    const maxPrice = Math.ceil(Math.max(...prices) / 1000) * 1000
    return [minPrice, maxPrice]
  }

  const [minPrice, maxPrice] = calculatePriceRange(listings)

  const [filters, setFilters] = useState<FilterState>({
    price: maxPrice,
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    dateRange: undefined
  })

  const allAmenities: string[] = [...new Set(listings.flatMap(listing => listing.amenities))]

  const handleFilterChange = (key: keyof FilterState, value: FilterState[keyof FilterState]): void => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = (): void => {
    const resetFilters: FilterState = {
      price: maxPrice,
      bedrooms: '',
      bathrooms: '',
      amenities: [],
      dateRange: undefined
    }
    setFilters(resetFilters)
    onFiltersChange(resetFilters)
  }

  const formatDate = (date: Date | undefined): string => {
    if (!date) return ''
    return format(date, 'LLL dd, y')
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='h-9 px-3 roost-button flex items-center gap-2 hover:bg-amber-50'
        >
          <Filter className='h-4 w-4' />
          <span className='text-sm font-medium'>Filters</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80 p-4' align='start'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h4 className='font-semibold text-amber-900'>Filters</h4>
            <Button
              variant='ghost'
              size='sm'
              onClick={clearFilters}
              className='h-8 px-2 text-sm text-amber-600 hover:text-amber-700 hover:bg-amber-50'
            >
              Clear all
            </Button>
          </div>

          {/* Price Range */}
          <div className='space-y-2'>
            <Label className='text-amber-900'>Maximum Price</Label>
            <div className='pt-2'>
              <Slider
                value={[filters.price]}
                min={minPrice}
                max={maxPrice}
                step={100}
                onValueChange={(value) => {
                  handleFilterChange('price', value[0])
                }}
                className='[&_[role=slider]]:bg-amber-600'
              />
            </div>
            <div className='flex items-center justify-between text-sm text-amber-700'>
              <span>Up to ${filters.price}</span>
            </div>
          </div>

          {/* Bedrooms */}
          <div className='space-y-2'>
            <Label className='text-amber-900'>Bedrooms</Label>
            <div className='flex gap-2'>
              {[1, 2, 3, 4].map((num) => (
                <Button
                  key={num}
                  variant='outline'
                  size='sm'
                  className={`flex-1 ${
                      filters.bedrooms === num
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'hover:bg-amber-50 border-amber-200'
                    }`}
                  onClick={() => { handleFilterChange('bedrooms', filters.bedrooms === num ? '' : num) }}
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div className='space-y-2'>
            <Label className='text-amber-900'>Bathrooms</Label>
            <div className='flex gap-2'>
              {[1, 2, 3].map((num) => (
                <Button
                  key={num}
                  variant='outline'
                  size='sm'
                  className={`flex-1 ${
                      filters.bathrooms === num
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'hover:bg-amber-50 border-amber-200'
                    }`}
                  onClick={() => { handleFilterChange('bathrooms', filters.bathrooms === num ? '' : num) }}
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className='space-y-2'>
            <Label className='text-amber-900'>Amenities</Label>
            <div className='grid grid-cols-2 gap-2'>
              {[...allAmenities].map((amenity) => (
                <div key={amenity} className='flex items-center space-x-2'>
                  <Checkbox
                    id={amenity}
                    checked={filters.amenities.includes(amenity)}
                    onCheckedChange={(checked: boolean | 'indeterminate') => {
                      if (typeof checked === 'boolean') {
                        handleFilterChange('amenities',
                          checked
                            ? [...filters.amenities, amenity]
                            : filters.amenities.filter(a => a !== amenity)
                        )
                      }
                    }}
                    className='border-amber-200 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600'
                  />
                  <label
                    htmlFor={amenity}
                    className='text-sm text-amber-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className='space-y-2'>
              <Label className='text-amber-900'>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn(
                      'w-full justify-start text-left font-normal border-amber-200 hover:bg-amber-50',
                      !filters.dateRange && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                      {filters.dateRange?.from
                        ? (
                            filters.dateRange.to
                              ? (
                          <>
                            {formatDate(filters.dateRange.from as Date | undefined)} -
                            {' '}
                            {formatDate(filters.dateRange.to as Date | undefined)}
                          </>
                                )
                              : (
                                  formatDate(filters.dateRange.from as Date | undefined)
                                )
                          )
                        : (
                        <span>Select date range</span>
                          )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <CalendarComponent
                    initialFocus
                    mode='range'
                    defaultMonth={filters.dateRange?.from}
                    selected={filters.dateRange}
                    onSelect={(dateRange) => {
                      handleFilterChange('dateRange', dateRange)
                    }}
                    numberOfMonths={2}
                    className='rounded-md border border-amber-200'
                  />
                </PopoverContent>
              </Popover>
            </div>

          {/* Apply Filters Button */}
          <Button
            className='w-full bg-amber-600 hover:bg-amber-700 text-white'
            onClick={() => { onFiltersChange(filters) }}
          >
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface ListingCardProps {
  listing: Listing
}

const ListingCard = ({ listing }: ListingCardProps): JSX.Element => {
  const [favorites, setFavorites] = useState(new Set())
  const [hoveredListing, setHoveredListing] = useState(0)
  const toggleFavorite = (id: number): void => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(id)) {
        newFavorites.delete(id)
      } else {
        newFavorites.add(id)
      }
      return newFavorites
    })
  }
  return (

    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-200 ${
        hoveredListing === listing.id ? 'ring-2 ring-amber-500' : ''
      }`}
      onMouseEnter={() => { setHoveredListing(listing.id) }}
      onMouseLeave={() => { setHoveredListing(0) }}
    >
      <CardHeader className='p-0 relative'>
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className='w-full h-48 object-cover'
        />
        <div className='absolute top-4 right-4 flex gap-2'>
          <Badge className='bg-white/90 text-amber-900 font-medium'>
            ${listing.price}/mo
          </Badge>
          <button
            onClick={(e) => {
              e.preventDefault()
              toggleFavorite(listing.id)
            }}
            className='p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors'
          >
            <Heart
              className={`h-5 w-5 ${
                favorites.has(listing.id)
                  ? 'fill-red-500 stroke-red-500'
                  : 'stroke-gray-600'
              }`}
            />
          </button>
        </div>
      </CardHeader>

      <CardContent className='p-4'>
        <div className='mb-3'>
          <h3 className='text-lg font-semibold text-amber-900'>{listing.title}</h3>
          <div className='flex items-center text-amber-700 gap-2 text-sm'>
            <MapPin className='h-4 w-4' />
            {listing.address}
          </div>
        </div>

        <div className='flex items-center gap-4 text-sm text-amber-700 mb-3'>
          <span className='flex items-center gap-1'>
            <Bed className='h-4 w-4' />
            {listing.bedrooms} bed
          </span>
          <span className='flex items-center gap-1'>
            <Bath className='h-4 w-4' />
            {listing.bathrooms} bath
          </span>
          <span className='flex items-center gap-1'>
            <CalendarIcon className='h-4 w-4' />
            {listing.availableFrom}
          </span>
        </div>

        <div className='flex flex-wrap gap-2'>
          {listing.amenities.map((amenity) => (
            <Badge
              key={amenity}
              variant='secondary'
              className='bg-orange-50 text-amber-700 border border-amber-200/50'
            >
              {amenity}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className='p-4 pt-0'>
        <Button className='w-full bg-amber-600 hover:bg-amber-700 text-white'>
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

const ProfileButton = (): JSX.Element => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant='outline'
        className='roost-button flex items-center gap-2 hover:bg-amber-50'
      >
        <User className='h-4 w-4' />
        Profile
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align='end'
      className='w-48 bg-white border border-amber-100'
    >
      <DropdownMenuItem className='flex items-center gap-2 hover:bg-amber-50 focus:bg-amber-50 cursor-pointer'>
        <House className='h-4 w-4' />
        <span>Manage Listings</span>
      </DropdownMenuItem>
      <DropdownMenuItem className='flex items-center gap-2 hover:bg-amber-50 focus:bg-amber-50 cursor-pointer'>
        <MessageSquare className='h-4 w-4' />
        <span>Messages</span>
      </DropdownMenuItem>
      <DropdownMenuItem className='flex items-center gap-2 hover:bg-amber-50 focus:bg-amber-50 cursor-pointer'>
        <Settings className='h-4 w-4' />
        <span>Settings</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)
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
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2'>
              <Leaf className='h-6 w-6 text-amber-600' />
              <span className='text-xl font-bold text-amber-900'>Roost</span>
            </div>

          </div>
          <div className='flex gap-4 items-center'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <Input
                placeholder='Search by location, price, or amenities...'
                className='pl-10 border-amber-200 focus:border-amber-500'
              />
            </div>
            <FilterPopover onFiltersChange={handleFiltersChange} listings={listings} />
            <ProfileButton />
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
