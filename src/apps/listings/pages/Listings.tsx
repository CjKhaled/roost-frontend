import { useState } from 'react'
import {
  MapPin,
  Calendar,
  Search,
  Bed,
  Bath,
  Filter,
  Heart,
  User,
  MessageSquare,
  Settings,
  Leaf
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
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps'

const Listings = (): JSX.Element => {
  const [favorites, setFavorites] = useState(new Set())
  const [hoveredListing, setHoveredListing] = useState(0)
  const MAPS_API_KEY: string = import.meta.env.VITE_MAPS_API_KEY
  const GAINESVILLE_CENTER = { lat: 29.6516, lng: -82.3248 }
  console.log(MAPS_API_KEY)

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

  interface ListingCardProps {
    listing: Listing
  }

  const ListingCard = ({ listing }: ListingCardProps): JSX.Element => (
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
            <Calendar className='h-4 w-4' />
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

  const HeaderButton = ({ icon: Icon, text, onClick, dropdown = false }): JSX.Element => (
    <Button
      variant='outline'
      onClick={onClick}
      className='h-9 px-3 roost-button flex items-center gap-2 hover:bg-amber-50'
    >
      <Icon className='h-4 w-4' />
      <span className='text-sm font-medium'>{text}</span>
    </Button>
  )

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
          <User className='h-4 w-4' />
          <span>Profile</span>
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
            <HeaderButton
              icon={Filter}
              text='Filters'
              onClick={() => {}}
            />
            <ProfileButton />
          </div>
        </div>
      </div>

      {/* Split View */}
      <div className='flex-1 flex overflow-hidden'>
        {/* Listings Panel */}
        <div className='w-1/4 overflow-y-auto p-6 border-r'>
          <div className='grid grid-cols-1 gap-6'>
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>

        {/* Map Panel */}
        <div className='w-3/4 bg-amber-50'>
          <div className='h-full flex items-center justify-center text-amber-700'>
            <APIProvider apiKey={MAPS_API_KEY}>
              <Map mapId='a595f3d0fe04f9cf' defaultZoom={13} defaultCenter={GAINESVILLE_CENTER}>
                {listings.map((listing) => (
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
