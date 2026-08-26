import { Sidebar } from '../../components/layout/Sidebar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-space-950">
      {/* 1. Sidebar (Fixed left) */}
      <Sidebar />
      
      {/* 2 & 3. Main Workspace Area (flex-1 handles the rest) */}
      <main className="flex-1 flex w-full h-full relative">
        {children}
      </main>
    </div>
  );
}
