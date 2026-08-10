import { supabase } from './supabase';

/**
 * Fetch all products, joining the category slug for convenience.
 * Maps snake_case DB columns → camelCase props used by the UI.
 */
export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(slug, name)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(normalizeProduct);
}

/**
 * Fetch only featured products.
 */
export async function fetchFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(slug, name)')
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(normalizeProduct);
}

/**
 * Fetch a single product by its slug.
 */
export async function fetchProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(slug, name)')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return normalizeProduct(data);
}

/**
 * Fetch products by category id.
 */
export async function fetchProductsByCategory(categoryId) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(slug, name)')
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(normalizeProduct);
}

/**
 * Search products by name, description, or short_description using ilike.
 */
export async function searchProducts(query) {
  const pattern = `%${query}%`;

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(slug, name)')
    .or(`name.ilike.${pattern},short_description.ilike.${pattern},description.ilike.${pattern}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(normalizeProduct);
}

/**
 * Get total product count (for admin dashboard).
 */
export async function fetchProductCount() {
  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count;
}

/**
 * Fetch all products as raw rows (for admin — includes category join).
 */
export async function fetchProductsRaw() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(id, name, slug)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Create a new product.
 */
export async function createProduct({ name, slug, category_id, price, images, short_description, description, featured, stock }) {
  const { data, error } = await supabase
    .from('products')
    .insert({
      name,
      slug,
      category_id,
      price,
      images: images || [],
      short_description: short_description || null,
      description: description || null,
      featured: featured || false,
      stock: stock || 0,
    })
    .select('*, categories(id, name, slug)')
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing product.
 */
export async function updateProduct(id, { name, slug, category_id, price, images, short_description, description, featured, stock }) {
  const { data, error } = await supabase
    .from('products')
    .update({
      name,
      slug,
      category_id,
      price,
      images: images || [],
      short_description: short_description || null,
      description: description || null,
      featured: featured ?? false,
      stock: stock ?? 0,
    })
    .eq('id', id)
    .select('*, categories(id, name, slug)')
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a product by id.
 */
export async function deleteProduct(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Adjust the stock of a product by a delta (e.g., -1 or +1).
 */
export async function adjustProductStock(id, delta) {
  // Fetch current stock
  const { data: current, error: fetchError } = await supabase
    .from('products')
    .select('stock')
    .eq('id', id)
    .single();

  if (fetchError) throw fetchError;

  // Update with new stock
  const { data, error } = await supabase
    .from('products')
    .update({ stock: Math.max(0, current.stock + delta) })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── Helpers ───────────────────────────────────────────────

/**
 * Normalize a raw Supabase product row into the shape the UI expects.
 * Converts snake_case → camelCase and flattens the joined category.
 */
function normalizeProduct(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category_id,                      // keep the FK value as "category" for filtering
    categorySlug: row.categories?.slug ?? null,
    categoryName: row.categories?.name ?? null,
    price: Number(row.price),
    images: row.images ?? [],
    shortDescription: row.short_description ?? '',
    description: row.description ?? '',
    featured: row.featured ?? false,
    stock: row.stock ?? 0,
  };
}
