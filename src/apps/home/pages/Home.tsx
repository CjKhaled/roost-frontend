import { useState } from 'react'
import { Search, Leaf } from 'lucide-react'
import { Input } from '../../../components/ui/input'
import ProfileMenu from '../../listings/components/ProfileMenu'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/button'

const Home = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    navigate('/listings', { state: { search: searchQuery } })
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
        <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search by city..."
            className="w-full pl-5 py-6 text-lg border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:ring-amber-500 bg-white/80 backdrop-blur-sm"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value) }}
          />
          <Button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-600 hover:bg-amber-700 text-white"
          >
            Search
          </Button>
        </form>
      </main>
    </div>
  )
}

export default Home
