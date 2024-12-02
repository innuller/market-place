'use client';

import { useState, useEffect } from 'react';
import FilterPanel from '@/components/FilterPanel';
import ResultsPanel from '@/components/ResultsPanel';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

interface Organization {
  id: number;
  organization_name: string;
  email: string;
  metadata: Record<string, any>;
}

export default function OrganizationsPage() {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [results, setResults] = useState<Organization[]>([]);

  const fetchData = async () => {
    let query = supabase.from('organizations_main').select('*');

    Object.keys(filters).forEach((key) => {
      if (filters[key]?.length) {
        query = query.contains('metadata', { [key]: filters[key] });
      }
    });

    const { data, error } = await query;
    if (error) console.error('Error fetching data:', error);
    else setResults(data as Organization[]);
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return (
    <div className="flex">
      <FilterPanel filters={filters} setFilters={setFilters} />
      <ResultsPanel results={results} />
    </div>
  );
}