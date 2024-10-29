import { useState } from 'react'
import {
  MapPin,
  Calendar as CalendarIcon,
  Bed,
  Bath,
  Heart
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardFooter } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'

import { type Listing } from '../types/listing'

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

export default ListingCard
