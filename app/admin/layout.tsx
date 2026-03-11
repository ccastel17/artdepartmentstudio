import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel - Art Department Studio',
  description: 'Content management system',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-black">{children}</div>;
}
