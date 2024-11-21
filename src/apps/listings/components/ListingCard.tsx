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
import { useNavigate } from 'react-router-dom'
import { type Listing } from '../types/listing'

interface ListingCardProps {
  listing: Listing
  isSelected?: boolean
  onClick?: () => void
}

const ListingCard = ({ listing, isSelected = false, onClick }: ListingCardProps): JSX.Element => {
  const [favorites, setFavorites] = useState(new Set<string>())
  const [hoveredListing, setHoveredListing] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/listings/${listing.id}`)
  }

  const toggleFavorite = (id: string): void => {
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

  const formatDateRange = (from: string, to: string): string => {
    const fromDate = new Date(from)
    const toDate = new Date(to)
    return `${fromDate.toLocaleDateString('en-US', { month: 'short' })} ${fromDate.getFullYear()} - ${toDate.toLocaleDateString('en-US', { month: 'short' })} ${toDate.getFullYear()}`
  }

  const formatAmenityLabel = (amenity: string): string => {
    return amenity
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  return (

      <Card
        data-listing-id={listing.id}
        className={`overflow-hidden hover:shadow-lg transition-all duration-200 ${isSelected ? 'ring-2 ring-amber-500 shadow-lg transform scale-[1.02]' : 'hover:shadow-lg'}
        ${hoveredListing === listing.id ? 'ring-2 ring-amber-500' : ''
        }`}
        onClick={onClick}
        onMouseEnter={() => { setHoveredListing(listing.id) }}
        onMouseLeave={() => { setHoveredListing(null) }}
      >
        <CardHeader className='p-0 relative'>
          <img
            src={listing.imageUrl[0]}
            alt={listing.name}
            className='w-full h-48 object-cover'
          />
          <div className='absolute top-4 right-4 flex gap-2'>
            <Badge className={`
              ${isSelected
                ? 'bg-amber-600 text-white'
                : 'bg-white/90 text-amber-900'
              } 
              font-medium transition-colors
            `}>
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
            <h3 className={`
            text-lg font-semibold 
            ${isSelected ? 'text-amber-700' : 'text-amber-900'}
            transition-colors
          `}>{listing.name}</h3>
            <div className='flex items-center text-amber-700 gap-2 text-sm'>
              <MapPin className='h-4 w-4' />
              {listing.address}
            </div>
          </div>

          <div className='flex items-center gap-4 text-sm text-amber-700 mb-3'>
            <span className='flex items-center gap-1'>
              <Bed className='h-4 w-4' />
              {listing.bedCount} bed
            </span>
            <span className='flex items-center gap-1'>
              <Bath className='h-4 w-4' />
              {listing.bathCount} bath
            </span>
            <span className='flex items-center gap-1'>
              <CalendarIcon className='h-4 w-4' />
              {formatDateRange(listing.available.from, listing.available.to)}
            </span>
          </div>

          <div className='flex flex-wrap gap-2'>
            {listing.amenities.map((amenity) => (
              <Badge
                key={amenity}
                variant='secondary'
                className={`
                  ${isSelected
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-orange-50 text-amber-700'
                  } 
                  border border-amber-200/50 transition-colors
                `}
              >
                {formatAmenityLabel(amenity)}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className='p-4 pt-0'>
          <Button className={`
            w-full transition-colors
            ${isSelected
              ? 'bg-amber-700 hover:bg-amber-800'
              : 'bg-amber-600 hover:bg-amber-700'
            } 
            text-white
          `} onClick={handleClick}>
            View Details
          </Button>
        </CardFooter>
      </Card>
  )
}

export default ListingCard
