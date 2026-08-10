import { supabase } from './supabase';

/**
 * Fetch all categories.
 */
export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

/**
 * Fetch categories with their product count.
 */
export async function fetchCategoriesWithCount() {
  const { data, error } = await supabase
    .from('categories')
    .select('*, products(count)')
    .order('name');

  if (error) throw error;
  return data.map((cat) => ({
    ...cat,
    productCount: cat.products?.[0]?.count ?? 0,
  }));
}

/**
 * Create a new category.
 */
export async function createCategory({ id, name, slug, description }) {
  const { data, error } = await supabase
    .from('categories')
    .insert({ id, name, slug, description: description || null })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing category.
 */
export async function updateCategory(id, { name, slug, description }) {
  const { data, error } = await supabase
    .from('categories')
    .update({ name, slug, description: description || null })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a category. Will fail if products still reference it (FK constraint).
 */
export async function deleteCategory(id) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
