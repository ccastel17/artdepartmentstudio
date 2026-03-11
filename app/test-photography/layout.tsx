import Sidebar from '@/components/Sidebar';

export default function TestPhotographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      {children}
    </>
  );
}
