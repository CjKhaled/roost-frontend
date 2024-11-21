import { type Listing } from '../types/listing'
import { Badge } from '../../../components/ui/badge'
import { Bed, Bath, MapPin } from 'lucide-react'
import { useState } from 'react'

interface CustomPinProps {
  listing: Listing
  isSelected: boolean
  onClick: () => void
}

const CustomPin = ({ listing, isSelected, onClick }: CustomPinProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => { setIsHovered(true) }}
      onMouseLeave={() => { setIsHovered(false) }}
      className={`
        relative cursor-pointer transform transition-transform duration-200 
        ${isSelected ? 'scale-110' : 'hover:scale-105'}
      `}
    >
      <div className={`
        p-3 rounded-full shadow-lg flex items-center justify-center
        ${isSelected ? 'bg-amber-600' : 'bg-white'}
        border-2 ${isSelected ? 'border-amber-700' : 'border-amber-200'}
      `}>
        <MapPin
          className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-amber-600'}`}
        />
      </div>

      {(isHovered || isSelected) && (
        <MapPopup listing={listing} onClose={() => {}} />
      )}
    </div>
  )
}

interface MapPopupProps {
  listing: Listing
  onClose: () => void
}

const MapPopup = ({ listing, onClose }: MapPopupProps) => {
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={listing.imageUrl[0]}
          alt={listing.name}
          className="w-full h-32 object-cover"
        />
        <div className="p-3">
          <h3 className="font-semibold text-amber-900 mb-1">{listing.name}</h3>
          <p className="text-sm text-amber-700 mb-2">{listing.address}</p>
          <div className="flex items-center gap-4 text-sm text-amber-700 mb-2">
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              {listing.bedCount}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              {listing.bathCount}
            </span>
          </div>
          <Badge className="bg-amber-600 text-white">
            ${listing.price}/mo
          </Badge>
        </div>
      </div>
    </div>
  )
}

export { CustomPin, MapPopup }
