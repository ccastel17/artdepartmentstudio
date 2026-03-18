import Link from 'next/link';
import { Hammer, Camera, Palette, Key, Image, Users, Mail, LogOut, Settings } from 'lucide-react';

const sections = [
  { href: '/admin/set-buildings', title: 'Set Buildings', icon: Hammer },
  { href: '/admin/fotografia', title: 'Photography', icon: Camera },
  { href: '/admin/art-direction', title: 'Art Direction', icon: Palette },
  { href: '/admin/rental', title: 'Rental', icon: Key },
  { href: '/admin/gallery', title: 'Gallery', icon: Image },
  { href: '/admin/team', title: 'Team', icon: Users },
  { href: '/admin/contacts', title: 'Messages', icon: Mail },
  { href: '/admin/settings', title: 'Settings', icon: Settings },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-black py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Admin <span className="text-accent-blue">Dashboard</span>
            </h1>
            <p className="text-gray-400">Manage website content</p>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group p-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition-all hover:ring-2 hover:ring-accent-blue"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-accent-blue/10 rounded-lg group-hover:bg-accent-blue/20 transition-colors">
                    <Icon className="text-accent-blue" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-white group-hover:text-accent-blue transition-colors">
                    {section.title}
                  </h2>
                </div>
                <p className="text-gray-400 text-sm">
                  Manage projects and content
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
