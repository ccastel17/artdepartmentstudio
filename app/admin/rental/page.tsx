'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProjectFormNew from '@/components/admin/ProjectFormNew';
import ProjectList from '@/components/admin/ProjectList';

export default function RentalAdmin() {
  const [editingProject, setEditingProject] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubmit = async (data: any) => {
    const url = data._id ? `/api/projects/${data._id}` : '/api/projects';
    const method = data._id ? 'PUT' : 'POST';
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to save project');
    setEditingProject(null);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-black py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 text-accent-blue hover:text-blue-400 mb-8 transition-colors">
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Rental <span className="text-accent-blue">Items</span>
          </h1>
          <p className="text-gray-400">Add and manage rental items</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-900 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">{editingProject ? 'Edit Item' : 'New Item'}</h2>
            <ProjectFormNew section="rental" onSubmit={handleSubmit} initialData={editingProject} onCancel={editingProject ? () => setEditingProject(null) : undefined} />
          </div>
          <div className="bg-gray-900 p-8 rounded-lg">
            <ProjectList key={refreshKey} section="rental" onEdit={(p) => { setEditingProject(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onRefresh={() => setRefreshKey(prev => prev + 1)} />
          </div>
        </div>
      </div>
    </div>
  );
}
