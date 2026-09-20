import React, { useState, useRef, useCallback } from 'react';
import { ListingType } from '../types';
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  X,
  Link as LinkIcon,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

interface ImageUploadInputProps {
  value: string;
  onChange: (imageUrl: string) => void;
  listingType: ListingType;
  categoryOrBrand?: string;
  label?: string;
  required?: boolean;
}

// Curated high quality Qatar Living sample photos by category
export const SAMPLE_CATEGORY_IMAGES: Record<
  ListingType,
  Array<{ name: string; url: string; tag: string }>
> = {
  job: [
    {
      name: 'Corporate Office / Admin',
      tag: 'Office',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&auto=format&fit=crop&q=80'
    },
    {
      name: 'Engineering & Construction',
      tag: 'Site / Eng',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=700&auto=format&fit=crop&q=80'
    },
    {
      name: 'Professional Driver / Transport',
      tag: 'Driver',
      url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=700&auto=format&fit=crop&q=80'
    },
    {
      name: 'Hospitality & Restaurant',
      tag: 'Hospitality',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&auto=format&fit=crop&q=80'
    },
    {
      name: 'Healthcare & Nursing',
      tag: 'Medical',
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&auto=format&fit=crop&q=80'
    },
    {
      name: 'Retail & Luxury Sales',
      tag: 'Retail',
      url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&auto=format&fit=crop&q=80'
    }
  ],
  mobile: [
    {
      name: 'iPhone 16 / 15 Pro Titanium',
      tag: 'Apple',
      url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=700&auto=format&fit=crop&q=80'
    },
    {
      name: 'Samsung Galaxy Ultra',
      tag: 'Samsung',
      url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=700&auto=format&fit=crop&q=80'
    },
    {
      name: 'Xiaomi / Android Smartphone',
      tag: 'Xiaomi',
      url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700&auto=format&fit=crop&q=80'
    },
    {
      name: 'Smartphones with Original Box',
      tag: 'Boxed',
      url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700&auto=format&fit=crop&q=80'
    }
  ],
  vehicle: [
    {
      name: 'Toyota Land Cruiser / Prado SUV',
      tag: 'Toyota SUV',
      url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=700&auto=format&fit=crop&q=80'
    },
    {
      name: 'Nissan Patrol / Super Safari',
      tag: 'Nissan 4x4',
      url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=700&auto=format&fit=crop&q=80'
    },
    {
      name: 'Lexus Luxury Sedan / SUV',
      tag: 'Lexus',
      url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=700&auto=format&fit=crop&q=80'
    },
    {
      name: 'Clean City Sedan (Camry / Sunny)',
      tag: 'Sedan',
      url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=700&auto=format&fit=crop&q=80'
    }
  ],
  room: [
    {
      name: 'Executive Master Bedroom',
      tag: 'Master Room',
      url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=700&auto=format&fit=crop&q=80'
    },
    {
      name: 'Furnished Bed Space / Partition',
      tag: 'Bed Space',
      url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=700&auto=format&fit=crop&q=80'
    },
    {
      name: 'Studio Apartment / Flat',
      tag: 'Studio',
      url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&auto=format&fit=crop&q=80'
    },
    {
      name: 'Modern Clean Living Room & Kitchen',
      tag: 'Living Space',
      url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=700&auto=format&fit=crop&q=80'
    }
  ]
};

/**
 * Resizes and compresses an image client-side to ensure lightweight storage
 */
