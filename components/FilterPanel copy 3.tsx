// Updated FilterPanel.tsx to sync filters with ResultsPanel
'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

type FilterType = 'array' | 'string' | 'number' | 'boolean' | 'object';

interface Filter {
  id: string;
  name: string;
  field: string;
  type: FilterType;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

interface FilterPanelProps {
  filters: Record<string, string[]>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  onFilterUpdate: (filters: Record<string, string[]>) => void; // Notify parent
}

interface FilterSectionProps {
  filter: Filter;
  selectedFilters: string[];
  onFilterChange: (field: string, value: string[]) => void;
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
      );
    case 'string':
      return (
        <Input
          type="text"
          value={selectedFilters[0] || ''}
          onChange={(e) => onFilterChange(filter.field, [e.target.value])}
          className="bg-white/10 text-white border-white/20"
        />
      );
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
          <div className="flex justify-between items-center space-x-2">
            <Input
              type="number"
              min={filter.min}
              max={filter.max}
              value={selectedFilters[0] || filter.min}
              onChange={(e) => onFilterChange(filter.field, [e.target.value])}
              className="w-full bg-white/10 text-white border-white/20"
            />
            <span className="text-sm text-white/70">Max: {filter.max}</span>
          </div>
        </div>
      );
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
      );
    default:
      return null;
  }
};

export default function FilterPanel({ filters, setFilters, onFilterUpdate }: FilterPanelProps) {
  const [dynamicFilters, setDynamicFilters] = useState<Filter[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFilters();
  }, []);

  async function fetchFilters() {
    const { data, error } = await supabase.from('filters').select('*');
    if (error) {
      console.error('Error fetching filters:', error);
    } else {
      setDynamicFilters(data);
    }
  }

  // const handleFilterChange = useCallback((field: string, value: string[]) => {
  //   setFilters((prev) => {
  //     const updatedFilters = { ...prev };
  //     if (value.length === 0) {
  //       delete updatedFilters[field];
  //     } else {
  //       updatedFilters[field] = value;
  //     }
  //     onFilterUpdate(updatedFilters); // Notify parent of the changes.
  //     return updatedFilters;
  //   });
  // }, [setFilters, onFilterUpdate]);

  const handleFilterChange = useCallback((field: string, value: string[]) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev };
      if (value.length === 0) {
        delete updatedFilters[field];
      } else {
        updatedFilters[field] = value;
      }
      onFilterUpdate(updatedFilters); // Notify parent when filters change
      return updatedFilters;
    });
  }, [setFilters, onFilterUpdate]);
  

  const FilterContent = useMemo(() => (
    <div className="h-full flex flex-col bg-[#003853]">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-white" />
          <h2 className="font-semibold text-lg text-white">Filters</h2>
        </div>
        {Object.values(filters).some((v) => v.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilters({});
              onFilterUpdate({});
            }}
            className="text-white hover:text-white/80 hover:bg-white/10"
          >
            Clear All
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <Accordion type="multiple" className="w-full">
          {dynamicFilters.map((filter) => (
            <AccordionItem key={filter.id} value={filter.id} className="border-b border-white/10">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5">
                <span className="flex items-center gap-2 text-white">
                  {filter.name}
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
  ), [filters, dynamicFilters, handleFilterChange]);

  return (
    <aside className="w-64 border-r border-white/10 bg-[#003853]">
      {FilterContent}
    </aside>
  );
}