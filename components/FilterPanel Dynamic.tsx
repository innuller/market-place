'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

type FilterValue = string;

type Filter = {
  id: string;
  filter_key: string;
  filter_label: string;
  filter_values: FilterValue[];
};

type SelectedFilters = {
  [key: string]: FilterValue[];
};

const FilterPanel: React.FC<{ onFilterChange: (filters: SelectedFilters) => void }> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch filters dynamically
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await api.getFilters();
        setFilters(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching filters:', error);
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  // Handle checkbox toggle
  const handleCheckboxChange = (filterKey: string, value: FilterValue, isChecked: boolean) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterKey] || [];
      const updatedValues = isChecked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);

      const updatedFilters = { ...prev, [filterKey]: updatedValues };

      // Clean up empty filters
      if (updatedValues.length === 0) {
        delete updatedFilters[filterKey];
      }

      onFilterChange(updatedFilters); // Notify parent of changes
      return updatedFilters;
    });
  };

  // Clear all selected filters
  const clearFilters = () => {
    setSelectedFilters({});
    onFilterChange({});
  };

  return (
    <div className="filter-panel space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="secondary" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>
      {loading ? (
        <Spinner size="large" />
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {filters.map((filter) => (
            <AccordionItem key={filter.id} value={filter.filter_key}>
              <AccordionTrigger>{filter.filter_label}</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {filter.filter_values.map((value) => (
                    <li key={value}>
                      <Checkbox
                        id={`${filter.filter_key}-${value}`}
                        checked={selectedFilters[filter.filter_key]?.includes(value) || false}
                        onCheckedChange={(isChecked) =>
                          handleCheckboxChange(filter.filter_key, value, isChecked as boolean)
                        }
                      />
                      <label htmlFor={`${filter.filter_key}-${value}`} className="ml-2">
                        {value}
                      </label>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default FilterPanel;
