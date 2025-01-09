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

export default function SearchPage() {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [results, setResults] = useState<Organization[]>([]);
  const searchParams = useSearchParams();

  const fetchData = useCallback(async () => {
    const searchType = searchParams.get('type') || 'all';
    const searchQuery = searchParams.get('query') || '';

    console.log('Fetching data with filterssss:', filters, 'searchType:', searchType, 'searchQuery:', searchQuery);

    let query = supabase.from('organizations_main').select('*');
    // let query: any;

    // Apply search based on type
    if (searchQuery) {
      switch (searchType) {
        case 'supplier':
          query = query.ilike('organization_name', `%${searchQuery}%`);
          break;
        case 'product_service':
          query = query.filter('metadata->products_services', 'cs', `[{"name": "${searchQuery}"}]`);
          break;
        case 'catalog':
          query = query.filter('metadata->products_services', 'cs', `[{"catalog":"${searchQuery}]"}`);
          break;
        case 'all':
        default:
          // query = query.or(`organization_name.ilike.%${searchQuery}%,metadata->products_services->name.ilike.%${searchQuery}%,metadata->products_services->catalog.ilike.%${searchQuery}%`);
          query = query.ilike('organization_name', `%${searchQuery}%`);
          break;
      }
    }

    // Apply additional filters
    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        if (Array.isArray(values) && values.length > 1) {
          // For array type filters
          query = query.contains(`metadata->${key}`, values);
        } else {
          const value = values[0];
          if (value === 'true' || value === 'false') {
            // Boolean filters
            query = query.eq(`metadata->>${key}`, value);
          } else if (!isNaN(Number(value))) {
            // Number filters
            query = query.gte(`metadata->>${key}`, value);
          } else {
            // String filters
            query = query.ilike(`metadata->>${key}`, `%${value}%`);
          }
        }
      }
    });

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching data:', error);
    } else {
      console.log('Fetched results:', data);
      setResults(data as Organization[]);
    }
  }, [filters, searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (newFilters: Record<string, string[]>) => {
    console.log('Filters updated:', newFilters);
    setFilters(newFilters);
  };

  return (
    <div className="flex h-screen">
      <FilterPanel filters={filters} setFilters={handleFilterChange} />
      <div className="flex-1 overflow-hidden">
        <ResultsPanel results={results} />
      </div>
    </div>
  );
}

