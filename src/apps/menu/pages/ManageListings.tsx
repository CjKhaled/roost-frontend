import { useState } from 'react'
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

// Sample data for preview
const sampleListings: Listing[] = [
  {
    id: '1',
    name: 'Modern Downtown Apartment',
    address: '123 Main St, Cityville',
    location: { lat: 40.7128, lng: -74.0060 },
    price: 1500,
    available: {
      from: '2024-08-01',
      to: '2025-07-31'
    },
    imageUrl: [
      'https://www.decorilla.com/online-decorating/wp-content/uploads/2020/07/Sleek-and-transitional-modern-apartment-design-scaled.jpg'
    ],
    description: 'Modern apartment in the heart of downtown with great amenities.',
    amenities: ['WiFi', 'Parking', 'Laundry'],
    utilities: ['Water', 'Electricity'],
    policies: {
      petsAllowed: true,
      smokingAllowed: false,
      guestsAllowed: true
    },
    bedCount: 2,
    bathCount: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    lister: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    }
  },
  {
    id: '2',
    name: 'Cozy Studio near Campus',
    address: '456 College Ave, Edutown',
    location: { lat: 40.7282, lng: -73.9942 },
    price: 900,
    available: {
      from: '2024-09-01',
      to: '2025-08-31'
    },
    imageUrl: [
      'https://www.decorilla.com/online-decorating/wp-content/uploads/2020/07/Sleek-and-transitional-modern-apartment-design-scaled.jpg'
    ],
    description: 'Perfect studio apartment for students, close to campus.',
    amenities: ['WiFi', 'Study Room', 'Gym'],
    utilities: ['Water', 'Electricity', 'Gas'],
    policies: {
      strictNoisePolicy: true,
      guestsAllowed: true,
      smokingAllowed: false
    },
    bedCount: 1,
    bathCount: 1,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    lister: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    }
  }
]

const ManageListings = () => {
  const [listings, setListings] = useState<Listing[]>(sampleListings)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const handleCreateListing = (data: Partial<Listing>) => {
    // @ts-expect-error: don't worry about this
    const newListing: Listing = {
      ...data,
      id: String(listings.length + 1),
      createdAt: new Date(),
      updatedAt: new Date(),
      lister: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      }
    }

    setListings([...listings, newListing])
  }

  const handleEditListing = (data: Partial<Listing>) => {
    if (!selectedListing) return

    const updatedListing: Listing = {
      ...selectedListing,
      ...data,
      updatedAt: new Date()
    }

    setListings(listings.map(listing =>
      listing.id === selectedListing.id ? updatedListing : listing
    ))
  }

  const handleDeleteListing = () => {
    if (!selectedListing) return

    setListings(listings.filter(listing => listing.id !== selectedListing.id))
    setIsDeleteDialogOpen(false)
    setSelectedListing(null)
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
