import { AdvancedMarker, useMap } from '@vis.gl/react-google-maps'
import { useEffect } from 'react'
import { type Listing } from '../types/listing'
import { CustomPin, MapPopup } from '../components/CustomPin'

const MapContent = ({ listings, selectedListing, onPinClick }:
{ listings: Listing[]
  selectedListing: string | null
  onPinClick: (listing: Listing) => void
}): JSX.Element => {
  const map = useMap()

  useEffect(() => {
    // Pan to selected listing when it changes
    const listing = listings.find(l => l.id === selectedListing)
    if (listing && map) {
      map.panTo({ lat: listing.location.lat, lng: listing.location.lng })
      map.setZoom(15)
    }
  }, [selectedListing, listings, map])

  return (
      <>
        {listings.map((listing) => (
          <AdvancedMarker
            key={listing.id}
            position={{ lat: listing.location.lat, lng: listing.location.lng }}
          >
            <div>
              <CustomPin
                listing={listing}
                isSelected={selectedListing === listing.id}
                onClick={() => { onPinClick(listing) }}
              />
              {selectedListing === listing.id && (
                <MapPopup
                  listing={listing}
                  onClose={() => { onPinClick(listing) }}
                />
              )}
            </div>
          </AdvancedMarker>
        ))}
      </>
  )
}

export default MapContent
