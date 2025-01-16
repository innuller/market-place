// pages/admin/filters.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const supabase = createClient();

interface Filter {
  id: string;
  name: string;
  field: string;
  type: string;
  options: string[] | null;
  min: number | null;
  max: number | null;
  step: number | null;
}

export default function ManageFilters() {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editFilter, setEditFilter] = useState<Filter | null>(null);

  useEffect(() => {
    fetchFilters();
  }, []);

  async function fetchFilters() {
    const { data, error } = await supabase.from('filters').select('*');
    if (error) {
      console.error('Error fetching filters:', error);
    } else {
      setFilters(data);
    }
  }

  async function handleSave() {
    if (!editFilter) return;

    const { id, ...payload } = editFilter;
    const { error } = id
      ? await supabase.from('filters').update(payload).eq('id', id)
      : await supabase.from('filters').insert(payload);

    if (error) {
      console.error('Error saving filter:', error);
    } else {
      setDialogOpen(false);
      setEditFilter(null);
      fetchFilters();
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('filters').delete().eq('id', id);
    if (error) {
      console.error('Error deleting filter:', error);
    } else {
      fetchFilters();
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Manage Filters</h1>
        <Button onClick={() => {
          setEditFilter({
            id: '',
            name: '',
            field: '',
            type: 'string',
            options: null,
            min: null,
            max: null,
            step: null,
          });
          setDialogOpen(true);
        }}>
          Add Filter
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Field</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filters.map((filter) => (
            <TableRow key={filter.id}>
              <TableCell>{filter.name}</TableCell>
              <TableCell>{filter.field}</TableCell>
              <TableCell>{filter.type}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditFilter(filter);
                      setDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(filter.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editFilter?.id ? 'Edit Filter' : 'Add Filter'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editFilter?.name || ''}
                onChange={(e) =>
                  setEditFilter((prev) => prev && { ...prev, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="field">Field</Label>
              <Input
                id="field"
                value={editFilter?.field || ''}
                onChange={(e) =>
                  setEditFilter((prev) => prev && { ...prev, field: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={editFilter?.type || 'string'}
                onValueChange={(value) =>
                  setEditFilter((prev) => prev && { ...prev, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="array">Array</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {editFilter?.type === 'array' && (
              <div>
                <Label htmlFor="options">Options (comma-separated)</Label>
                <Input
                  id="options"
                  value={editFilter?.options?.join(', ') || ''}
                  onChange={(e) =>
                    setEditFilter((prev) =>
                      prev && { ...prev, options: e.target.value.split(',').map((o) => o.trim()) }
                    )
                  }
                />
              </div>
            )}
            {editFilter?.type === 'number' && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="min">Min</Label>
                  <Input
                    id="min"
                    type="number"
                    value={editFilter?.min || ''}
                    onChange={(e) =>
                      setEditFilter((prev) => prev && { ...prev, min: parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="max">Max</Label>
                  <Input
                    id="max"
                    type="number"
                    value={editFilter?.max || ''}
                    onChange={(e) =>
                      setEditFilter((prev) => prev && { ...prev, max: parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="step">Step</Label>
                  <Input
                    id="step"
                    type="number"
                    value={editFilter?.step || ''}
                    onChange={(e) =>
                      setEditFilter((prev) => prev && { ...prev, step: parseFloat(e.target.value) })
                    }
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
