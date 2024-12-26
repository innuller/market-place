// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/datatable';
import { api } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function FiltersPage() {
  const [filters, setFilters] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFilter, setEditingFilter] = useState(null);
  const [formData, setFormData] = useState({ filter_key: '', filter_label: '', filter_values: '' });
  const { toast } = useToast();

  useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = async () => {
    try {
      const data = await api.getFilters();
      setFilters(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error loading filters',
        description: 'There was a problem loading the filters.',
      });
    }
  };

  const handleAdd = () => {
    setEditingFilter(null);
    setFormData({ filter_key: '', filter_label: '', filter_values: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (filter:any) => {
    setEditingFilter(filter);
    setFormData({
      filter_key: filter.filter_key,
      filter_label: filter.filter_label,
      filter_values: filter.filter_values.join(','),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id:any) => {
    try {
      await api.deleteFilter(id);
      await loadFilters();
      toast({
        description: 'Filter deleted successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error deleting filter',
        description: 'There was a problem deleting the filter.',
      });
    }
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const valuesArray = formData.filter_values.split(',').map((v) => v.trim());

    try {
      if (editingFilter) {
        await api.updateFilter(editingFilter!.id, {
          filter_key: formData.filter_key,
          filter_label: formData.filter_label,
          filter_values: valuesArray,
        });
        toast({
          description: 'Filter updated successfully.',
        });
      } else {
        await api.createFilter({
          filter_key: formData.filter_key,
          filter_label: formData.filter_label,
          filter_values: valuesArray,
        });
        toast({
          description: 'Filter created successfully.',
        });
      }
      await loadFilters();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: `Error ${editingFilter ? 'updating' : 'creating'} filter`,
        description: 'There was a problem with your request.',
      });
    }
  };

  const columns = [
    { key: 'filter_key', label: 'Filter Key' },
    { key: 'filter_label', label: 'Filter Label' },
    { key: 'filter_values', label: 'Filter Values' },
  ];

  return (
    <div className="container mx-auto py-8">
      <DataTable
        data={filters}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingFilter ? 'Edit Filter' : 'Add New Filter'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Filter Key"
                value={formData.filter_key}
                onChange={(e) => setFormData({ ...formData, filter_key: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                placeholder="Filter Label"
                value={formData.filter_label}
                onChange={(e) => setFormData({ ...formData, filter_label: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                placeholder="Filter Values (comma-separated)"
                value={formData.filter_values}
                onChange={(e) => setFormData({ ...formData, filter_values: e.target.value })}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit">
                {editingFilter ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}
