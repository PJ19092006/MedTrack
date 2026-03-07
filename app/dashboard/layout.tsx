import { AppSidebar } from "@/MedTrack/components/app-sidebar";
import { SiteHeader } from "@/MedTrack/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/MedTrack/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />

      <SidebarInset className="overflow-hidden">
        <SiteHeader />

        <div className="flex flex-1 flex-col gap-4 p-6 overflow-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
