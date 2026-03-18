'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Trash2, Pencil, ArrowUp, ArrowDown, Save } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

type TeamMemberAdmin = {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  portfolio?: string;
  linkedin?: string;
  isPartner: boolean;
  order?: number;
};

const MAX_TEAM_MEMBERS = 4;

export default function TeamAdmin() {
  const [members, setMembers] = useState<TeamMemberAdmin[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    imageUrl: '',
    isPartner: false,
    portfolio: '',
    linkedin: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isAtLimit = members.length >= MAX_TEAM_MEMBERS;

  const loadMembers = async () => {
    setError('');
    try {
      const response = await fetch('/api/team');
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to load team');
      }
      const data = await response.json();
      setMembers(Array.isArray(data?.members) ? data.members : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load team');
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const isEditing = !!editingId;

      if (!isEditing && isAtLimit) {
        throw new Error(`Max ${MAX_TEAM_MEMBERS} team members reached`);
      }

      const response = await fetch(isEditing ? `/api/team/${editingId}` : '/api/team', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save team member');
      }

      setSuccess(isEditing ? 'Team member updated successfully!' : 'Team member added successfully!');
      setFormData({
        name: '',
        role: '',
        bio: '',
        imageUrl: '',
        isPartner: false,
        portfolio: '',
        linkedin: '',
      });
      setEditingId(null);
      await loadMembers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving team member');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (member: TeamMemberAdmin) => {
    setSuccess('');
    setError('');
    setEditingId(member.id);
    setFormData({
      name: member.name || '',
      role: member.role || '',
      bio: member.bio || '',
      imageUrl: member.imageUrl || '',
      isPartner: !!member.isPartner,
      portfolio: member.portfolio || '',
      linkedin: member.linkedin || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      role: '',
      bio: '',
      imageUrl: '',
      isPartner: false,
      portfolio: '',
      linkedin: '',
    });
  };

  const removeMember = async (id: string) => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const response = await fetch(`/api/team/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to delete team member');
      }
      setSuccess('Team member deleted');
      if (editingId === id) {
        cancelEdit();
      }
      await loadMembers();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete team member');
    } finally {
      setLoading(false);
    }
  };

  const moveMember = async (id: string, direction: 'up' | 'down') => {
    const idx = members.findIndex(m => m.id === id);
    if (idx === -1) return;
    const swapWith = direction === 'up' ? idx - 1 : idx + 1;
    if (swapWith < 0 || swapWith >= members.length) return;

    const a = members[idx];
    const b = members[swapWith];

    const orderA = typeof a.order === 'number' ? a.order : idx;
    const orderB = typeof b.order === 'number' ? b.order : swapWith;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const resA = await fetch(`/api/team/${a.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: a.name,
          role: a.role,
          bio: a.bio,
          imageUrl: a.imageUrl,
          isPartner: a.isPartner,
          portfolio: a.portfolio || '',
          linkedin: a.linkedin || '',
          order: orderB,
        }),
      });

      const resB = await fetch(`/api/team/${b.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: b.name,
          role: b.role,
          bio: b.bio,
          imageUrl: b.imageUrl,
          isPartner: b.isPartner,
          portfolio: b.portfolio || '',
          linkedin: b.linkedin || '',
          order: orderA,
        }),
      });

      if (!resA.ok || !resB.ok) {
        const dataA = !resA.ok ? await resA.json().catch(() => ({})) : null;
        const dataB = !resB.ok ? await resB.json().catch(() => ({})) : null;
        throw new Error(dataA?.error || dataB?.error || 'Failed to reorder');
      }

      await loadMembers();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to reorder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-accent-blue hover:text-blue-400 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Team <span className="text-accent-blue">Management</span>
          </h1>
          <p className="text-gray-400">Add and manage team members</p>
        </div>

        <div className="bg-gray-900 p-8 rounded-lg mb-8">
          <div className="flex items-center justify-between gap-6 mb-6">
            <h2 className="text-xl font-bold text-white">Current team ({members.length}/{MAX_TEAM_MEMBERS})</h2>
          </div>

          {members.length === 0 ? (
            <div className="text-gray-400">No team members yet.</div>
          ) : (
            <div className="space-y-4">
              {members.map((m, index) => (
                <div key={m.id} className="flex items-center justify-between gap-4 bg-black/40 border border-white/10 rounded-lg p-4">
                  <div className="min-w-0">
                    <div className="text-white font-semibold truncate">{m.name}</div>
                    <div className="text-gray-400 text-sm truncate">{m.role}</div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => moveMember(m.id, 'up')}
                      disabled={loading || index === 0}
                      className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Move up"
                    >
                      <ArrowUp size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveMember(m.id, 'down')}
                      disabled={loading || index === members.length - 1}
                      className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Move down"
                    >
                      <ArrowDown size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(m)}
                      disabled={loading}
                      className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeMember(m.id)}
                      disabled={loading}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-900 p-8 rounded-lg">
          <div className="flex items-center justify-between gap-6 mb-6">
            <h2 className="text-xl font-bold text-white">
              {editingId ? 'Edit team member' : 'Add team member'}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
                placeholder="Enter name"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                Role *
              </label>
              <input
                type="text"
                id="role"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
                placeholder="e.g., Art Director, Set Designer"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                Bio *
              </label>
              <textarea
                id="bio"
                required
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue resize-none"
                placeholder="Enter bio"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Photo *
              </label>
              <ImageUpload
                folder="team"
                currentImage={formData.imageUrl}
                onUpload={(url) => setFormData({ ...formData, imageUrl: url })}
              />
            </div>

            <div>
              <label htmlFor="portfolio" className="block text-sm font-medium text-gray-300 mb-2">
                Portfolio URL
              </label>
              <input
                type="url"
                id="portfolio"
                value={formData.portfolio}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
                placeholder="https://..."
              />
            </div>

            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-300 mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPartner"
                checked={formData.isPartner}
                onChange={(e) => setFormData({ ...formData, isPartner: e.target.checked })}
                className="w-5 h-5 bg-black border border-gray-700 rounded focus:ring-2 focus:ring-accent-blue"
              />
              <label htmlFor="isPartner" className="text-sm font-medium text-gray-300">
                Partner / Founding Member
              </label>
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
              disabled={loading || (!editingId && isAtLimit)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (editingId ? 'Save changes' : 'Add Team Member')}
              {editingId ? <Save size={20} /> : <Upload size={20} />}
            </button>

            {!editingId && members.length >= MAX_TEAM_MEMBERS && (
              <div className="text-sm text-gray-400">
                Max {MAX_TEAM_MEMBERS} team members reached. Delete one to add another.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
