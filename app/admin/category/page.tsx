// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/datatable';
import { api } from '@/lib/api';
import { OrganizationCategory } from '@/types/types';
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
import { Toaster } from '@/components/ui/toasterr';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<OrganizationCategory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<OrganizationCategory | null>(null);
  const [formData, setFormData] = useState({ category: '' });
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading categories",
        description: "There was a problem loading the categories.",
      });
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ category: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (category: OrganizationCategory) => {
    setEditingCategory(category);
    setFormData({ category: category.category });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteCategory(id);
      await loadCategories();
      toast({
        description: "Category deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting category",
        description: "There was a problem deleting the category.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, formData.category);
        toast({
          description: "Category updated successfully.",
        });
      } else {
        await api.createCategory(formData.category);
        toast({
          description: "Category created successfully.",
        });
      }
      await loadCategories();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error ${editingCategory ? 'updating' : 'creating'} category`,
        description: "There was a problem with your request.",
      });
    }
  };

  const columns = [
    { key: 'id' as keyof OrganizationCategory, label: 'ID' },
    { key: 'category' as keyof OrganizationCategory, label: 'Category' },
  ];

  return (
    <div className="container mx-auto py-8">
      <DataTable
        data={categories}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Category name"
                value={formData.category}
                onChange={(e) => setFormData({ category: e.target.value })}
                required
                maxLength={50}
              />
            </div>
            <DialogFooter>
              <Button type="submit">
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}
