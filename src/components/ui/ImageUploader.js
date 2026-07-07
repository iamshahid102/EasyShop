'use client';

import { useState } from 'react';
import Image from 'next/image';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import { FaCamera, FaStar } from 'react-icons/fa';

export default function ImageUploader({ onImagesSelected, folder = 'products', maxFiles = 5 }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length + selectedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed`);
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      setError('Only JPG, PNG, and WebP images are allowed');
      return;
    }

    // Validate file sizes (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      setError('Images must be less than 10MB');
      return;
    }

    setError('');

    // Create local previews using createObjectURL
    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    const allFiles = [...selectedFiles, ...files];
    const allPreviews = [...previews, ...newPreviews];

    setSelectedFiles(allFiles);
    setPreviews(allPreviews);

    // Notify parent with File objects (NOT uploaded URLs)
    if (onImagesSelected) {
      onImagesSelected(allFiles);
    }

  };

  const handleRemove = (index) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(previews[index].url);

    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    setSelectedFiles(newFiles);
    setPreviews(newPreviews);

    if (onImagesSelected) {
      onImagesSelected(newFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      const fakeEvent = { target: { files: imageFiles } };
      handleFileSelect(fakeEvent);
    }
  };

  return (
    <div className="space-y-4">
      {/* Info Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="flex-1 text-sm">
            <p className="font-semibold text-blue-800 mb-1 flex items-center gap-2"><FaCamera /> Image Upload</p>
            <p className="text-blue-700 text-xs">
              Images will be uploaded to Cloudinary when you submit the form. Preview is shown locally.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div>
        <label
          htmlFor="image-upload"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="block w-full px-6 py-10 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all border-[var(--color-border)] hover:border-[var(--color-brand-primary)] hover:bg-orange-50"
        >
          <div className="flex flex-col items-center gap-3">                <div className="w-16 h-16 bg-[var(--color-bg-tertiary)] rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[var(--color-brand-primary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-[var(--color-brand-accent)] mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                PNG, JPG, WebP up to 10MB
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
              <span className="px-2 py-1 bg-[var(--color-bg-tertiary)] rounded">
                Max {maxFiles} images
              </span>
              <span className="px-2 py-1 bg-[var(--color-bg-tertiary)] rounded">
                {selectedFiles.length}/{maxFiles} selected
              </span>
            </div>
          </div>
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          disabled={selectedFiles.length >= maxFiles}
          className="hidden"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fadeIn">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 whitespace-pre-line">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {selectedFiles.length > 0 && !error && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-green-800">
              {selectedFiles.length} {selectedFiles.length === 1 ? 'image' : 'images'} selected (will upload on submit)
            </p>
          </div>
        </div>
      )}

      {/* Preview Images Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative group aspect-square bg-[var(--color-bg-tertiary)] rounded-xl overflow-hidden border-2 border-[var(--color-border)] hover:border-[var(--color-brand-primary)] transition-all"
            >
              <Image
                src={preview.url}
                alt={preview.name || `Preview ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 z-10 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                aria-label="Remove image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Primary Image Badge */}
              {index === 0 && (
                <div className="absolute bottom-2 left-2 z-10 bg-[var(--color-brand-primary)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  <FaStar className="w-3 h-3" /> Primary
                </div>
              )}

              {/* Image Number */}
              <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
                #{index + 1}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      )}

      {/* Helper Text */}
      {previews.length > 0 && (
        <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2">
          <svg className="w-4 h-4 text-[var(--color-brand-primary)]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          The first image will be used as the primary product image
        </p>
      )}
    </div>
  );
}
