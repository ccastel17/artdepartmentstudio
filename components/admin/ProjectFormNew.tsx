'use client';

import { useState, useEffect } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import ImageUpload from './ImageUpload';
import Image from 'next/image';

type MediaType = 'image' | 'video';

interface MediaItem {
  url: string;
  type: MediaType;
}

interface ProjectFormProps {
  section: string;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  onCancel?: () => void;
}

export default function ProjectFormNew({ section, onSubmit, initialData, onCancel }: ProjectFormProps) {
  const isRental = section === 'rental';
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client: '',
    year: new Date().getFullYear(),
    featured: false,
    reflection: '',
    pricePerDay: '' as number | '',
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [heroMedia, setHeroMedia] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [mediaTypeInput, setMediaTypeInput] = useState<MediaType>('image');
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const inferMediaTypeFromUrl = (url: string): MediaType => {
    const lower = (url || '').toLowerCase();
    if (lower.includes('/video/upload/')) return 'video';
    return url.match(/\.(mp4|mov|avi|webm)$/i) ? 'video' : 'image';
  };

  const RENTAL_CATEGORIES = [
    'Pedestals',
    'Modules',
    'Product Surfaces',
    'For Sale',
    'Custom Carved Pieces'
  ];

  const ART_DIRECTION_CATEGORIES = [
    'TV Commercials',
    'Product Photography'
  ];

  const PHOTOGRAPHY_CATEGORIES = [
    'Stills',
    'Events',
    'In Set',
    'At ADS'
  ];

  const availableCategories = section === 'rental'
    ? RENTAL_CATEGORIES
    : section === 'art-direction'
      ? ART_DIRECTION_CATEGORIES
      : section === 'fotografia'
        ? PHOTOGRAPHY_CATEGORIES
        : [];

  // Update form when initialData changes (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        client: initialData.client || '',
        year: initialData.year || new Date().getFullYear(),
        featured: initialData.featured || false,
        reflection: initialData.reflection || '',
        pricePerDay: typeof initialData.pricePerDay === 'number' ? initialData.pricePerDay : '',
      });
      setImages(initialData.images || []);
      setHeroMedia(initialData.heroMedia || '');
      setTags(initialData.tags || []);
      setCategories(initialData.categories || []);
      const existingMedia = Array.isArray(initialData.media) ? initialData.media : [];
      const fallbackMedia = (initialData.images || []).map((url: string) => ({
        url,
        type: inferMediaTypeFromUrl(url),
      }));
      setMediaItems(existingMedia.length > 0 ? existingMedia : fallbackMedia);
    } else {
      // Reset form when initialData is null (creating new)
      setFormData({
        title: '',
        description: '',
        client: '',
        year: new Date().getFullYear(),
        featured: false,
        reflection: '',
        pricePerDay: '',
      });
      setImages([]);
      setHeroMedia('');
      setTags([]);
      setCategories([]);
      setMediaItems([]);
    }
    setError('');
    setSuccess('');
  }, [initialData]);

  const handleMultipleUpload = (urls: string[]) => {
    const nextImages = [...images, ...urls];
    setImages(nextImages);

    const nextMedia = [...mediaItems];
    urls.forEach((url) => {
      nextMedia.push({
        url,
        type: inferMediaTypeFromUrl(url),
      });
    });
    setMediaItems(nextMedia);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setMediaItems(mediaItems.filter((_, i) => i !== index));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setImages(newImages);

    const newMedia = [...mediaItems];
    const [movedMedia] = newMedia.splice(fromIndex, 1);
    newMedia.splice(toIndex, 0, movedMedia);
    setMediaItems(newMedia);
  };

  const addMediaUrl = () => {
    const url = mediaUrlInput.trim();
    if (!url) return;

    const nextMedia = [...mediaItems, { url, type: mediaTypeInput }];
    setMediaItems(nextMedia);
    setImages(nextMedia.map((m) => m.url));
    setMediaUrlInput('');
    setMediaTypeInput('image');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!isRental && !heroMedia) {
        throw new Error('Please upload a hero media file');
      }

      if (isRental && (formData.pricePerDay === '' || Number.isNaN(Number(formData.pricePerDay)))) {
        throw new Error('Please enter a valid price per day');
      }

      const data = {
        ...formData,
        section: initialData?.section || section, // Preserve original section when editing
        images,
        media: mediaItems,
        heroMedia,
        tags,
        categories,
        _id: initialData?._id,
      };

      console.log('📝 Submitting project data:', { 
        section: data.section, 
        title: data.title,
        isEditing: !!initialData 
      });

      await onSubmit(data);
      setSuccess(initialData ? 'Project updated successfully!' : 'Project created successfully!');
      
      if (!initialData) {
        // Reset form for new project
        setFormData({
          title: '',
          description: '',
          client: '',
          year: new Date().getFullYear(),
          featured: false,
          reflection: '',
          pricePerDay: '',
        });
        setImages([]);
        setHeroMedia('');
        setTags([]);
        setCategories([]);
        setMediaItems([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving project');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {initialData && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white">Edit Project</h3>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
          Project Title *
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
          placeholder="Enter project title"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          required
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue resize-none"
          placeholder="Enter project description"
        />
      </div>

      {/* Client */}
      <div>
        <label htmlFor="client" className="block text-sm font-medium text-gray-300 mb-2">
          Client{isRental ? '' : ' *'}
        </label>
        <input
          type="text"
          id="client"
          required={!isRental}
          value={formData.client}
          onChange={(e) => setFormData({ ...formData, client: e.target.value })}
          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
          placeholder="Enter client name"
        />
      </div>

      {/* Year */}
      <div>
        <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-2">
          Year{isRental ? '' : ' *'}
        </label>
        <input
          type="number"
          id="year"
          required={!isRental}
          min="1900"
          max="2100"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
        />
      </div>

      {section === 'rental' && (
        <div>
          <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-300 mb-2">
            Price per day (€) *
          </label>
          <input
            type="number"
            id="pricePerDay"
            required
            min="0"
            step="1"
            value={formData.pricePerDay}
            onChange={(e) => {
              const raw = e.target.value;
              setFormData({ ...formData, pricePerDay: raw === '' ? '' : Number(raw) });
            }}
            className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
            placeholder="e.g. 150"
          />
        </div>
      )}

      {/* Featured */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          className="w-5 h-5 bg-black border border-gray-700 rounded focus:ring-2 focus:ring-accent-blue"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-300">
          Featured Project (show on homepage)
        </label>
      </div>

      {availableCategories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Categories
          </label>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((cat) => {
              const selected = categories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={
                    selected
                      ? 'px-4 py-2 bg-accent-blue text-white rounded-full text-sm font-medium'
                      : 'px-4 py-2 bg-gray-800 text-gray-200 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors'
                  }
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
          Tags (Tasks performed in this project)
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (tagInput.trim()) {
                  setTags([...tags, tagInput.trim()]);
                  setTagInput('');
                }
              }
            }}
            className="flex-1 px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
            placeholder="Type a tag and press Enter"
          />
          <button
            type="button"
            onClick={() => {
              if (tagInput.trim()) {
                setTags([...tags, tagInput.trim()]);
                setTagInput('');
              }
            }}
            className="px-4 py-3 bg-accent-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800 text-white rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((_, i) => i !== index))}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="mt-2 text-sm text-gray-500">
          💡 Add tags like "Set Design", "Props", "Lighting", etc.
        </p>
      </div>

      {/* Reflection */}
      <div>
        <label htmlFor="reflection" className="block text-sm font-medium text-gray-300 mb-2">
          Reflection & Learning
        </label>
        <textarea
          id="reflection"
          rows={6}
          value={formData.reflection}
          onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue resize-none"
          placeholder="Share your thoughts, learnings, and reflections about this project..."
        />
        <p className="mt-2 text-sm text-gray-500">
          💡 This will be displayed in the project detail page
        </p>
      </div>

      {/* Hero Media (Image or Video) */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Hero Media (Main Image or Video for project header)
        </label>
        
        {heroMedia && (
          <div className="relative w-full h-64 bg-gray-800 rounded-lg overflow-hidden mb-4">
            {heroMedia.match(/\.(mp4|mov|avi|webm)$/i) ? (
              <video
                src={heroMedia}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={heroMedia}
                alt="Hero media"
                fill
                className="object-cover"
              />
            )}
            <button
              type="button"
              onClick={() => setHeroMedia('')}
              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}
        
        {!heroMedia && (
          <ImageUpload
            folder="projects"
            onUpload={setHeroMedia}
          />
        )}
        
        <p className="mt-2 text-sm text-gray-500">
          💡 This will be the main visual at the top of the project page. Can be an image or video.
        </p>
      </div>

      {/* Image Gallery Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Project Media (Drag & Drop multiple files)
        </label>
        
        {/* Existing Media */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {images.map((url, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                  moveImage(fromIndex, index);
                }}
                className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden group cursor-move"
              >
                {(mediaItems[index]?.type === 'video') || url.match(/\.(mp4|mov|avi|webm)$/i) ? (
                  <video
                    src={url}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <Image
                    src={url}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Area */}
        <ImageUpload
          folder="projects"
          multiple
          onMultipleUpload={handleMultipleUpload}
          onUpload={() => {}}
        />

        <div className="mt-4 flex flex-col gap-3">
          <div className="text-sm font-medium text-gray-300">Add by URL (Google Drive)</div>
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="url"
              value={mediaUrlInput}
              onChange={(e) => setMediaUrlInput(e.target.value)}
              className="flex-1 px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
              placeholder="Paste a public URL (image or video)"
            />
            <select
              value={mediaTypeInput}
              onChange={(e) => setMediaTypeInput(e.target.value as MediaType)}
              className="px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
            <button
              type="button"
              onClick={addMediaUrl}
              className="px-4 py-3 bg-accent-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add URL
            </button>
          </div>
        </div>
        
        <p className="mt-2 text-sm text-gray-500">
          💡 Drag images to reorder them. The first image will be the cover.
        </p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg text-green-400 text-sm">
          {success}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : initialData ? 'Update Project' : 'Create Project'}
        <Upload size={20} />
      </button>
    </form>
  );
}
