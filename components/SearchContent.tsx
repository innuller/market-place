// app/search/SearchContent.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import FilterPanel from '@/components/FilterPanel';
import ResultsPanel from '@/components/ResultsPanel';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

interface Organization {
  id: string;
  organization_name: string;
  email: string;
  metadata: Record<string, any>;
}

export default function SearchContent() {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [results, setResults] = useState<Organization[]>([]);
  const searchParams = useSearchParams();

  const fetchData = useCallback(async () => {
    const searchType = searchParams.get('type') || 'all';
    const searchQuery = searchParams.get('query') || '';

    console.log('Calling RPC with:', { searchType, searchQuery });

    const { data, error } = await supabase.rpc('search_organizations_2', {
      search_type: searchType,
      search_query: searchQuery,
    });

    if (error) {
      console.error('Error calling RPC:', error);
    } else {
      console.log('RPC results:', data);
      setResults(data);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (newFilters: Record<string, string[]>) => {
    console.log('Filters updated:', newFilters);
    setFilters(newFilters);
  };

  const fetchFilteredResults = async (filters: Record<string, string[]>) => {
    if (!filters || Object.keys(filters).length === 0) {
      console.error('Filters must be a valid object');
      return;
    }
  
    try {
      // Fetch filter definitions to identify numeric filters
      const { data: filterDefinitions, error: filterError } = await supabase
        .from('filters')
        .select('*');
      
      if (filterError) {
        console.error('Error fetching filter definitions:', filterError);
        return;
      }

      // Create a map of filter fields to their types
      const filterTypes = filterDefinitions.reduce((acc: Record<string, string>, filter: any) => {
        acc[filter.field] = filter.type;
        return acc;
      }, {});
      
      // Format filters and convert numeric values
      const formattedFilters = Object.entries(filters).reduce((acc, [key, values]) => {
        // Handle nested object array filters (e.g., major_projects.name)
        if (key.includes('.')) {
          const [arrayField, objectKey] = key.split('.');
          acc[arrayField] = {
            key: objectKey,
            values: Array.isArray(values) ? values : [values],
            type: 'object_array'
          };
        }
        // Check if this is a numeric filter
        else if (filterTypes[key] === 'number') {
          // Convert string values to numbers for numeric filters
          acc[key] = Array.isArray(values) 
            ? values.map(val => parseFloat(val) || 0) 
            : [parseFloat(values[0]) || 0];
        } else {
          // Keep as strings for non-numeric filters
          acc[key] = Array.isArray(values) ? values : [values];
        }
        return acc;
      }, {} as Record<string, any>);
  
      console.log('Formatted filters with type conversion:', formattedFilters);
  
      const { data, error } = await supabase.rpc('filter_organizations', {
        filters: formattedFilters,
      });
  
      if (error) {
        console.error('Error calling RPC:', error);
      } else {
        console.log('Filtered results:', data);
        setResults(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      fetchFilteredResults(filters);
    } else {
      fetchData();
    }
  }, [filters, fetchData]);

  return (
    <div className="flex h-screen">
      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        onFilterUpdate={handleFilterChange}
      />
      <div className="flex-1 overflow-hidden">
        <ResultsPanel results={results} />
      </div>
    </div>
  );
}