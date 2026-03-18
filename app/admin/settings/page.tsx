'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AdminSettingsPage() {
  const [homeHeroVideoUrl, setHomeHeroVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/settings/home-video');
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.error || 'Failed to load settings');
        }
        const data = await response.json();
        setHomeHeroVideoUrl(data?.homeHeroVideoUrl || '');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const save = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/settings/home-video', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homeHeroVideoUrl }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to save settings');
      }

      setSuccess('Settings saved');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save settings');
    } finally {
      setSaving(false);
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
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage site-wide content</p>
        </div>

        <div className="bg-gray-900 p-8 rounded-lg space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Home Hero Video
            </label>
            {loading ? (
              <div className="text-gray-400">Loading…</div>
            ) : (
              <ImageUpload
                folder="home"
                currentImage={homeHeroVideoUrl}
                onUpload={(url) => {
                  setHomeHeroVideoUrl(url);
                  setSuccess('');
                }}
              />
            )}
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}
          {success && <div className="text-sm text-green-400">{success}</div>}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-3 bg-accent-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