async function compressImageFile(file: File, maxDim = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  value,
  onChange,
  listingType,
  label = 'Post Picture / Photo',
  required = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleImages = SAMPLE_CATEGORY_IMAGES[listingType] || SAMPLE_CATEGORY_IMAGES.job;

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    // Limit raw selection size to 15MB before canvas compression
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Image file is too large (maximum 15MB).');
      return;
    }

    try {
      setIsProcessing(true);
      setUploadError(null);
      const compressedDataUrl = await compressImageFile(file);
      onChange(compressedDataUrl);
    } catch (err: any) {
      setUploadError(err.message || 'Error processing image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
    // reset input so the same file could be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleProcessFile(file);
      }
    },
    [listingType]
  );

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInputValue.trim()) {
      onChange(urlInputValue.trim());
      setShowUrlInput(false);
      setUrlInputValue('');
    }
  };

  const handleClear = () => {
    onChange('');
    setUploadError(null);
  };

  const isBase64 = value.startsWith('data:image');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-[12px] font-bold text-stone-700">
          {label} {required ? '*' : '(Recommended)'}
        </label>
        {value && (
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Picture Attached</span>
          </span>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Selected Image Preview Mode */}
      {value ? (
        <div className="relative rounded-xl border border-stone-200 overflow-hidden bg-stone-50 p-2.5 flex items-center gap-3.5 shadow-2xs group">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-stone-200 shrink-0 border border-stone-300/80">
            <img
              src={value}
              alt="Attached picture preview"
              className="w-full h-full object-cover"
              onError={() => setUploadError('Unable to preview picture URL')}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <Camera className="w-3 h-3" />
                <span>{isBase64 ? 'Uploaded Photo' : 'Web Picture'}</span>
              </span>
              <span className="text-[11px] text-stone-500 font-medium">Ready to post</span>
            </div>
            <p className="text-[11.5px] text-stone-600 line-clamp-1 break-all">
              {isBase64 ? 'Optimized high-resolution photo attached' : value}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 text-[11.5px] font-bold rounded-md bg-stone-200 hover:bg-stone-300 text-stone-800 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Change Photo</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-2.5 py-1 text-[11.5px] font-bold rounded-md bg-red-50 hover:bg-red-100 text-red-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-4 sm:p-5 transition-all text-center flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-[#8e1e3c] bg-red-50/50 scale-[1.01]'
              : 'border-stone-300 bg-stone-50/70 hover:bg-stone-100/70 hover:border-stone-400'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-white shadow-2xs border border-stone-200 flex items-center justify-center text-[#8e1e3c] mb-0.5">
            {isProcessing ? (
              <RefreshCw className="w-6 h-6 animate-spin text-[#8e1e3c]" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div>
            <p className="text-[13.5px] font-extrabold text-stone-800">
              {isProcessing ? 'Processing Picture...' : 'Post with Picture / Photo'}
            </p>
            <p className="text-[11.5px] text-stone-500 mt-0.5">
              Drag &amp; drop an image here, or upload directly from your device gallery or camera
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="px-3.5 py-1.5 rounded-lg bg-[#8e1e3c] hover:bg-[#72152e] text-white text-[12px] font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Choose Photo / Take Picture</span>
            </button>

            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
            >
              <LinkIcon className="w-3.5 h-3.5 text-stone-500" />
              <span>Paste Image URL</span>
            </button>
          </div>
        </div>
      )}

      {/* URL Input Form when toggled */}
      {showUrlInput && !value && (
        <form onSubmit={handleApplyUrl} className="flex gap-2 p-2 bg-stone-100 rounded-lg border border-stone-200 animate-in fade-in duration-150">
          <input
            type="url"
            value={urlInputValue}
            onChange={(e) => setUrlInputValue(e.target.value)}
            placeholder="Paste direct photo link (e.g. https://...jpg / .png)"
            className="flex-1 px-3 py-1.5 text-[12.5px] bg-white border border-stone-300 rounded-md focus:outline-hidden focus:border-[#8e1e3c]"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-stone-900 text-white rounded-md text-[12px] font-bold hover:bg-stone-800 cursor-pointer"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="px-2.5 py-1.5 bg-stone-200 text-stone-700 rounded-md text-[12px] hover:bg-stone-300 cursor-pointer"
          >
            Cancel
          </button>
        </form>
      )}

      {uploadError && (
        <p className="text-[11.5px] text-red-600 font-semibold px-1">
          ⚠️ {uploadError}
        </p>
      )}

      {/* Quick Curated Qatar Living Photos for easy 1-click selection */}
      {!value && sampleImages.length > 0 && (
        <div className="pt-1.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Or 1-Click Pick a Verified Qatar Sample Picture:</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {sampleImages.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(sample.url)}
                className="group relative rounded-lg overflow-hidden border border-stone-200 hover:border-[#8e1e3c] bg-stone-100 text-left transition-all hover:shadow-xs cursor-pointer flex flex-col"
              >
                <div className="h-16 w-full bg-stone-200 overflow-hidden relative">
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9.5px] font-extrabold bg-stone-900/80 text-white backdrop-blur-xs">
                    {sample.tag}
                  </span>
                </div>
                <div className="p-1.5 bg-white">
                  <p className="text-[10.5px] font-bold text-stone-700 truncate leading-tight group-hover:text-[#8e1e3c]">
                    {sample.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
