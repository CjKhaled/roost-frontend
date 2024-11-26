import { useEffect, useState, useCallback, useRef } from 'react'
import { useJsApiLoader } from '@react-google-maps/api'
import { Search } from 'lucide-react'
import { Input } from '../../../components/ui/input'

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

interface CityAutocompleteProps {
  onSelect: (cityState: string) => void
}
const libraries: Array<'places' | 'drawing' | 'geometry' | 'localContext' | 'visualization'> = ['places']

const CityAutocomplete = ({ onSelect }: CityAutocompleteProps): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const [autocompleteService, setAutocompleteService] =
      useState<google.maps.places.AutocompleteService | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const MAPS_API_KEY: string = import.meta.env.VITE_MAPS_API_KEY

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: MAPS_API_KEY,
    libraries
  })

  useEffect(() => {
    if (!isLoaded) return
    setAutocompleteService(new google.maps.places.AutocompleteService())
  }, [isLoaded])

  const formatLocation = (mainText: string, secondaryText: string): string => {
    return `${mainText}, ${secondaryText}`
  }

  const fetchPredictions = useCallback(async (input: string) => {
    if (!autocompleteService || !input) {
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
  }, [autocompleteService])

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

  const handleSelectPrediction = (prediction: google.maps.places.AutocompletePrediction) => {
    const formattedLocation = formatLocation(
      prediction.structured_formatting.main_text,
      prediction.structured_formatting.secondary_text
    )
    setValue(formattedLocation)
    onSelect(formattedLocation)
    setOpen(false)
    // Keep focus on input after selection
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400 h-5 w-5" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search by city..."
          className="w-full pl-4 py-6 text-lg border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:ring-amber-500 bg-white/80 backdrop-blur-sm"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setOpen(true)
          }}
          onFocus={() => {
            if (predictions.length > 0) {
              setOpen(true)
            }
          }}
        />
      </div>
      {predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg border shadow-lg">
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
                  onClick={() => { handleSelectPrediction(prediction) }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                  }}
                >
                  <span className="font-medium">{city}</span>
                  <span className="text-gray-600">{state}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default CityAutocomplete
