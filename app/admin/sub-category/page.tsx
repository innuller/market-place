// app/dashboard/sub-categories/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/datatable';
import { api } from '@/lib/api';
import { OrganizationSubCategory } from '@/types/types';
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

export default function SubCategoriesPage() {
  const [subCategories, setSubCategories] = useState<OrganizationSubCategory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<OrganizationSubCategory | null>(null);
  const [formData, setFormData] = useState({ subCategory: '' });
  const { toast } = useToast();

  useEffect(() => {
    loadSubCategories();
  }, []);

  const loadSubCategories = async () => {
    try {
      const data = await api.getSubCategories();
      setSubCategories(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading sub-categories",
        description: "There was a problem loading the sub-categories.",
      });
    }
  };

  const handleAdd = () => {
    setEditingSubCategory(null);
    setFormData({ subCategory: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (subCategory: OrganizationSubCategory) => {
    setEditingSubCategory(subCategory);
    setFormData({ subCategory: subCategory.sub_category });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteSubCategory(id);
      await loadSubCategories();
      toast({
        description: "Sub-category deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting sub-category",
        description: "There was a problem deleting the sub-category.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSubCategory) {
        await api.updateSubCategory(editingSubCategory.id, formData.subCategory);
        toast({
          description: "Sub-category updated successfully.",
        });
      } else {
        await api.createSubCategory(formData.subCategory);
        toast({
          description: "Sub-category created successfully.",
        });
      }
      await loadSubCategories();
      setIsDialogOpen(false);
    } catch (error:any) {
      toast({
        variant: "destructive",
        title: `Error ${editingSubCategory ? 'updating' : 'creating'} sub-category`,
        // description: "There was a problem with your request.",
        description: error.message,
      });
    }
  };


  const columns = [
    { key: 'id' as keyof OrganizationSubCategory, label: 'ID' },
    { key: 'sub_category' as keyof OrganizationSubCategory, label: 'Sub-Category' },
  ];

  return (
    <div className="container mx-auto py-8">
      <DataTable
        data={subCategories}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSubCategory ? 'Edit Sub-Category' : 'Add New Sub-Category'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Sub-category name"
                value={formData.subCategory}
                onChange={(e) => setFormData({ subCategory: e.target.value })}
                required
                maxLength={50}
              />
            </div>
            <DialogFooter>
              <Button type="submit">
                {editingSubCategory ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}