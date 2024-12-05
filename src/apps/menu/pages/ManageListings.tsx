import { useState, useEffect } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  MoreVertical,
  Building2,
  MapPin,
  Bed,
  Bath,
  Calendar
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import {
  Card,
  CardContent,
  CardHeader
} from '../../../components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../../../components/ui/dialog'
import ListingForm from '../components/ListingForm'
import { type Listing } from '../../listings/types/listing'
import { listingsService } from '../../listings/services/listing'
import { useAuth } from '../../../context/AuthContext'

const ManageListings = () => {
  const [listings, setListings] = useState<Listing[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user?.id) {
      void fetchUserListings()
    }
  }, [user?.id])

  const fetchUserListings = async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      setError(null)
      const fetchedListings = await listingsService.getUserListings(user.id)
      setListings(fetchedListings)
    } catch (err) {
      setError('Failed to fetch your listings')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const handleCreateListing = async (data: Partial<Listing>) => {
    try {
      setError(null)
      const newListing = await listingsService.createListing(data)
      setListings([...listings, newListing])
      setIsFormOpen(false)
      return true
    } catch (err) {
      setError('Failed to create listing')
      console.error(err)
      return false
    }
  }

  const handleEditListing = async (data: Partial<Listing>) => {
    if (!selectedListing) return false

    try {
      setError(null)
      const updatedListing = await listingsService.updateListing(selectedListing.id, data)
      setListings(listings.map(listing =>
        listing.id === selectedListing.id ? updatedListing : listing
      ))
      setIsFormOpen(false)
      setSelectedListing(null)
      return true
    } catch (err) {
      setError('Failed to update listing')
      console.error(err)
      return false
    }
  }

  const handleDeleteListing = async () => {
    if (!selectedListing) return

    try {
      setError(null)
      await listingsService.deleteListing(selectedListing.id)
      setListings(listings.filter(listing => listing.id !== selectedListing.id))
      setIsDeleteDialogOpen(false)
      setSelectedListing(null)
    } catch (err) {
      setError('Failed to delete listing')
      console.error(err)
    }
  }

  const openCreateForm = () => {
    setFormMode('create')
    setSelectedListing(null)
    setIsFormOpen(true)
  }

  const openEditForm = (listing: Listing) => {
    setFormMode('edit')
    setSelectedListing(listing)
    setIsFormOpen(true)
  }

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50'>
        <div className='text-amber-600'>Loading listings...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 h-screen overflow-auto bg-gradient-to-br from-orange-100 to-amber-50 p-8">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Manage Listings</h1>
          <p className="text-amber-700 mt-2">View and manage your property listings</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={openCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Listing
        </Button>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Card key={listing.id} className="bg-white/50 border-amber-200">
            <CardHeader className="p-0">
              <div className="h-48">
                <img
                  src={listing.imageUrl[0]}
                  alt={listing.name}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-amber-900">{listing.name}</h2>
                  <div className="flex items-center gap-2 text-amber-700 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{listing.address}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-amber-700">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="text-sm">${listing.price}/mo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4" />
                    <span className="text-sm">{listing.bedCount} bed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-4 w-4" />
                    <span className="text-sm">{listing.bathCount} bath</span>
                  </div>
                </div>

                <div className="border-t border-amber-200 pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-700">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Available: {new Date(listing.available.from).toLocaleDateString()} - {new Date(listing.available.to).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-xs text-amber-600">
                    Last updated {formatDate(listing.updatedAt)}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="bg-white hover:bg-gray-100 text-gray-800 shadow-sm border border-gray-200"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center" onClick={() => { openEditForm(listing) }}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center text-red-600"
                        onClick={() => {
                          setSelectedListing(listing)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Form dialog */}
      <ListingForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false) }}
        onSubmit={formMode === 'create' ? handleCreateListing : handleEditListing}
        error={error}
        initialData={selectedListing}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedListing?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => { setIsDeleteDialogOpen(false) }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteListing}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </div>
  )
}

export default ManageListings
