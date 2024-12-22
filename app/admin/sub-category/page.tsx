// @ts-nocheck
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { ValueOf } from 'next/dist/shared/lib/constants';

export default function SubCategoriesPage() {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<OrganizationSubCategory | null>(null);
  const [formData, setFormData] = useState({ subCategory: '', mainCategory: '' });
  const { toast } = useToast();

  useEffect(() => {
    loadSubCategories();
    loadCategories();
  }, []);

  const loadSubCategories = async () => {
    try {
      const data = await api.getSubCategories();
      setSubCategories(data);
      // console.log("=====> ",subCategories);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading sub-categories",
        description: "There was a problem loading the sub-categories.",
      });
    }
  };

  // Log updated subCategories
useEffect(() => {
  console.log("Updated subCategories: ", subCategories);
}, [subCategories]);

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
    setEditingSubCategory(null);
    setFormData({ subCategory: '', mainCategory: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (subCategory: OrganizationSubCategory) => {
    setEditingSubCategory(subCategory);
    setFormData({ subCategory: subCategory.sub_category, mainCategory: subCategory.main_category_id });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
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
        await api.updateSubCategory(editingSubCategory.id, formData.subCategory, formData.mainCategory);
        toast({
          description: "Sub-category updated successfully.",
        });
      } else {
        await api.createSubCategory(formData.subCategory, formData.mainCategory);
        toast({
          description: "Sub-category created successfully.",
        });
      }
      await loadSubCategories();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error ${editingSubCategory ? 'updating' : 'creating'} sub-category`,
        description: "There was a problem with your request.",
      });
    }
  };
  
  const enrichedSubCategories = subCategories.map(subCategory => {
    const mainCategory = categories.find(category => category.id === subCategory.main_category_id);
    return {
      ...subCategory,
      main_category_name: mainCategory ? mainCategory.category : 'No Main Category',
    };
  });

  const columns = [
    { key: 'id' as keyof OrganizationSubCategory, label: 'ID' },
    { key: 'sub_category' as keyof OrganizationSubCategory, label: 'Sub-Category' },
    { key: 'main_category_name' as keyof OrganizationSubCategory, label: 'Main-Category' },
  ];

  return (
    <div className="container mx-auto py-8">
      <DataTable
        data={enrichedSubCategories}
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
                onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                required
                maxLength={50}
              />
            </div>
            <div>
              <Select value={formData.mainCategory} onValueChange={(value) => setFormData({ ...formData, mainCategory: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Main Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
