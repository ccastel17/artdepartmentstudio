'use client';

import { useState } from 'react';
import { Upload, X, Plus } from 'lucide-react';

interface ProjectFormProps {
  section: string;
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: any;
}

export default function ProjectForm({ section, onSubmit, initialData }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    client: initialData?.client || '',
    year: initialData?.year || new Date().getFullYear(),
    featured: initialData?.featured || false,
    images: initialData?.images || [],
  });
  
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images || ['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImageUrlChange = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrl = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const validImages = imageUrls.filter(url => url.trim() !== '');
      
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('client', formData.client);
      data.append('year', formData.year.toString());
      data.append('section', section);
      data.append('featured', formData.featured.toString());
      data.append('images', JSON.stringify(validImages));

      await onSubmit(data);
      setSuccess('Project saved successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        client: '',
        year: new Date().getFullYear(),
        featured: false,
        images: [],
      });
      setImageUrls(['']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          Client *
        </label>
        <input
          type="text"
          id="client"
          required
          value={formData.client}
          onChange={(e) => setFormData({ ...formData, client: e.target.value })}
          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
          placeholder="Enter client name"
        />
      </div>

      {/* Year */}
      <div>
        <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-2">
          Year *
        </label>
        <input
          type="number"
          id="year"
          required
          min="1900"
          max="2100"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
        />
      </div>

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

      {/* Image URLs */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Image URLs *
        </label>
        <div className="space-y-3">
          {imageUrls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => handleImageUrlChange(index, e.target.value)}
                className="flex-1 px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
                placeholder="https://example.com/image.jpg"
              />
              {imageUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageUrl(index)}
                  className="px-4 py-3 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/30 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageUrl}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Plus size={20} />
            Add Image URL
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Add URLs of images hosted online (e.g., from your cloud storage)
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
        {loading ? 'Saving...' : 'Save Project'}
        <Upload size={20} />
      </button>
    </form>
  );
}
