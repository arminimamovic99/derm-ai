import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import "@/app/globals.css";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
    <div className="flex min-h-screen bg-background text-foreground w-full">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
    </SidebarProvider>
  );
}
