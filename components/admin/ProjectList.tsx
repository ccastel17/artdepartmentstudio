'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, GripVertical, Eye } from 'lucide-react';
import Image from 'next/image';

interface Project {
  _id: string;
  title: string;
  description: string;
  client: string;
  year: number;
  section: string;
  featured: boolean;
  images: string[];
  media?: { url: string; type: 'image' | 'video' }[];
  order?: number;
  createdAt: string;
}

interface ProjectListProps {
  section: string;
  onEdit: (project: Project) => void;
  onRefresh: () => void;
}

export default function ProjectList({ section, onEdit, onRefresh }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [section]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`/api/projects?section=${section}`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjects(projects.filter(p => p._id !== id));
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggedItem === null || draggedItem === index) return;

    const newProjects = [...projects];
    const draggedProject = newProjects[draggedItem];
    
    newProjects.splice(draggedItem, 1);
    newProjects.splice(index, 0, draggedProject);
    
    setProjects(newProjects);
    setDraggedItem(index);
  };

  const handleDragEnd = async () => {
    if (draggedItem === null) return;

    // Update order in database
    try {
      const updates = projects.map((project, index) => ({
        id: project._id,
        order: index,
      }));

      await fetch('/api/projects/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });

      console.log('✅ Order updated');
    } catch (error) {
      console.error('Error updating order:', error);
    }

    setDraggedItem(null);
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Loading projects...</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No projects yet. Create your first project above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Existing Projects</h3>
      
      {projects.map((project, index) => (
        <div
          key={project._id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`
            bg-gray-800 rounded-lg p-4 border-2 border-gray-700
            hover:border-accent-blue transition-all cursor-move
            ${draggedItem === index ? 'opacity-50' : ''}
          `}
        >
          <div className="flex gap-4">
            {/* Drag Handle */}
            <div className="flex items-center text-gray-500">
              <GripVertical size={24} />
            </div>

            {/* Thumbnail */}
            {(project.media?.[0]?.url || (project.images && project.images.length > 0)) && (
              <div className="relative w-24 h-24 bg-gray-900 rounded overflow-hidden flex-shrink-0">
                {project.media?.[0]?.type === 'video' ? (
                  <video
                    src={project.media[0].url}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <Image
                    src={project.media?.[0]?.url || project.images[0]}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-bold text-white truncate">
                    {project.title}
                    {project.featured && (
                      <span className="ml-2 text-xs bg-accent-blue px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-gray-400 mt-1">
                    {project.client} • {project.year}
                  </p>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {project.description}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    {(project.media?.length || project.images?.length || 0)} files
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => onEdit(project)}
                    className="p-2 bg-accent-blue text-white rounded hover:bg-blue-700 transition-colors"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <p className="text-sm text-gray-500 text-center mt-4">
        💡 Drag and drop to reorder projects
      </p>
    </div>
  );
}
