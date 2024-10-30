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

interface Listing {
  id: number
  name: string
  address: string
  location: {
    lat: number
    lng: number
  }
  price: number
  availableFrom: string
  imageUrl: string
  amenities: Array<'WiFi' | 'Parking' | 'Laundry' | 'Dishwasher' | 'Gym' | 'Pool' | 'Study Room' | 'Trash Pickup' | 'Cable TV' | 'Electric Vehicle Charging'>
  utilities: Array<'Electricity' | 'Water' | 'Gas' | 'Sewer' | 'Pest Control'>
  policies: {
    strictParking?: boolean
    strictNoisePolicy?: boolean
    guests?: boolean
    pets?: boolean
    smoking?: boolean
  }
  bedCount: number
  bathCount: number
  description?: string
  createdAt: Date
  updatedAt: Date
  lister: {
    id: number
    firstName: string
    lastName: string
    email: string
  }
}

// Sample data for preview
const sampleListings: Listing[] = [
  {
    id: 1,
    name: 'Modern Downtown Apartment',
    address: '123 Main St, Cityville',
    location: { lat: 40.7128, lng: -74.0060 },
    price: 1500,
    availableFrom: '2024-08-01',
    imageUrl: 'https://www.decorilla.com/online-decorating/wp-content/uploads/2020/07/Sleek-and-transitional-modern-apartment-design-scaled.jpg',
    amenities: ['WiFi', 'Parking', 'Laundry'],
    utilities: ['Water', 'Electricity'],
    policies: {
      strictParking: true,
      pets: true,
      smoking: false
    },
    bedCount: 2,
    bathCount: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    lister: {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    }
  },
  {
    id: 2,
    name: 'Cozy Studio near Campus',
    address: '456 College Ave, Edutown',
    location: { lat: 40.7282, lng: -73.9942 },
    price: 900,
    availableFrom: '2024-09-01',
    imageUrl: 'https://www.decorilla.com/online-decorating/wp-content/uploads/2020/07/Sleek-and-transitional-modern-apartment-design-scaled.jpg',
    amenities: ['WiFi', 'Study Room', 'Gym'],
    utilities: ['Water', 'Electricity', 'Gas'],
    policies: {
      strictNoisePolicy: true,
      guests: true,
      smoking: false
    },
    bedCount: 1,
    bathCount: 1,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    lister: {
      id: 1,
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
    const newListing: Listing = {
      ...data,
      id: listings.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      lister: {
        id: 1,
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
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-amber-50">

        {/* Main Content */}
        <main className="flex-1 pl-64">
          <div className="p-8">
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
                      <div className="relative h-48">
                        <img
                          src={listing.imageUrl}
                          alt={listing.name}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                        <div className="absolute top-4 right-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="secondary"
                                size="icon"
                                className="bg-black/50 hover:bg-black/70 text-white border-none"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem className="flex items-center" onClick={() => { openEditForm(listing) } }>
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
                            <span className="text-sm">Available from {new Date(listing.availableFrom).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-xs text-amber-600">
                          Last updated {formatDate(listing.updatedAt)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Create/Edit Form dialog */}
              <ListingForm isOpen={isFormOpen}
              onClose={() => { setIsFormOpen(false) }}
              onSubmit={formMode === 'create' ? handleCreateListing : handleEditListing}
              initialData={selectedListing ?? undefined} mode={formMode} />

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
                      onClick={() => {
                        handleDeleteListing()
                        setIsDeleteDialogOpen(false)
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </main>
      </div>
  )
}

export default ManageListings
