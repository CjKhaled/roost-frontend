import { useState } from 'react'
import {
  Calendar as CalendarIcon,
  Filter
} from 'lucide-react'

import { Button } from '../../../components/ui/button'

import { Slider } from '../../../components/ui/slider'
import { Label } from '../../../components/ui/label'
import { Checkbox } from '../../../components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../components/ui/popover'
import { format } from 'date-fns'
import { type DateRange } from 'react-day-picker'
import { Calendar as CalendarComponent } from '../../../components/ui/calendar'
import { cn } from '../../../lib/utils'
import { type Listing, type AmenityType } from '../types/listing'

interface FilterState {
  price: number
  bedCount: number | ''
  bathCount: number | ''
  amenities: AmenityType[]
  dateRange: DateRange | undefined
}

interface FilterPopoverProps {
  onFiltersChange: (filters: FilterState) => void
  listings: Listing[]
}

const FilterPopover = ({ onFiltersChange, listings }: FilterPopoverProps): JSX.Element => {
  const calculatePriceRange = (listings: Listing[]): [number, number] => {
    const prices = listings.map(l => l.price)
    const minPrice = Math.floor(Math.min(...prices) / 100) * 100
    const maxPrice = Math.ceil(Math.max(...prices) / 1000) * 1000
    return [minPrice, maxPrice]
  }

  const [minPrice, maxPrice] = calculatePriceRange(listings)

  const [filters, setFilters] = useState<FilterState>({
    price: maxPrice,
    bedCount: '',
    bathCount: '',
    amenities: [],
    dateRange: undefined
  })

  const ALL_AMENITIES: AmenityType[] = [
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

  const handleFilterChange = (key: keyof FilterState, value: FilterState[keyof FilterState]): void => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = (): void => {
    const resetFilters: FilterState = {
      price: maxPrice,
      bedCount: '',
      bathCount: '',
      amenities: [],
      dateRange: undefined
    }
    setFilters(resetFilters)
    onFiltersChange(resetFilters)
  }

  const formatDate = (date: Date | undefined): string => {
    if (!date) return ''
    return format(date, 'LLL dd, y')
  }

  return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className='h-9 px-3 roost-button flex items-center gap-2 hover:bg-amber-50'
          >
            <Filter className='h-4 w-4' />
            <span className='text-sm font-medium'>Filters</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-80 p-4' align='start'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h4 className='font-semibold text-amber-900'>Filters</h4>
              <Button
                variant='ghost'
                size='sm'
                onClick={clearFilters}
                className='h-8 px-2 text-sm text-amber-600 hover:text-amber-700 hover:bg-amber-50'
              >
                Clear all
              </Button>
            </div>

            {/* Price Range */}
            <div className='space-y-2'>
              <Label className='text-amber-900'>Maximum Price</Label>
              <div className='pt-2'>
                <Slider
                  value={[filters.price]}
                  min={minPrice}
                  max={maxPrice}
                  step={100}
                  onValueChange={(value) => {
                    handleFilterChange('price', value[0])
                  }}
                  className='[&_[role=slider]]:bg-amber-600'
                />
              </div>
              <div className='flex items-center justify-between text-sm text-amber-700'>
                <span>Up to ${filters.price}</span>
              </div>
            </div>

            {/* Bedrooms */}
            <div className='space-y-2'>
              <Label className='text-amber-900'>Bedrooms</Label>
              <div className='flex gap-2'>
                {[1, 2, 3, 4].map((num) => (
                  <Button
                    key={num}
                    variant='outline'
                    size='sm'
                    className={`flex-1 ${
                        filters.bedCount === num
                          ? 'bg-amber-600 text-white hover:bg-amber-700'
                          : 'hover:bg-amber-50 border-amber-200'
                      }`}
                    onClick={() => { handleFilterChange('bedCount', filters.bedCount === num ? '' : num) }}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            {/* Bathrooms */}
            <div className='space-y-2'>
              <Label className='text-amber-900'>Bathrooms</Label>
              <div className='flex gap-2'>
                {[1, 2, 3].map((num) => (
                  <Button
                    key={num}
                    variant='outline'
                    size='sm'
                    className={`flex-1 ${
                        filters.bathCount === num
                          ? 'bg-amber-600 text-white hover:bg-amber-700'
                          : 'hover:bg-amber-50 border-amber-200'
                      }`}
                    onClick={() => { handleFilterChange('bathCount', filters.bathCount === num ? '' : num) }}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className='space-y-2'>
            <Label className='text-amber-900'>Amenities</Label>
            <div className='grid grid-cols-2 gap-2'>
              {ALL_AMENITIES.map((amenity) => (
                <div key={amenity} className='flex items-center space-x-2'>
                  <Checkbox
                    id={amenity}
                    checked={filters.amenities.includes(amenity)}
                    onCheckedChange={(checked: boolean | 'indeterminate') => {
                      if (typeof checked === 'boolean') {
                        handleFilterChange('amenities',
                          checked
                            ? [...filters.amenities, amenity] as AmenityType[]
                            : filters.amenities.filter(a => a !== amenity)
                        )
                      }
                    }}
                    className='border-amber-200 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600'
                  />
                  <label
                    htmlFor={amenity}
                    className='text-sm text-amber-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>

            {/* Availability */}
            <div className='space-y-2'>
                <Label className='text-amber-900'>Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'w-full justify-start text-left font-normal border-amber-200 hover:bg-amber-50',
                        !filters.dateRange && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                        {filters.dateRange?.from
                          ? (
                              filters.dateRange.to
                                ? (
                            <>
                              {formatDate(filters.dateRange.from as Date | undefined)} -
                              {' '}
                              {formatDate(filters.dateRange.to as Date | undefined)}
                            </>
                                  )
                                : (
                                    formatDate(filters.dateRange.from as Date | undefined)
                                  )
                            )
                          : (
                          <span>Select date range</span>
                            )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <CalendarComponent
                      initialFocus
                      mode='range'
                      defaultMonth={filters.dateRange?.from}
                      selected={filters.dateRange}
                      onSelect={(dateRange) => {
                        handleFilterChange('dateRange', dateRange)
                      }}
                      numberOfMonths={2}
                      className='rounded-md border border-amber-200'
                    />
                  </PopoverContent>
                </Popover>
              </div>

            {/* Apply Filters Button */}
            <Button
              className='w-full bg-amber-600 hover:bg-amber-700 text-white'
              onClick={() => { onFiltersChange(filters) }}
            >
              Apply Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>
  )
}

export default FilterPopover
