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

  // const fetchData = useCallback(async () => {
  //   const searchType = searchParams.get('type') || 'all';
  //   const searchQuery = searchParams.get('query') || '';

  //   // console.log('Fetching data with filterssss:', filters, 'searchType:', searchType, 'searchQuery:', searchQuery);

  //   let query = supabase.from('organizations_main').select('*');

  //   // let query: any;

  //   // Apply search based on type
  //   // if (searchQuery) {
  //   //   switch (searchType) {
  //   //     case 'supplier':
  //   //       query = query.ilike('organization_name', `%${searchQuery}%`);
  //   //       break;
  //   //     case 'product_service':
  //   //       query = query.filter('metadata->products_services', 'cs', `[{"name": "${searchQuery}"}]`);
  //   //       break;
  //   //     case 'catalog':
  //   //       query = query.filter('metadata->products_services', 'cs', `[{"catalog":"${searchQuery}]"}`);
  //   //       break;
  //   //     case 'all':
  //   //     default:
  //   //       // query = query.or(`organization_name.ilike.%${searchQuery}%,metadata->products_services->name.ilike.%${searchQuery}%,metadata->products_services->catalog.ilike.%${searchQuery}%`);
  //   //       query = query.ilike('organization_name', `%${searchQuery}%`);
  //   //       break;
  //   //   }
  //   // }

  //   if (searchQuery) {
  //     switch (searchType) {
  //       case 'supplier':
  //         query = query.ilike('organization_name', `%${searchQuery}%`);
  //         break;
  //       case 'product_service':
  //         query = query.or(
  //           `metadata->products_services->>name.ilike.%${searchQuery}%`
  //         );
  //         break;
  //       case 'catalog':
  //         query = query.or(
  //           `metadata->products_services->>catalog.ilike.%${searchQuery}%`
  //         );
  //         break;
  //       case 'all':
  //       default:
  //         query = query.or(
  //           `organization_name.ilike.%${searchQuery}%,metadata->products_services->>name.ilike.%${searchQuery}%,metadata->products_services->>catalog.ilike.%${searchQuery}%`
  //         );
  //         break;
  //     }
  //   }


  //   console.log('Search Type:', searchType);
  //   console.log('Search Query:', searchQuery);
  //   console.log('Supabase Query:', query.toString())



  //   // Apply additional filters
  //   Object.entries(filters).forEach(([key, values]) => {
  //     if (values.length > 0) {
  //       if (Array.isArray(values) && values.length > 1) {
  //         // For array type filters
  //         query = query.contains(`metadata->${key}`, values);
  //       } else {
  //         const value = values[0];
  //         if (value === 'true' || value === 'false') {
  //           // Boolean filters
  //           query = query.eq(`metadata->>${key}`, value);
  //         } else if (!isNaN(Number(value))) {
  //           // Number filters
  //           query = query.gte(`metadata->>${key}`, value);
  //         } else {
  //           // String filters
  //           query = query.ilike(`metadata->>${key}`, `%${value}%`);
  //         }
  //       }
  //     }
  //   });

  //   const { data, error } = await query;
  //   if (error) {
  //     console.error('Error fetching data:', error);
  //   } else {
  //     console.log('Fetched results:', data);
  //     setResults(data as Organization[]);
  //   }
  // }, [filters, searchParams]);

  const fetchData = useCallback(async () => {
    const searchType = searchParams.get('type') || 'all';
    const searchQuery = searchParams.get('query') || '';

    console.log('Calling RPC with:', { searchType, searchQuery });

    const { data, error } = await supabase.rpc('search_organizations', {
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

  const fetchResultsWithFilters = async (filters) => {
    const { data, error } = await supabase.rpc('filter_organizations', {
      filters: JSON.stringify(filters),
    });

    if (error) {
      console.error('Error calling RPC:', error);
    } else {
      setResults(data);
    }
  };


  useEffect(() => {
    fetchResultsWithFilters(filters);
  }, [filters]);

  const validateFilters = (filters) => {
    return filters && typeof filters === 'object' && Object.keys(filters).length > 0;
  };
  
  const fetchFilteredResults = async (filters) => {
    if (!validateFilters(filters)) {
      console.error('Invalid filters:', filters);
      setResults([]); // Clear results if filters are invalid
      return;
    }
  
    try {
      const { data, error } = await supabase.rpc('filter_organizations', {
        filters: JSON.stringify(filters),
      });

      console.log('--->: ', filters);
      
  
      if (error) {
        console.error('Error calling RPC:', error);
      } else {
        setResults(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };
  
  
  




  return (
    <div className="flex h-screen">
      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        onFilterUpdate={(updatedFilters) => {
          setFilters(updatedFilters); // Update filters state
          fetchFilteredResults(updatedFilters); // Fetch results from RPC
        }}
      />
      <div className="flex-1 overflow-hidden">
        <ResultsPanel results={results} />
      </div>
    </div>
  );
}

