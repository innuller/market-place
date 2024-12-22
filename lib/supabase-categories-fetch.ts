import {createClient} from '@/utils/supabase/server'

// Server-side function to fetch main categories
export async function fetchMainCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, category");
  if (error) throw new Error(`Error fetching main categories: ${error.message}`);
  return data;
}

// Server-side function to fetch subcategories based on main category
export async function fetchSubCategories(mainCategoryId: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sub_categories")
    .select("id, sub_category")
    .eq("main_category_id", mainCategoryId);
  if (error) throw new Error(`Error fetching subcategories: ${error.message}`);
  return data;
}
