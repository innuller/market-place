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
      const formattedFilters = Object.entries(filters).reduce((acc, [key, values]) => {
        acc[key] = Array.isArray(values) ? values : [values];
        return acc;
      }, {} as Record<string, string[]>);
  
      console.log('Formatted filters:', formattedFilters);
  
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