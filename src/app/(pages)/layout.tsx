import { Sidebar, SidebarContent, SidebarProvider, SidebarFooter } from "@/components/ui/sidebar";
import "@/app/globals.css";
import type { ReactNode } from "react";
import { Archive, Cross, HandHeart, LayoutDashboard, LogOut, NotebookPen, SmilePlus } from "lucide-react";
import Link from "next/link";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
    <div className="flex min-h-screen bg-background text-foreground w-full">
      <Sidebar>
        <div className="flex justify-center items-center px-6 py-5 gap-2">
        {/* <Cross/> */}
        {/* <p className="font-semibold text-3xl">Derm.AI</p> */}
          <img src="/dermai_logo.png" className="w-36 h-16" alt="" />
        </div>

        <SidebarContent>
            {/* Navigation */}
            <nav className="flex flex-col gap-1 px-4 mt-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-md font-medium hover:bg-muted transition"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>

              <Link
                href="/archive"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-md font-medium hover:bg-muted transition"
              >
                <Archive className="w-5 h-5" />
                Archive
              </Link>

              <Link 
                href="/journal"                 
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-md font-medium hover:bg-muted transition"
              >
                <NotebookPen className="w-5 h-5" />
                Journal
              </Link>
              <Link href='/analysis'
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-md font-medium hover:bg-muted transition"
              >
                <SmilePlus className="w-5 h-5"/>
                New analysis
              </Link>
            </nav>
          </SidebarContent>
          <SidebarFooter className="mb-3">
            <nav className="flex flex-col gap-1 px-4 mt-4">
              <Link href="/auth/logout"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-md font-medium hover:bg-muted transition"
              > 
                <LogOut className="w-5 h-5"/>
                Log out
              </Link>
            </nav>
          </SidebarFooter>
      </Sidebar>
      <main className="flex-1 p-8">{children}</main>
    </div>
    </SidebarProvider>
  );
}
