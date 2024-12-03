import { Button } from '../../../components/ui/button'
import { useEffect, useState } from 'react'
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
import { Calendar as CalendarIcon, MapPin, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover'
import { format } from 'date-fns'
import { cn } from '../../../lib/utils'
import { type Listing, type AmenityType, type UtilityType } from '../../listings/types/listing'
import { listingsService } from '../../listings/services/listing'

interface ListingFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Listing>) => void
  initialData: Listing | null
  mode: 'create' | 'edit'
}

const amenitiesList: AmenityType[] = [
  'WIFI',
  'PARKING',
  'LAUNDRY',
  'DISHWASHER',
  'GYM',
  'POOL',
  'STUDY_ROOM',
  'TRASH_PICKUP',
  'CABLE_TV',
  'EV_CHARGING'
]

const utilitiesList: UtilityType[] = [
  'ELECTRICITY',
  'WATER',
  'GAS',
  'SEWER',
  'PEST_CONTROL'
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
  imageFiles: null,
  amenities: [] as AmenityType[],
  utilities: [] as UtilityType[],
  strictParking: false,
  strictNoisePolicy: false,
  guestsAllowed: false,
  petsAllowed: false,
  smokingAllowed: false,
  available: {
    from: '',
    to: ''
  }
}

interface ListingFormData {
  name: string
  description: string
  address: string
  location: {
    lat: string | number
    lng: string | number
  }
  price: string | number
  bedCount: string | number
  bathCount: string | number
  imageFiles: FileList | null
  amenities: AmenityType[]
  utilities: UtilityType[]
  strictParking: boolean
  strictNoisePolicy: boolean
  guestsAllowed: boolean
  petsAllowed: boolean
  smokingAllowed: boolean
  available: {
    from: string
    to: string
  }
}

interface ImagePreview {
  url: string
  file?: File
  id: string
}

const ListingForm = ({ isOpen, onClose, onSubmit, initialData, mode }: ListingFormProps) => {
  const form = useForm<ListingFormData>({
    defaultValues: emptyFormValues
  })

  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([])

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      form.reset({
        ...initialData,
        price: initialData.price.toString(),
        bedCount: initialData.bedCount.toString(),
        bathCount: initialData.bathCount.toString(),
        location: {
          lat: initialData.location.lat.toString(),
          lng: initialData.location.lng.toString()
        },
        strictParking: initialData.policies.strictParking,
        strictNoisePolicy: initialData.policies.strictNoisePolicy,
        guestsAllowed: initialData.policies.guestsAllowed,
        petsAllowed: initialData.policies.petsAllowed,
        smokingAllowed: initialData.policies.smokingAllowed,
        available: {
          from: initialData.available.from,
          to: initialData.available.to
        },
        imageFiles: null,
        amenities: initialData.amenities,
        utilities: initialData.utilities
      })

      if (initialData.imageUrl?.length) {
        setImagePreviews(
          initialData.imageUrl.map((url) => ({
            url,
            id: crypto.randomUUID()
          }))
        )
      }
    } else {
      form.reset(emptyFormValues)
      setImagePreviews([])
    }
  }, [mode, initialData, form, isOpen])

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Current location:', position)

          form.setValue('location.lat', position.coords.latitude.toString())
          form.setValue('location.lng', position.coords.longitude.toString())
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])

    const newPreviews = files.map(async (file) => {
      return await new Promise<ImagePreview>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          resolve({
            url: reader.result as string,
            file,
            id: crypto.randomUUID()
          })
        }
        reader.readAsDataURL(file)
      })
    })

    void Promise.all(newPreviews).then((newPreviewsArray) => {
      setImagePreviews((prev) => [...prev, ...newPreviewsArray])
    })

    form.setValue('imageFiles', e.target.files)
  }

  const handleRemoveImage = (idToRemove: string) => {
    setImagePreviews((prev) => prev.filter((preview) => preview.id !== idToRemove))

    const remainingFiles = imagePreviews.filter((preview) => preview.id !== idToRemove)
      .map((preview) => preview.file).filter((file): file is File => file !== undefined)

    const newFileList = new DataTransfer()
    remainingFiles.forEach((file) => newFileList.items.add(file))
    form.setValue('imageFiles', newFileList.files)
  }

  const handleSubmit = async (data: ListingFormData) => {
    const filesToUpload = imagePreviews.filter(preview => preview.file)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .map(preview => preview.file!)

    const existingUrls = imagePreviews.filter(preview => !preview.file)
      .map(preview => preview.url)

    let newImageUrls: string[] = []
    if (filesToUpload.length > 0) {
      const formData = new FormData()
      filesToUpload.forEach((file) => {
        formData.append('image', file)
      })

      try {
        newImageUrls = await listingsService.uploadPhoto(formData)
        console.log(newImageUrls)
      } catch (error) {
        console.log('Error uploading files:', error)
        return
      }
    }

    const transformedData = {
      name: data.name,
      description: data.description,
      bedCount: parseInt(data.bedCount?.toString() ?? '0'),
      bathCount: parseInt(data.bathCount?.toString() ?? '0'),
      address: data.address,
      price: parseFloat(data.price?.toString() ?? '0'),
      location: {
        lat: parseFloat(data.location?.lat?.toString() ?? '0'),
        lng: parseFloat(data.location?.lng?.toString() ?? '0')
      },
      available: {
        from: data.available?.from,
        to: data.available?.to
      },
      imageUrl: [...existingUrls, ...newImageUrls],
      amenities: data.amenities ?? [],
      utilities: data.utilities ?? [],
      policies: {
        strictParking: data.strictParking,
        strictNoisePolicy: data.strictNoisePolicy,
        guestsAllowed: data.guestsAllowed,
        petsAllowed: data.petsAllowed,
        smokingAllowed: data.smokingAllowed
      }
    }

    onSubmit(transformedData)
    onClose()
  }

  const formatDate = (date: Date | undefined): string => {
    if (!date) return ''
    return format(date, 'LLL dd, y')
  }

  const formatAmenityLabel = (amenity: string): string => {
    return amenity
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="form-dialog">
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
                    <Input {...field} required />
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
              <div className="col-span-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGetLocation}
                  className="w-full mb-2"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Use Current Location
                </Button>
              </div>
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
              name="imageFiles"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Property Images</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        {...field}
                      />
                      {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          {imagePreviews.map((preview) => (
                            <div key={preview.id} className="relative group">
                              <img
                                src={preview.url}
                                alt="Property preview"
                                className="w-full h-32 object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => { handleRemoveImage(preview.id) }}
                                className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
                          {formatAmenityLabel(amenity.replace(/_/g, ' '))}
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
                          {formatAmenityLabel(utility.replace(/_/g, ' '))}
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
                    name={key as any}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
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
