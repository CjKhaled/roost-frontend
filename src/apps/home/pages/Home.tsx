import { useState } from 'react'
import { Leaf } from 'lucide-react'
import ProfileMenu from '../../listings/components/ProfileMenu'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import CityAutocomplete from '../components/CityAutocomplete'

const Home = (): JSX.Element => {
  const [selectedCity, setSelectedCity] = useState('')
  const [coordinates, setCoordinates] = useState<{ lat?: number; lng?: number }>({})
  const navigate = useNavigate()

  const handleSelect = (cityState: string, lat?: number, lng?: number) => {
    setSelectedCity(cityState)
    setCoordinates({ lat, lng })
    if (cityState && lat && lng) {
      navigate('/listings', {
        state: {
          city: cityState,
          coordinates: { lat, lng }
        }
      })
    }
  }

  const handleSearch = (e?: { preventDefault: () => void }) => {
    e?.preventDefault()
    if (selectedCity && coordinates.lat && coordinates.lng) {
      console.log('Selected city:', selectedCity)
      console.log('Coordinates:', coordinates)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-amber-50">
      {/* Header */}
      <header className="p-4 border-b bg-white/50 backdrop-blur-sm">
        <div className="max-w-[1920px] mx-auto flex justify-between items-center">
          <div />
          <ProfileMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 pt-20 text-center">
        {/* Logo and Title */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Leaf className="h-16 w-16 text-amber-600" />
          <h1 className="text-6xl font-bold text-amber-900">Roost</h1>
        </div>

        {/* Tagline */}
        <p className="text-xl text-amber-700 mb-12">
          Find your perfect sublease
        </p>

        {/* Search Bar */}
        <form className="relative max-w-xl mx-auto">
          <div className="relative">
                <CityAutocomplete onSelect={handleSelect} onSubmit={handleSearch} />
                <Button
                    type="button"
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-600 hover:bg-amber-700 text-white"
                >
                    Search
                </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Home
