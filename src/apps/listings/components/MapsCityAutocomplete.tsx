import { useEffect, useState, useCallback, useRef } from 'react'
import { Search } from 'lucide-react'
import { Input } from '../../../components/ui/input'
import { createPortal } from 'react-dom'

// if spaces, have to use quotes
const stateAbbreviations: Record<string, string> = {
  Alabama: 'AL',
  Alaska: 'AK',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  Florida: 'FL',
  Georgia: 'GA',
  Hawaii: 'HI',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  'West Virginia': 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY'
}

function getStateName (abbreviation: string): string | null {
  const abbreviationToName = Object.fromEntries(
    Object.entries(stateAbbreviations).map(([name, abbr]) => [abbr, name])
  )

  return abbreviationToName[abbreviation.toUpperCase()] || null
}

interface MapsCityAutocompleteProps {
  onSelect: (cityState: string, lat?: number, lng?: number) => void
  onSubmit?: () => void
  initialValue?: string
}

const MapsCityAutocomplete = ({ onSelect, onSubmit, initialValue }: MapsCityAutocompleteProps): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null)
  const [value, setValue] = useState(initialValue ?? '')
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const [autocompleteService, setAutocompleteService] =
      useState<google.maps.places.AutocompleteService | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google?.maps?.places) {
        try {
          setAutocompleteService(new window.google.maps.places.AutocompleteService())
          setGeocoder(new window.google.maps.Geocoder())
          setIsLoading(false)
        } catch (error) {
          console.error('Error initializing Google Maps services:', error)
        }
      } else {
        // If not loaded yet, check again in a moment
        setTimeout(checkGoogleMapsLoaded, 100)
      }
    }

    checkGoogleMapsLoaded()

    return () => {
      setAutocompleteService(null)
      setGeocoder(null)
    }
  }, [])

  const formatLocation = (mainText: string, secondaryText: string): string => {
    const state = secondaryText.split(',')[0].trim()
    return `${mainText}, ${state}`
  }

  const getCoordinates = async (placeId: string): Promise<{ lat: number; lng: number } | null> => {
    if (!geocoder) return null

    try {
      const result = await geocoder.geocode({ placeId })
      if (result.results[0]?.geometry?.location) {
        const location = result.results[0].geometry.location
        return {
          lat: location.lat(),
          lng: location.lng()
        }
      }
    } catch (error) {
      console.error('Geocoding error')
    }

    return null
  }

  const fetchPredictions = useCallback(async (input: string) => {
    if (!autocompleteService || !input || isLoading) {
      setPredictions([])
      return
    }

    try {
      const response = await autocompleteService.getPlacePredictions({
        input,
        types: ['(cities)'],
        componentRestrictions: { country: 'us' }
      })
      setPredictions(response.predictions || [])
    } catch (error) {
      console.error('Error fetching predictions:', error)
      setPredictions([])
    }
  }, [autocompleteService, isLoading])

  useEffect(() => {
    if (!value) {
      setPredictions([])
      return
    }

    const timer = setTimeout(() => {
      void fetchPredictions(value)
    }, 300)

    return () => { clearTimeout(timer) }
  }, [value, fetchPredictions])

  const processPredictionSelection = async (prediction: google.maps.places.AutocompletePrediction) => {
    const formattedLocation = formatLocation(
      prediction.structured_formatting.main_text,
      prediction.structured_formatting.secondary_text
    )

    // Clear predictions immediately before async operations
    setPredictions([])
    setShowDropdown(false)

    setValue(formattedLocation)

    const coordinates = await getCoordinates(prediction.place_id)
    onSelect(formattedLocation, coordinates?.lat, coordinates?.lng)

    if (coordinates) {
      onSubmit?.()
    }
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && predictions.length > 0) {
      e.preventDefault() // Prevent form submission
      await processPredictionSelection(predictions[0])
    }
  }

  const handleSelectPrediction = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>, prediction: google.maps.places.AutocompletePrediction) => {
    e.preventDefault()
    await processPredictionSelection(prediction)
  }

  const containerRef = useRef<HTMLDivElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null)

  useEffect(() => {
    const updatePosition = () => {
      if (containerRef.current && predictions.length > 0) {
        const rect = containerRef.current.getBoundingClientRect()
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width
        })
      } else {
        setDropdownPosition(null)
      }
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [predictions.length])

  // ... (keep existing prediction and selection handling)

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={isLoading ? 'Loading...' : 'Search by location'}
          disabled={isLoading}
          className="pl-10 border-amber-200 focus:border-amber-500"
          value={value}
          onChange={(e) => {
            setShowDropdown(true)
            setValue(e.target.value)
          }}
          onKeyDown={handleKeyDown}
        />
      </div>

      {dropdownPosition && predictions.length > 0 && showDropdown && createPortal(
        <div
          className="fixed bg-white rounded-lg border shadow-lg mt-1 z-[9999]"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`
          }}
        >
          <div className="max-h-[300px] overflow-auto p-2">
            {predictions.map((prediction) => {
              const city = prediction.structured_formatting.main_text
              const secondaryText = prediction.structured_formatting.secondary_text
              const parts = secondaryText.split(',')
              const state = getStateName(parts[0]?.trim()) ?? ''

              return (
                <button
                  key={prediction.place_id}
                  className="w-full text-left px-2 py-2 hover:bg-amber-50 rounded-lg flex justify-between items-center"
                  onClick={(e) => { void handleSelectPrediction(e, prediction) }}
                >
                  <span className="font-medium">{city}</span>
                  <span className="text-gray-600">{state}</span>
                </button>
              )
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default MapsCityAutocomplete
