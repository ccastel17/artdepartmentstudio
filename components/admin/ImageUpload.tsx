'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  folder?: string;
  currentImage?: string;
  multiple?: boolean;
  onMultipleUpload?: (urls: string[]) => void;
}

export default function ImageUpload({ 
  onUpload, 
  folder = 'projects',
  currentImage,
  multiple = false,
  onMultipleUpload
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideoUrl = (url: string) => {
    const lower = url.toLowerCase();
    if (lower.includes('/video/upload/')) return true;
    return [
      '.mp4',
      '.mov',
      '.webm',
      '.m4v',
      '.avi',
      '.mkv',
      'video/mp4',
    ].some(ext => lower.includes(ext));
  };

  const handleFiles = async (files: FileList) => {
    setError('');
    
    if (multiple && onMultipleUpload) {
      // Handle multiple files
      const urls: string[] = [];
      setUploading(true);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const url = await uploadFile(file);
          urls.push(url);
        } catch (err) {
          console.error('Error uploading file:', err);
          setError(`Error uploading ${file.name}`);
        }
      }

      setUploading(false);
      if (urls.length > 0) {
        onMultipleUpload(urls);
      }
    } else {
      // Handle single file
      const file = files[0];
      if (!file) return;

      setUploading(true);
      try {
        const url = await uploadFile(file);
        setPreview(url);
        onUpload(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error uploading file');
      } finally {
        setUploading(false);
      }
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error('Missing Cloudinary configuration');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || 'Upload failed');
    }

    return data.secure_url || data.url;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreview(null);
    onUpload('');
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />

      {!multiple && preview ? (
        <div className="relative w-full h-48 bg-gray-800 rounded-lg overflow-hidden">
          {isVideoUrl(preview) ? (
            <video
              src={preview}
              className="w-full h-full object-cover"
              controls
              playsInline
            />
          ) : (
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
          )}
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200
            ${dragActive 
              ? 'border-accent-blue bg-accent-blue/10' 
              : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
            }
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-12 h-12 text-accent-blue animate-spin" />
              <p className="text-gray-400">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-12 h-12 text-gray-400" />
              <div>
                <p className="text-white font-medium">
                  {multiple ? 'Click or drag images/videos here' : 'Click or drag image/video here'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {multiple ? 'Images, videos (MP4, MOV) - Images up to 10MB, Videos up to 100MB' : 'PNG, JPG, WEBP, MP4, MOV - Images up to 10MB, Videos up to 100MB'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
