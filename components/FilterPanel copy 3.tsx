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
import { api } from '@/lib/api'

const filterDisplayNames: Record<string, string> = {
  categories: "Industry Categories",
  total_employees: "Company Size",
  compliance_standards: "Compliance",
  hsn_codes: "HSN Codes",
  logistic_access: "Logistics Access"
}

const filterOptions: Record<string, Array<{ value: string; label: string }>> = {
  categories: [
    { value: "Manufacturing", label: "Manufacturing" },
    { value: "Technology", label: "Technology" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Finance", label: "Finance" },
    { value: "Retail", label: "Retail" },
    { value: "Education", label: "Education" }
  ],
  total_employees: [
    { value: "1-49", label: "Small (1-49)" },
    { value: "50-100", label: "Medium (50-100)" },
    { value: "100-500", label: "Large (100-500)" }
  ],
  compliance_standards: [
    { value: "ISO 9001:2015", label: "ISO 9001:2015" },
    { value: "ISO 14001:2015", label: "ISO 14001:2015" }
  ],
  hsn_codes: [
    { value: "HSN1", label: "HSN1" },
    { value: "HSN2", label: "HSN2" }
  ],
  logistic_access: [
    { value: "LAND_ROAD", label: "Land Road" },
    { value: "MOTORWAY", label: "Motorway" },
    { value: "RAILWAY", label: "Railway" },
    { value: "RIVERPORT", label: "River Port" },
    { value: "AIRPORT", label: "Airport" },
    { value: "SEAPORT", label: "Seaport" }
  ]
}

interface FilterPanelProps {
  filters: Record<string, string[]>
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
}

interface FilterSectionProps {
  filterKey: string
  options: Array<{ value: string; label: string }>
  selectedFilters: string[]
  onFilterChange: (key: string, value: string) => void
}

const FilterSection = ({ filterKey, options, selectedFilters, onFilterChange }: FilterSectionProps) => {
  return (
    <AccordionItem value={filterKey} className="border-b border-white/10">
      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5">
        <span className="flex items-center gap-2 text-white">
          {filterDisplayNames[filterKey]}
          {selectedFilters.length > 0 && (
            <Badge variant="secondary" className="ml-auto bg-[#7AB80E] text-white">
              {selectedFilters.length}
            </Badge>
          )}
        </span>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-3">
        <div className="space-y-2">
          {options.map(({ value, label }) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox
                id={`${filterKey}-${value}`}
                checked={selectedFilters.includes(value)}
                onCheckedChange={() => onFilterChange(filterKey, value)}
                className="border-white/50 data-[state=checked]:bg-[#7AB80E] data-[state=checked]:border-[#7AB80E]"
              />
              <label
                htmlFor={`${filterKey}-${value}`}
                className="text-sm leading-none text-white/80 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export default function FilterPanel({ filters, setFilters }: FilterPanelProps) {
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await api.getFilters()
        setFilters(data)  
      } catch (error) {
        console.error('Error fetching filters:', error)
      }
    }
    fetchFilters()
  }, [setFilters])

  const totalActiveFilters = Object.values(filters || {}).flat().length

  const clearAllFilters = () => {
    setFilters({})
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev };
      if (!updatedFilters[key]) {
        updatedFilters[key] = [];
      }
      updatedFilters[key] = updatedFilters[key].includes(value)
        ? updatedFilters[key].filter((v) => v !== value)
        : [...updatedFilters[key], value];
      console.log("Filters updated:", updatedFilters);
      return updatedFilters;
    })
  }

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
        <Accordion type="multiple" className="w-full" defaultValue={Object.keys(filterOptions)}>
          {Object.entries(filterOptions).map(([key, options]) => (
            <FilterSection
              key={key}
              filterKey={key}
              options={options}
              selectedFilters={filters[key] || []}
              onFilterChange={handleFilterChange}
            />
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