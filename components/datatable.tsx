import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, Plus } from 'lucide-react';
import {Category, ComplianceStandard, Organization, OrganizationCategory, OrganizationSubCategory} from '@/types/types'

interface DataTableProps<T> {
  data: T[];
  columns: { key: keyof T; label: string }[];
  onEdit: (item: T) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}


export function DataTable<T extends { id: number }>({ 
  data, 
  columns, 
  onEdit, 
  onDelete, 
  onAdd 
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Data</h2>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus size={16} /> Add New
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key as string}>{column.label}</TableHead>
              ))}
              <TableHead>Actionss</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={`${item.id}-${column.key as string}`}>
                    {String(item[column.key])}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(item.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
