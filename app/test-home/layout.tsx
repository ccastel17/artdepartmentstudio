import Sidebar from '@/components/Sidebar';

export default function TestHomeLayout({
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
