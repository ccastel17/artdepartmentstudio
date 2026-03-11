'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Plus, X, Edit2, Trash2 } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import Image from 'next/image';

interface GalleryPost {
  _id: string;
  title: string;
  description: string;
  fullText: string;
  heroImage: string;
  images: string[];
  tags: string[];
  createdAt: Date;
}

export default function GalleryAdmin() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullText: '',
    heroImage: '',
    images: [] as string[],
    tags: [''],
  });
  const [posts, setPosts] = useState<GalleryPost[]>([]);
  const [editingPost, setEditingPost] = useState<GalleryPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch posts
  useEffect(() => {
    fetchPosts();
  }, [refreshKey]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.items || []);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  // Load post data for editing
  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title,
        description: editingPost.description,
        fullText: editingPost.fullText,
        heroImage: editingPost.heroImage,
        images: editingPost.images || [],
        tags: editingPost.tags || [''],
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [editingPost]);

  const handleMultipleUpload = (urls: string[]) => {
    setFormData({ ...formData, images: [...formData.images, ...urls] });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleAddTag = () => {
    setFormData({ ...formData, tags: [...formData.tags, ''] });
  };

  const handleRemoveTag = (index: number) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags: newTags });
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({ ...formData, tags: newTags });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.heroImage) {
        throw new Error('Please upload a hero image');
      }

      const cleanedData = {
        ...formData,
        images: formData.images.filter(img => img.trim() !== ''),
        tags: formData.tags.filter(tag => tag.trim() !== ''),
      };

      const url = editingPost ? `/api/gallery/${editingPost._id}` : '/api/gallery';
      const method = editingPost ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save post');
      }

      setSuccess(editingPost ? 'Gallery post updated successfully!' : 'Gallery post added successfully!');
      setFormData({
        title: '',
        description: '',
        fullText: '',
        heroImage: '',
        images: [],
        tags: [''],
      });
      setEditingPost(null);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving post');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: GalleryPost) => {
    setEditingPost(post);
  };

  const handleCancel = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      description: '',
      fullText: '',
      heroImage: '',
      images: [],
      tags: [''],
    });
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setSuccess('Post deleted successfully!');
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting post');
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-accent-blue hover:text-blue-400 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Gallery <span className="text-accent-blue">Management</span>
          </h1>
          <p className="text-gray-400">Create and manage gallery posts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-gray-900 p-8 rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingPost ? 'Edit Post' : 'New Post'}
              </h2>
              {editingPost && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
                placeholder="Enter post title"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Short Description *
              </label>
              <textarea
                id="description"
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
                placeholder="Brief description for preview"
              />
            </div>

            <div>
              <label htmlFor="fullText" className="block text-sm font-medium text-gray-300 mb-2">
                Full Text *
              </label>
              <textarea
                id="fullText"
                required
                rows={8}
                value={formData.fullText}
                onChange={(e) => setFormData({ ...formData, fullText: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
                placeholder="Complete post content"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Hero Image *
              </label>
              <ImageUpload
                onUpload={(url) => setFormData({ ...formData, heroImage: url })}
                folder="gallery"
                currentImage={formData.heroImage}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gallery Images
              </label>
              <ImageUpload
                onUpload={() => {}}
                onMultipleUpload={handleMultipleUpload}
                folder="gallery"
                multiple={true}
              />
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden group">
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
                    placeholder="Enter tag"
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="px-3 py-2 bg-red-900/20 border border-red-700 text-red-400 rounded-lg hover:bg-red-900/30 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddTag}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Plus size={16} />
                Add Tag
              </button>
            </div>

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

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}
              <Upload size={20} />
            </button>
          </form>
          </div>

          {/* Posts List Section */}
          <div className="bg-gray-900 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Gallery Posts</h2>
            
            {posts.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No posts yet. Create your first gallery post!</p>
            ) : (
              <div className="space-y-4 max-h-[800px] overflow-y-auto">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-32 h-24 flex-shrink-0 bg-gray-700 rounded overflow-hidden">
                        <Image
                          src={post.heroImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold mb-1 truncate">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                          {post.description}
                        </p>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="inline-block px-2 py-1 text-xs text-gray-400">
                                +{post.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleEdit(post)}
                            className="flex items-center gap-1 px-3 py-1 bg-accent-blue text-white text-sm rounded hover:bg-blue-700 transition-colors"
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(post._id)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-900/20 border border-red-700 text-red-400 text-sm rounded hover:bg-red-900/30 transition-colors"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
