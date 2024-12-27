'use client';

import { useState, useEffect } from 'react';
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

export default function OrganizationsPage() {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [results, setResults] = useState<Organization[]>([]);

  const fetchData = async () => {
    let query = supabase.from('organizations_main').select('*');

    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        query = query.contains(`metadata->${key}`, values);
      }
    });

    const { data, error } = await query;
    if (error) console.error('Error fetching data:', error);
    else setResults(data as Organization[]);

    console.log('Fetched results:', data);
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return (
    <div className="flex h-screen">
      <FilterPanel filters={filters} setFilters={setFilters} />
      <div className="flex-1 overflow-hidden">
        <ResultsPanel results={results} />
      </div>
    </div>
  );
}

