import { useState } from 'react'
import {
  MapPin,
  Calendar,
  Bed,
  Bath,
  Heart,
  Share2,
  ChevronLeft,
  Mail,
  Phone,
  MessageCircle,
  Check,
  Info,
  User
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'
// import { Badge } from '../../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'

interface Landlord {
  name: string
  responseTime?: string
}

interface ListingData {
  id: number
  title: string
  address: string
  price: number
  availableFrom: string
  imageUrl: string
  amenities: string[]
  type: string
  bedrooms: number
  bathrooms: number
  utilities: string[]
  description: string
  policies: string[]
  landlord?: Landlord
}

const sampleListing: ListingData = {
  id: 1,
  title: 'Cozy Studio near Campus',
  address: '123 College Ave',
  price: 800,
  availableFrom: 'Aug 1 - Jul 31',
  imageUrl: '/api/placeholder/800/600',
  amenities: ['WiFi', 'Furnished', 'Utilities Included'],
  type: 'Studio',
  bedrooms: 1,
  bathrooms: 1,
  utilities: ['Water', 'Internet', 'Trash'],
  description: 'Experience modern living in this beautifully maintained property. Perfect for students looking for a convenient and comfortable living space near campus.',
  policies: [
    'Minimum 12-month lease',
    'Security deposit required',
    'No smoking',
    'Pet policy varies'
  ],
  landlord: {
    name: 'John Doe',
    responseTime: '24 hours'
  }
}

const ListingDetails = (): JSX.Element => {
  const [isFavorited, setIsFavorited] = useState<boolean>(false)
  const listing = sampleListing

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
                onClick={() => { setIsFavorited(!isFavorited) }}
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-red-500 stroke-red-500' : ''}`} />
                {isFavorited ? 'Saved' : 'Save'}
              </Button>
              <Button
                variant="outline"
                className="border-amber-200 hover:bg-amber-50"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="aspect-video rounded-lg overflow-hidden bg-amber-100">
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-amber-50/50 border border-amber-200">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
                >
                  Details & Amenities
                </TabsTrigger>
                <TabsTrigger
                  value="policies"
                  className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
                >
                  Policies
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="space-y-6">
                  <div className="prose max-w-none">
                    <p className="text-amber-800">{listing.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-white/50 border-amber-200">
                      <CardContent className="p-4 space-y-4">
                        <h3 className="font-semibold text-amber-900">Property Features</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-amber-700">
                            <Bed className="h-4 w-4" />
                            <span>{listing.bedrooms} Bedrooms</span>
                          </div>
                          <div className="flex items-center gap-2 text-amber-700">
                            <Bath className="h-4 w-4" />
                            <span>{listing.bathrooms} Bathrooms</span>
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
                              <span>{utility}</span>
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
                        Map goes here
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details">
                <div className="space-y-6">
                  <Card className="bg-white/50 border-amber-200">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-amber-900 mb-4">Amenities</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {listing.amenities.map((amenity) => (
                          <div key={amenity} className="flex items-center gap-2 text-amber-700">
                            <Check className="h-4 w-4" />
                            <span>{amenity}</span>
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
                      {listing.policies.map((policy) => (
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
                    <h1 className="text-2xl font-bold text-amber-900 mb-2">{listing.title}</h1>
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
                      <span>Available {listing.availableFrom}</span>
                    </div>
                  </div>

                  {listing.landlord && (
                    <div className="pt-4 border-t border-amber-200">
                      <h3 className="font-semibold text-amber-900 mb-3">Contact Landlord</h3>
                      <div className="space-y-2 text-amber-700">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{listing.landlord.name}</span>
                        </div>
                        {listing.landlord.responseTime && (
                          <div className="text-sm text-amber-600">
                            Usually responds within {listing.landlord.responseTime}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message Landlord
                    </Button>
                    <Button variant="outline" className="w-full border-amber-200 hover:bg-amber-50">
                      <Phone className="h-4 w-4 mr-2" />
                      Request Phone Call
                    </Button>
                    <Button variant="outline" className="w-full border-amber-200 hover:bg-amber-50">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-amber-200">
                    <div className="flex items-center gap-2 text-amber-700">
                      <Info className="h-4 w-4" />
                      <span className="text-sm">Request a tour to confirm availability</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ListingDetails
