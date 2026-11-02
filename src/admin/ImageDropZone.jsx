import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, GripVertical, Image as ImageIcon, Loader } from 'lucide-react';
import { uploadProductImage } from '../lib/storage.service';

/**
 * Drag-and-drop image uploader with previews, reorder, and removal.
 *
 * Props:
 *   images       – string[] of current image URLs
 *   onChange      – (urls: string[]) => void
 *   folder        – Supabase Storage sub-folder (e.g. product slug)
 *   max           – max number of images (default 8)
 */
export default function ImageDropZone({ images = [], onChange, folder = 'uploads', max = 8 }) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // ── Drag-to-reorder state ──
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);

  // ── File validation ──
  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  function validateFile(file) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `"${file.name}" is not a supported image type.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `"${file.name}" exceeds the 5 MB limit.`;
    }
    return null;
  }

  // ── Upload handler ──
  const processFiles = useCallback(async (fileList) => {
    setError('');
    const files = Array.from(fileList);
    const remaining = max - images.length;

    if (remaining <= 0) {
      setError(`Maximum of ${max} images reached.`);
      return;
    }

    const validFiles = [];
    for (const file of files.slice(0, remaining)) {
      const err = validateFile(file);
      if (err) {
        setError(err);
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    const newUrls = [];
    try {
      for (let i = 0; i < validFiles.length; i++) {
        setUploadProgress(`Uploading ${i + 1} of ${validFiles.length}…`);
        const url = await uploadProductImage(validFiles[i], folder);
        newUrls.push(url);
      }
      onChange([...images, ...newUrls]);
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  }, [images, onChange, folder, max]);

  // ── Drop zone events ──
  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    // Only leave if we're actually leaving the drop zone
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDraggingOver(false);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files?.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }

  function handleFileSelect(e) {
    if (e.target.files?.length > 0) {
      processFiles(e.target.files);
      e.target.value = ''; // reset so the same file can be re-selected
    }
  }

  // ── Remove an image ──
  function removeImage(index) {
    onChange(images.filter((_, i) => i !== index));
  }

  // ── Reorder via drag (within the thumbnails) ──
  function handleThumbDragStart(e, index) {
    setDragIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleThumbDragOver(e, index) {
    e.preventDefault();
    setOverIdx(index);
  }

  function handleThumbDragEnd() {
    if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
      const reordered = [...images];
      const [moved] = reordered.splice(dragIdx, 1);
      reordered.splice(overIdx, 0, moved);
      onChange(reordered);
    }
    setDragIdx(null);
    setOverIdx(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="block text-[10px] text-sage/50 uppercase tracking-wider">
        Product Images
        <span className="text-sage/30 ml-1">
          ({images.length}/{max})
        </span>
      </label>

      {/* ── Drop Zone ── */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center gap-3 p-8
          border-2 border-dashed rounded-xl cursor-pointer
          transition-all duration-200 select-none
          ${isDraggingOver
            ? 'border-gold bg-gold/5 scale-[1.01]'
            : 'border-white/10 hover:border-gold/30 bg-deep-green/40 hover:bg-deep-green/60'
          }
          ${uploading ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        {uploading ? (
          <>
            <Loader size={28} className="text-gold animate-spin" />
            <p className="text-xs text-gold font-medium">{uploadProgress}</p>
          </>
        ) : (
          <>
            <div className={`p-3 rounded-full transition-colors ${isDraggingOver ? 'bg-gold/10' : 'bg-white/5'}`}>
              <Upload size={22} className={isDraggingOver ? 'text-gold' : 'text-sage/50'} />
            </div>
            <div className="text-center">
              <p className="text-xs text-ivory/80">
                <span className="text-gold font-medium">Click to browse</span> or drag & drop
              </p>
              <p className="text-[10px] text-sage/40 mt-1">
                JPEG, PNG, WebP, GIF, AVIF · Max 5 MB each
              </p>
            </div>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* ── Error ── */}
      {error && (
        <p className="text-xs text-ember bg-ember/10 border border-ember/20 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {/* ── Image Previews ── */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
          {images.map((url, index) => (
            <div
              key={url + index}
              draggable
              onDragStart={(e) => handleThumbDragStart(e, index)}
              onDragOver={(e) => handleThumbDragOver(e, index)}
              onDragEnd={handleThumbDragEnd}
              className={`
                group relative aspect-[4/5] rounded-lg overflow-hidden
                border transition-all duration-150 cursor-grab active:cursor-grabbing
                ${dragIdx === index
                  ? 'opacity-40 border-gold/40 scale-95'
                  : overIdx === index && dragIdx !== null
                    ? 'border-gold border-2 scale-105'
                    : 'border-white/10 hover:border-white/20'
                }
              `}
            >
              <img
                src={url}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <GripVertical size={16} className="text-white/70" />
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-ember/80 rounded-full text-white/70 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
              >
                <X size={12} />
              </button>

              {/* Position badge */}
              {index === 0 && (
                <span className="absolute bottom-1.5 left-1.5 bg-gold/90 text-ink text-[9px] font-heading uppercase tracking-wider px-1.5 py-0.5 rounded">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length > 1 && (
        <p className="text-[10px] text-sage/30 text-center">
          Drag thumbnails to reorder · First image is the cover
        </p>
      )}
    </div>
  );
}

