'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProjectFormNew from '@/components/admin/ProjectFormNew';
import ProjectList from '@/components/admin/ProjectList';

export default function FotografiaAdmin() {
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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save project');
    }

    setEditingProject(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingProject(null);
  };

  return (
    <div className="min-h-screen bg-black py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-accent-blue hover:text-blue-400 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Photography <span className="text-accent-blue">Projects</span>
          </h1>
          <p className="text-gray-400">Add and manage photography projects</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-900 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingProject ? 'Edit Project' : 'New Project'}
            </h2>
            <ProjectFormNew 
              section="fotografia" 
              onSubmit={handleSubmit}
              initialData={editingProject}
              onCancel={editingProject ? handleCancel : undefined}
            />
          </div>

          <div className="bg-gray-900 p-8 rounded-lg">
            <ProjectList 
              key={refreshKey}
              section="fotografia"
              onEdit={handleEdit}
              onRefresh={() => setRefreshKey(prev => prev + 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
