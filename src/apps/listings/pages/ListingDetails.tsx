import { useState, useEffect } from 'react'
import {
  MapPin,
  Calendar,
  Bed,
  Bath,
  Heart,
  ChevronLeft,
  MessageCircle,
  Check,
  Info,
  User,
  X
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../../../components/ui/carousel'
import {
  Dialog,
  DialogContent,
  DialogClose
} from '../../../components/ui/dialog'
import ProfileMenu from '../components/ProfileMenu'
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps'
import { type Listing } from '../types/listing'
import { useParams, useNavigate } from 'react-router-dom'
import { listingsService } from '../services/listing'

const ListingDetails = (): JSX.Element => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [listing, setListing] = useState<Listing | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorited, setIsFavorited] = useState<boolean>(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const MAPS_API_KEY: string = import.meta.env.VITE_MAPS_API_KEY
  const [lister, setLister] = useState<{ firstName: string; lastName: string } | null>(null)
  const [isListerLoading, setIsListerLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchListing = async () => {
      if (id === undefined) {
        navigate('/listings')
        return
      }

      try {
        const data = await listingsService.getListingById(id)
        setListing(data)
      } catch (err) {
        setError('Failed to fetch listing details')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchListing()
  }, [id, navigate])

  useEffect(() => {
    // Only fetch lister data if listing is defined
    if (!listing) return

    const fetchLister = async () => {
      try {
        console.log(listing.listerId)
        const listerData = await listingsService.getUserByID(listing.listerId) // Use the service to fetch lister data
        setLister(listerData)
      } catch (error) {
        console.error('Failed to fetch lister', error)
      } finally {
        setIsListerLoading(false)
      }
    }

    void fetchLister()
  }, [listing])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50">
        <div className="text-amber-600">Loading listing details...</div>
      </div>
    )
  }

  if (error !== null || listing === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50">
        <div className="text-red-600">{error ?? 'Listing not found'}</div>
      </div>
    )
  }

  const formatDateRange = (from: string, to: string): string => {
    const fromDate = new Date(from)
    const toDate = new Date(to)
    return `${fromDate.toLocaleDateString('en-US', { month: 'short' })} ${fromDate.getFullYear()} - ${toDate.toLocaleDateString('en-US', { month: 'short' })} ${toDate.getFullYear()}`
  }

  const formatAmenityLabel = (amenity: string): string => {
    return amenity
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  const getPolicyList = (): string[] => {
    const policies: string[] = []
    if (listing.policies.strictParking) policies.push('Strict parking policy')
    if (listing.policies.strictNoisePolicy) policies.push('Strict noise policy')
    if (listing.policies.guestsAllowed) policies.push('Guests allowed')
    if (!listing.policies.petsAllowed) policies.push('No pets allowed')
    if (!listing.policies.smokingAllowed) policies.push('No smoking')
    return policies
  }

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index)
    console.log(currentImageIndex)
    setIsImageModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-amber-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/50 backdrop-blur-sm border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-amber-700 hover:text-amber-800 hover:bg-amber-100"
              onClick={() => { window.history.back() }}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Listings
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-amber-200 hover:bg-amber-50"
                onClick={() => {
                  const favorites = JSON.parse(localStorage.getItem('favoritedListings') ?? '[]')
                  const updatedFavorites = isFavorited
                    ? favorites.filter((fav: string) => fav !== listing.id) // Remove if already favorited
                    : [...favorites, listing.id]
                  localStorage.setItem('favoritedListings', JSON.stringify(updatedFavorites))
                  setIsFavorited(!isFavorited)
                  console.log(localStorage.getItem('favoritedListings'))
                }}
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-red-500 stroke-red-500' : ''}`} />
                {isFavorited ? 'Saved' : 'Save'}
              </Button>
              <ProfileMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Carousel */}
            <div className="relative group">
              <Carousel className="w-full">
                <CarouselContent>
                  {listing.imageUrl.map((imageUrl, index) => (
                    <CarouselItem key={index} className={`${listing.imageUrl.length > 1 ? 'basis-1/2' : ''}`}>
                      <div
                        className="aspect-video rounded-lg overflow-hidden bg-amber-100"
                        onClick={() => { handleImageClick(index) }}
                      >
                        <img
                          src={imageUrl}
                          alt={`${listing.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 bg-black/50 hover:bg-black/70 text-white border-none opacity-0 group-hover:opacity-100 transition-opacity" />
                <CarouselNext className="right-4 bg-black/50 hover:bg-black/70 text-white border-none opacity-0 group-hover:opacity-100 transition-opacity" />
              </Carousel>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-amber-50/50 border border-amber-200">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
              >
                Details & Amenities
              </TabsTrigger>
              <TabsTrigger
                value="policies"
                className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
              >
                Policies
              </TabsTrigger>
            </TabsList>

              <TabsContent value="overview">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-white/50 border-amber-200">
                      <CardContent className="p-4 space-y-4">
                        <h3 className="font-semibold text-amber-900">Property Features</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-amber-700">
                            <Bed className="h-4 w-4" />
                            <span>{listing.bedCount} Bedrooms</span>
                          </div>
                          <div className="flex items-center gap-2 text-amber-700">
                            <Bath className="h-4 w-4" />
                            <span>{listing.bathCount} Bathrooms</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/50 border-amber-200">
                      <CardContent className="p-4 space-y-4">
                        <h3 className="font-semibold text-amber-900">Included Utilities</h3>
                        <div className="grid grid-cols-1 gap-2">
                          {listing.utilities.map((utility) => (
                            <div key={utility} className="flex items-center gap-2 text-amber-700">
                              <Check className="h-4 w-4" />
                              <span>{formatAmenityLabel(utility)}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Map Placeholder */}
                  <div className="bg-white/50 rounded-lg border border-amber-200 p-4">
                    <h3 className="font-semibold text-amber-900 mb-4">Location</h3>
                    <div className="aspect-[16/9] rounded-lg overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center bg-amber-50 text-amber-700 border border-amber-200">
                        <APIProvider apiKey={MAPS_API_KEY}>
                          <Map mapId='a595f3d0fe04f9cf' defaultZoom={13} defaultCenter={listing.location}>
                            <AdvancedMarker key={listing.id} position={listing.location}>
                              <Pin background='#b45309' />
                            </AdvancedMarker>
                          </Map>
                        </APIProvider>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details">
                <div className="space-y-6">
                  <Card className="bg-white/50 border-amber-200">
                    <CardHeader>
                      <CardTitle className="text-amber-900">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none text-amber-800 whitespace-pre-line">
                        {listing.description}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/50 border-amber-200">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-amber-900 mb-4">Amenities</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {listing.amenities.map((amenity) => (
                          <div key={amenity} className="flex items-center gap-2 text-amber-700">
                            <Check className="h-4 w-4" />
                            <span>{formatAmenityLabel(amenity)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="policies">
                <Card className="bg-white/50 border-amber-200">
                  <CardContent className="p-4 space-y-4">
                    <h3 className="font-semibold text-amber-900">Lease Policies</h3>
                    <div className="grid gap-3">
                      {getPolicyList().map((policy) => (
                        <div key={policy} className="flex items-start gap-2 text-amber-700">
                          <Info className="h-4 w-4 mt-1 flex-shrink-0" />
                          <span>{policy}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="bg-white/50 border-amber-200">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-amber-900 mb-2">{listing.name}</h1>
                    <div className="flex items-center gap-2 text-amber-700">
                      <MapPin className="h-4 w-4" />
                      <span>{listing.address}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-amber-200">
                    <div className="text-3xl font-bold text-amber-900 mb-2">
                      ${listing.price}
                      <span className="text-lg font-normal text-amber-700">/month</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-700">
                      <Calendar className="h-4 w-4" />
                      <span>Available {formatDateRange(listing.available.from, listing.available.to)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-amber-200">
                    <h3 className="font-semibold text-amber-900 mb-3">Lister</h3>
                    <div className="space-y-2 text-amber-700">
                    {isListerLoading
                      ? (
                      <div>Loading...</div>
                        )
                      : lister
                        ? (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{`${lister.firstName} ${lister.lastName}`}</span>
                      </div>
                          )
                        : (
                      <div>Lister not found</div>
                          )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={() => {
                        navigate('/messages')
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      {/* Image modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-screen-lg w-full p-0 bg-black/90">
          <div className="relative">
            <DialogClose className="absolute right-4 top-4 z-50">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </Button>
            </DialogClose>

            <Carousel className="w-full">
              <CarouselContent>
                {listing.imageUrl.map((imageUrl, index) => (
                  <CarouselItem key={index}>
                    <div className="flex items-center justify-center min-h-[200px] h-[calc(100vh-200px)]">
                      <img
                        src={imageUrl}
                        alt={`${listing.name} - Image ${index + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-black/50 hover:bg-black/70 text-white border-none" />
              <CarouselNext className="right-4 bg-black/50 hover:bg-black/70 text-white border-none" />
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ListingDetails
