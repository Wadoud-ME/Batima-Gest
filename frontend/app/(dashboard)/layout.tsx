import { Sidebar } from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground w-full relative">
      <div className="hidden lg:flex lg:flex-col lg:inset-y-0 lg:fixed lg:w-64 z-50">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col lg:pl-64 lg:static lg:h-full overflow-hidden w-full">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
