/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMap } from '@vis.gl/react-google-maps'
import { type Listing } from '../types/listing'
import { useEffect } from 'react'
import CustomAdvancedMarker from './CustomAdvancedMarker'

const MapContent = ({
  filteredListings,
  selectedListing
}: {
  filteredListings: Listing[]
  selectedListing: string | null
}) => {
  const map = useMap()

  // Helper function to check if panTo will animate smoothly
  const willAnimatePanTo = (map: google.maps.Map, destLatLng: google.maps.LatLngLiteral) => {
    const bounds = map.getBounds()
    if (!bounds) return false

    const center = map.getCenter()
    if (!center) return false

    // Convert bounds to viewport width/height
    const ne = bounds.getNorthEast()
    const sw = bounds.getSouthWest()
    const width = Math.abs(ne.lng() - sw.lng())
    const height = Math.abs(ne.lat() - sw.lat())

    // Check if destination is within current viewport dimensions
    const diffLng = Math.abs(destLatLng.lng - center.lng())
    const diffLat = Math.abs(destLatLng.lat - center.lat())

    return diffLng < width && diffLat < height
  }

  // Main animation function
  const smoothlyAnimatePanTo = (destLatLng: google.maps.LatLngLiteral) => {
    if (!map) return

    if (willAnimatePanTo(map, destLatLng)) {
      // If within viewport, just pan normally
      map.panTo(destLatLng)
    } else {
      // Otherwise, zoom out, pan, and zoom back in
      const initialZoom = map.getZoom() ?? 0

      // Disable controls during animation
      map.setOptions({
        draggable: false,
        zoomControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: true
      })

      // Zoom out
      map.setZoom(initialZoom - 2)

      // Wait for zoom out to complete
      const zoomOutListener = google.maps.event.addListenerOnce(map, 'idle', () => {
        // Pan to destination
        map.panTo(destLatLng)

        // Wait for pan to complete
        const panListener = google.maps.event.addListenerOnce(map, 'idle', () => {
          // Zoom back in
          map.setZoom(initialZoom)

          // Wait for zoom in to complete
          const zoomInListener = google.maps.event.addListenerOnce(map, 'idle', () => {
            // Re-enable controls
            map.setOptions({
              draggable: true,
              zoomControl: true,
              scrollwheel: true,
              disableDoubleClickZoom: false
            })
          })
        })
      })
    }
  }

  useEffect(() => {
    if (selectedListing) {
      const selectedListingData = filteredListings.find(l => l.id === selectedListing)
      if (selectedListingData && map) {
        const targetPosition = {
          lat: selectedListingData.location.lat,
          lng: selectedListingData.location.lng
        }

        smoothlyAnimatePanTo(targetPosition)
      }
    }
  }, [selectedListing, filteredListings, map])

  return (
    <>
      {filteredListings.map((listing) => (
        <CustomAdvancedMarker listing={listing} isSelected={selectedListing === listing.id} />
      ))}
    </>
  )
}

export default MapContent
