import { AdvancedMarker } from '@vis.gl/react-google-maps'
import { type Listing } from '../types/listing'
import { useState } from 'react'
import { Home } from 'lucide-react'

interface CustomAdvancedMarkerProps {
  listing: Listing
  isSelected?: boolean
}

const CustomAdvancedMarker = ({ listing, isSelected = false }: CustomAdvancedMarkerProps): JSX.Element => {
  const [hovered, setHovered] = useState<boolean>(false)

  // marker should appear expanded if either hovered OR selected
  const isExpanded = hovered || isSelected

  const renderCustomPin = () => {
    return (
        <div className="relative transform transition-all duration-200 ease-in-out translate-y-0 hover:-translate-y-1 cursor-pointer">
        {/* Custom Pin */}
            <div
                className={`
                    relative
                    transition-all duration-200 ease-in-out
                    ${isExpanded ? 'w-20 h-20' : 'w-9 h-9'}
                    bg-amber-600
                    ring-4 ring-amber-800
                    rounded-full p-1
                    flex items-center justify-center
                    overflow-hidden
                    z-10`
                }>

                {/* Icon Container */}
                <div className={`
                    transition-opacity duration-200
                    ${isExpanded ? 'opacity-0' : 'opacity-100'}
                `}>
                    <Home className="h-5 w-5 text-white" />
                </div>

                <div className={`
                    absolute inset-0
                    transition-opacity duration-200
                    ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                    <img
                    src={listing.imageUrl[0]}
                    alt={listing.name}
                    className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Pin Tip */}
            <div className={`
            absolute -bottom-1 left-1/2
            w-0 h-0
            border-[12px] border-amber-800
            transition-transform duration-200
            -translate-x-1/2 translate-y-[2%] rotate-45
            ${isExpanded ? 'scale-[1.4]' : 'scale-100'}
            z-0
            `} />
      </div>
    )
  }

  return (
    <AdvancedMarker
        onMouseEnter={() => { setHovered(true) }}
        onMouseLeave={() => { setHovered(false) }}
        key={listing.id}
        position={{ lat: listing.location.lat, lng: listing.location.lng }}
    >
        {renderCustomPin()}
    </AdvancedMarker>
  )
}

export default CustomAdvancedMarker
