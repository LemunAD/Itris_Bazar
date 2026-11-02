import { supabase } from './supabase';

const BUCKET = 'product-images';

/**
 * Upload a single image file to Supabase Storage.
 * Returns the public URL of the uploaded file.
 *
 * @param {File} file       – The image File object
 * @param {string} folder   – Sub-folder path (e.g. the product slug)
 * @returns {Promise<string>} – Public URL
 */
export async function uploadProductImage(file, folder = 'uploads') {
  // Create a unique filename to avoid collisions
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${folder}/${timestamp}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Upload multiple image files.
 * Returns an array of public URLs in the same order as the input files.
 *
 * @param {File[]} files
 * @param {string} folder
 * @returns {Promise<string[]>}
 */
export async function uploadProductImages(files, folder = 'uploads') {
  const results = await Promise.all(
    files.map((file) => uploadProductImage(file, folder))
  );
  return results;
}

