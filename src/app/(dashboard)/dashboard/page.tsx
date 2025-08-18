
import "@/app/globals.css";
import { Sidebar } from "@/components/ui/sidebar";
import type { ReactNode } from "react";


export default function DashboardPage() {
    return (
      <div>
        <h2 className="font-semibold text-3xl mb-4">Dashboard</h2>
        <p className="text-muted-foreground">
          This is where your post-analysis dashboard will live.
        </p>
      </div>
    );
  }
  