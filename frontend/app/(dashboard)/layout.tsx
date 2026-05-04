import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import { DashboardLayoutClient } from "@/components/layout/DashboardLayoutClient";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardLayoutClient sidebar={<Sidebar />}>
        {children}
      </DashboardLayoutClient>
    </SidebarProvider>
  );
}
