// app/organizations/page.tsx

"use client";

import { createClient } from '@/utils/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';

interface Organization {
  id: number;
  organization_name: string;
  email: string;
  office_address: string;
  office_pincode: string;
  // Add other relevant fields as needed
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      const { data, error } = await createClient()
        .from('organizations')
        .select('id, organization_name, email, office_address, office_pincode');

      if (error) setError(error.message);
      else setOrganizations(data || []);
      setLoading(false);
    };

    fetchOrganizations();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Organizations</h1>
      <Table className="w-full border">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Office Address</TableHead>
            <TableHead>Office Pincode</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((org) => (
            <TableRow key={org.id}>
              <TableCell>{org.id}</TableCell>
              <TableCell>{org.organization_name}</TableCell>
              <TableCell>{org.email}</TableCell>
              <TableCell>{org.office_address}</TableCell>
              <TableCell>{org.office_pincode}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
