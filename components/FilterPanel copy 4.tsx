'use client'

import { useState, useEffect } from 'react'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

type FilterType = 'array' | 'string' | 'number' | 'boolean' | 'object'

interface Filter {
  id: string
  name: string
  field: string
  type: FilterType
  options?: string[]
  min?: number
  max?: number
  step?: number
}

interface FilterPanelProps {
  filters: Record<string, string[]>
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
}

interface FilterSectionProps {
  filter: Filter
  selectedFilters: string[]
  onFilterChange: (field: string, value: string[]) => void
}

const FilterSection = ({ filter, selectedFilters, onFilterChange }: FilterSectionProps) => {
  switch (filter.type) {
    case 'array':
      return (
        <div className="space-y-2">
          {filter.options?.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${filter.field}-${option}`}
                checked={selectedFilters.includes(option)}
                onCheckedChange={(checked) => {
                  const newValue = checked
                    ? [...selectedFilters, option]
                    : selectedFilters.filter((item) => item !== option);
                  onFilterChange(filter.field, newValue);
                }}
                className="border-white/50 data-[state=checked]:bg-[#7AB80E] data-[state=checked]:border-[#7AB80E]"
              />
              <label
                htmlFor={`${filter.field}-${option}`}
                className="text-sm leading-none text-white/80 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      )
    case 'string':
      return (
        <Input
          type="text"
          value={selectedFilters[0] || ''}
          onChange={(e) => onFilterChange(filter.field, [e.target.value])}
          className="bg-white/10 text-white border-white/20"
        />
      )
    case 'number':
      return (
        <div className="space-y-2">
          <Slider
            min={filter.min}
            max={filter.max}
            step={filter.step}
            value={[parseInt(selectedFilters[0]) || filter.min || 0]}
            onValueChange={(value) => onFilterChange(filter.field, [value[0].toString()])}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-white/70">
            <span>{filter.min}</span>
            <span>{selectedFilters[0] || filter.min}</span>
            <span>{filter.max}</span>
          </div>
        </div>
      )
    case 'boolean':
      return (
        <div className="flex items-center space-x-2">
          <Switch
            id={`${filter.field}-switch`}
            checked={selectedFilters[0] === 'true'}
            onCheckedChange={(checked) => onFilterChange(filter.field, [checked.toString()])}
            className="data-[state=checked]:bg-[#7AB80E]"
          />
          <label
            htmlFor={`${filter.field}-switch`}
            className="text-sm leading-none text-white/80"
          >
            {filter.name}
          </label>
        </div>
      )
    default:
      return null
  }
}

export default function FilterPanel({ filters, setFilters }: FilterPanelProps) {
  const [dynamicFilters, setDynamicFilters] = useState<Filter[]>([])

  useEffect(() => {
    fetchFilters()
  }, [])

  async function fetchFilters() {
    const { data, error } = await supabase.from('filters').select('*')
    if (error) {
      console.error('Error fetching filters:', error)
    } else {
      setDynamicFilters(data)
    }
  }

  const totalActiveFilters = Object.values(filters || {}).filter(value => value.length > 0).length

  const clearAllFilters = () => {
    setFilters({})
  }

  const handleFilterChange = (field: string, value: string[]) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev };
      if (value.length === 0) {
        delete updatedFilters[field];
      } else {
        updatedFilters[field] = value;
      }
      console.log('Filters updated in FilterPanel:', updatedFilters);
      return updatedFilters;
    });
  };

  const FilterContent = () => (
    <div className="h-full flex flex-col bg-[#003853]">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-white" />
          <h2 className="font-semibold text-lg text-white">Filters</h2>
          {totalActiveFilters > 0 && (
            <Badge variant="secondary" className="bg-[#7AB80E] text-white">
              {totalActiveFilters}
            </Badge>
          )}
        </div>
        {totalActiveFilters > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-white hover:text-white/80 hover:bg-white/10"
          >
            Clear all
          </Button>
        )}
      </div>
      <Separator className="my-2 bg-white/10" />
      <ScrollArea className="flex-1">
        <Accordion type="multiple" className="w-full" defaultValue={dynamicFilters.map(filter => filter.id)}>
          {dynamicFilters.map((filter) => (
            <AccordionItem key={filter.id} value={filter.id} className="border-b border-white/10">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5">
                <span className="flex items-center gap-2 text-white">
                  {filter.name}
                  {filters[filter.field]?.length > 0 && (
                    <Badge variant="secondary" className="ml-auto bg-[#7AB80E] text-white">
                      {filters[filter.field].length}
                    </Badge>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <FilterSection
                  filter={filter}
                  selectedFilters={filters[filter.field] || []}
                  onFilterChange={handleFilterChange}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  )

  return (
    <>
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg bg-[#7AB80E] hover:bg-[#8BC727]">
              <Filter className="h-6 w-6 text-white" />
              {totalActiveFilters > 0 && (
                <Badge
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-[#003853] text-white"
                >
                  {totalActiveFilters}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md p-0 bg-[#003853]">
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden lg:block w-64 border-r border-white/10 bg-[#003853]">
        <FilterContent />
      </aside>
    </>
  )
}

