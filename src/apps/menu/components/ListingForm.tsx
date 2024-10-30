import { Button } from '../../../components/ui/button'
import { useEffect } from 'react'
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
import { Calendar as CalendarComponent } from '../../../components/ui/calendar'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover'
import { format } from 'date-fns'
import { cn } from '../../../lib/utils'
import { type Listing, type AmenityType, type UtilityType } from '../../listings/types/listing'

interface ListingFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Listing>) => void
  initialData: Listing | null
  mode: 'create' | 'edit'
}

const amenitiesList: AmenityType[] = [
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

const utilitiesList: UtilityType[] = [
  'Electricity',
  'Water',
  'Gas',
  'Sewer',
  'Pest Control'
]

const policiesList = [
  { key: 'strictParking', label: 'Strict Parking' },
  { key: 'strictNoisePolicy', label: 'Strict Noise Policy' },
  { key: 'guestsAllowed', label: 'Guests Allowed' },
  { key: 'petsAllowed', label: 'Pets Allowed' },
  { key: 'smokingAllowed', label: 'Smoking Allowed' }
]

const emptyFormValues = {
  name: '',
  description: '',
  address: '',
  location: {
    lat: '',
    lng: ''
  },
  price: '',
  bedCount: '',
  bathCount: '',
  imageUrl: [''],
  amenities: [],
  utilities: [],
  policies: {
    strictParking: false,
    strictNoisePolicy: false,
    guestsAllowed: false,
    petsAllowed: false,
    smokingAllowed: false
  },
  available: {
    from: '',
    to: ''
  }
}

const ListingForm = ({ isOpen, onClose, onSubmit, initialData, mode }: ListingFormProps) => {
  const form = useForm<Partial<Listing>>({
    // @ts-expect-error: don't worry about this
    defaultValues: emptyFormValues
  })

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      // Reset form with initial data for edit mode
      form.reset({
        ...initialData,
        available: {
          from: initialData.available.from,
          to: initialData.available.to
        },
        imageUrl: initialData.imageUrl,
        amenities: initialData.amenities || [],
        utilities: initialData.utilities || [],
        policies: initialData.policies || {}
      })
    } else if (mode === 'create') {
      // @ts-expect-error: don't worry about this
      form.reset(emptyFormValues)
    }
  }, [mode, initialData, form, isOpen])

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

  const formatDate = (date: Date | undefined): string => {
    if (!date) return ''
    return format(date, 'LLL dd, y')
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
              name="available"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Availability Period</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value?.from
                          ? (
                              field.value.to
                                ? (
                            <>
                              {formatDate(new Date(field.value.from))} -{' '}
                              {formatDate(new Date(field.value.to))}
                            </>
                                  )
                                : (
                                    formatDate(new Date(field.value.from))
                                  )
                            )
                          : (
                          <span>Select availability period</span>
                            )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={field.value?.from ? new Date(field.value.from) : undefined}
                        selected={{
                          from: field.value?.from ? new Date(field.value.from) : undefined,
                          to: field.value?.to ? new Date(field.value.to) : undefined
                        }}
                        onSelect={(dateRange) => {
                          field.onChange({
                            from: dateRange?.from?.toISOString() ?? '',
                            to: dateRange?.to?.toISOString() ?? ''
                          })
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
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
                {policiesList.map(({ key, label }) => (
                  <FormField
                    key={key}
                    control={form.control}
                    // @ts-expect-error: don't worry about this
                    name={`policies.${key}`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            // @ts-expect-error: don't worry about this
                            checked={field.value ?? false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">{label}</FormLabel>
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
