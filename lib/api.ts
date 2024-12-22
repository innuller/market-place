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
      .select(`
        *,
        categories (
          category
        )
      `);
  
    if (error) throw error;
    return data;
  },

  async createSubCategory(subCategory: string, mainCategoryId: string) {
    const { data, error } = await supabase
      .from('sub_categories')
      .insert([
        { 
          sub_category: subCategory, 
          main_category_id: mainCategoryId 
        }
      ])
      .select(`
        *,
        category:categories(id, category)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async updateSubCategory(id: string, subCategory: string, mainCategoryId: string) {
    const { data, error } = await supabase
      .from('sub_categories')
      .update({ 
        sub_category: subCategory, 
        main_category_id: mainCategoryId 
      })
      .eq('id', id)
      .select(`
        *,
        category:categories(id, category)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async deleteSubCategory(id: string) {
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

  getFilters: async () => {
    const { data, error } = await supabase.from('filters').select('*');
    if (error) throw error;
    return data;
  },
  createFilter: async (filter: any) => {
    const { error } = await supabase.from('filters').insert(filter);
    if (error) throw error;
  },
  updateFilter: async (id:any, filter:any) => {
    const { error } = await supabase.from('filters').update(filter).eq('id', id);
    if (error) throw error;
  },
  deleteFilter: async (id:any) => {
    const { error } = await supabase.from('filters').delete().eq('id', id);
    if (error) throw error;
  },
};