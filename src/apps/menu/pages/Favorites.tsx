import { useEffect, useState } from 'react'
import { type Listing } from '../../listings/types/listing'
import { useAuth } from '../../../context/AuthContext'
import { listingsService } from '../../listings/services/listing'
import ListingCard from '../../listings/components/ListingCard'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'

const Favorites = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true)
  const [isUnfavoriteDialogOpen, setIsUnfavoriteDialogOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchFavoriteListings = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const fetchedListings = await listingsService.getUserFavorites()
        setListings(fetchedListings)
      } catch (error) {
        setError('Failed to fetch favorited listings.')
        console.log('Failed to fetch favorites', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchFavoriteListings()
  }, [user])

  const handleUnfavorite = async (): Promise<void> => {
    if (!selectedListing) return

    try {
      await listingsService.toggleFavorite(selectedListing.id)
      setListings(prevListings =>
        prevListings.filter(listing => listing.id !== selectedListing.id)
      )
      setIsUnfavoriteDialogOpen(false)
    } catch (error) {
      console.log('Error unfavoriting listing:', error)
    }
  }

  const onFavoriteClick = (listing: Listing): void => {
    setSelectedListing(listing)
    setIsUnfavoriteDialogOpen(true)
  }

  if (isLoading) {
    return (
          <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50'>
            <div className='text-amber-600'>Loading listings...</div>
          </div>
    )
  }

  if (error !== null) {
    return (
          <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50'>
            <div className='text-red-600'>{error}</div>
          </div>
    )
  }

  if (listings.length === 0) {
    return (
          <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50'>
            <div className='text-amber-600'>Favorite a listing, and it will show up here!</div>
          </div>
    )
  }

  return (
    <>
        <div className="flex-1 h-screen overflow-auto bg-gradient-to-br from-orange-100 to-amber-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-amber-900">Favorite Listings</h1>
                        <p className="text-amber-700 mt-2">View the listings you liked</p>
                    </div>
                </div>

                {/* listings */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing) => (
                        <ListingCard
                        key={listing.id}
                        listing={listing}
                        onFavoriteClick={() => { onFavoriteClick(listing) }}
                        isFavoritesPage={true} />
                    ))}
                </div>
            </div>
        </div>
        <Dialog open={isUnfavoriteDialogOpen} onOpenChange={setIsUnfavoriteDialogOpen}>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle>Remove from Favorites</DialogTitle>
                    <DialogDescription>
                    Are you sure you want to remove "{selectedListing?.name}" from your favorites?
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-4 mt-4">
                    <Button
                    variant="outline"
                    onClick={() => { setIsUnfavoriteDialogOpen(false) }}
                    >
                    Cancel
                    </Button>
                    <Button
                    variant="destructive"
                    onClick={() => { void handleUnfavorite() }}
                    >
                    Remove
                    </Button>
                </div>
            </DialogContent>
      </Dialog>
    </>
  )
}

export default Favorites
