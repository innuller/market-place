import { createClient } from '@/utils/supabase/client';
import { OrganizationCategory, OrganizationSubCategory, ComplianceStandard } from '@/types/types';

const supabase = createClient();

export const api = {
  // Organization Categories

  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id');
    if (error) throw error;
    return data;
  },

  async createCategory(category: string) {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ category }])
      .select();
    if (error) throw error;
    return data[0];
  },

  async updateCategory(id: number, category: string) {
    const { data, error } = await supabase
      .from('categories')
      .update({ category })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async deleteCategory(id: number) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Organization Sub-Categories
  async getSubCategories() {
    const { data, error } = await supabase
      .from('sub_categories')
      .select('*')
      .order('id');
    if (error) throw error;
    return data;
  },

  async createSubCategory(subCategory: string) {
    const { data, error } = await supabase
      .from('sub_categories')
      .insert([{ sub_category: subCategory }])
      .select();
    if (error) throw error;
    return data[0];
  },

  async updateSubCategory(id: number, subCategory: string) {
    const { data, error } = await supabase
      .from('sub_categories')
      .update({ sub_category: subCategory })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async deleteSubCategory(id: number) {
    const { error } = await supabase
      .from('sub_categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Compliance Standards
  async getStandards() {
    const { data, error } = await supabase
      .from('compliance_standards')
      .select('*')
      .order('id');
    if (error) throw error;
    return data;
  },

  async createStandard(standard: string) {
    const { data, error } = await supabase
      .from('compliance_standards')
      .insert([{ standard }])
      .select();
    if (error) throw error;
    return data[0];
  },

  async updateStandard(id: number, standard: string) {
    const { data, error } = await supabase
      .from('compliance_standards')
      .update({ standard })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async deleteStandard(id: number) {
    const { error } = await supabase
      .from('compliance_standards')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};