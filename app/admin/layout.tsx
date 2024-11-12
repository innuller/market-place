// app/dashboard/layout.tsx
import { Toaster } from '@/components/ui/toaster';
import { DashboardNavigation } from '@/components/DashboardNavigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <DashboardNavigation />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <Toaster />
    </div>
  );
}