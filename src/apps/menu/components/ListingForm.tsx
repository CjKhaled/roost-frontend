import { Button } from '../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '../../../components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '../../../components/ui/form'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { Switch } from '../../../components/ui/switch'
import { Checkbox } from '../../../components/ui/checkbox'
import { useForm } from 'react-hook-form'

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
  description: string
  policies: {
    strictParking?: boolean
    strictNoisePolicy?: boolean
    guests?: boolean
    pets?: boolean
    smoking?: boolean
  }
  bedCount: number
  bathCount: number
  createdAt: Date
  updatedAt: Date
  lister: {
    id: number
    firstName: string
    lastName: string
    email: string
  }
}

interface ListingFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Listing>) => void
  initialData?: Listing
  mode: 'create' | 'edit'
}

const amenitiesList: Array<Listing['amenities'][number]> = [
  'WiFi',
  'Parking',
  'Laundry',
  'Dishwasher',
  'Gym',
  'Pool',
  'Study Room',
  'Trash Pickup',
  'Cable TV',
  'Electric Vehicle Charging'
]

const utilitiesList: Array<Listing['utilities'][number]> = [
  'Electricity',
  'Water',
  'Gas',
  'Sewer',
  'Pest Control'
]

const policiesList = [
  'strictParking',
  'strictNoisePolicy',
  'guests',
  'pets',
  'smoking'
]

const ListingForm = ({ isOpen, onClose, onSubmit, initialData, mode }: ListingFormProps) => {
  const form = useForm<Partial<Listing>>({
    defaultValues: initialData ?? {
      amenities: [],
      utilities: [],
      policies: {}
    }
  })

  const handleSubmit = (data: Partial<Listing>) => {
    onSubmit({
      ...data,
      location: {
        lat: parseFloat(data.location?.lat?.toString() ?? '0'),
        lng: parseFloat(data.location?.lng?.toString() ?? '0')
      },
      price: parseFloat(data.price?.toString() ?? '0'),
      bedCount: parseInt(data.bedCount?.toString() ?? '0'),
      bathCount: parseInt(data.bathCount?.toString() ?? '0')
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Listing' : 'Edit Listing'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Name</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      required
                      placeholder="Describe your property..."
                      className="min-h-[100px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} required />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location.lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location.lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($/month)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bedCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="availableFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available From</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} required />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Amenities</h3>
              <div className="grid grid-cols-2 gap-4">
                {amenitiesList.map((amenity) => (
                  <FormField
                    key={amenity}
                    control={form.control}
                    name="amenities"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(amenity)}
                            onCheckedChange={(checked) => {
                              const current = field.value ?? []
                              const updated = checked
                                ? [...current, amenity]
                                : current.filter((item) => item !== amenity)
                              field.onChange(updated)
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {amenity}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Utilities Included</h3>
              <div className="grid grid-cols-2 gap-4">
                {utilitiesList.map((utility) => (
                  <FormField
                    key={utility}
                    control={form.control}
                    name="utilities"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(utility)}
                            onCheckedChange={(checked) => {
                              const current = field.value ?? []
                              const updated = checked
                                ? [...current, utility]
                                : current.filter((item) => item !== utility)
                              field.onChange(updated)
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {utility}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Policies</h3>
              <div className="grid grid-cols-2 gap-4">
              {mode === 'create'
                ? policiesList.map((policy) => (
          <FormField
            key={policy}
            control={form.control}
            name={`policies.${policy}`}
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  {policy
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())}
                </FormLabel>
              </FormItem>
            )}
          />
                ))
                : Object.entries(initialData?.policies ?? {}).map(([policy, value]) => (
          <FormField
            key={policy}
            control={form.control}
            name={`policies.${policy}`}
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value ?? value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  {policy
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())}
                </FormLabel>
              </FormItem>
            )}
          />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === 'create' ? 'Create Listing' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ListingForm
