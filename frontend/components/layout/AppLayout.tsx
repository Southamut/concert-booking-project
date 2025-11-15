"use client";

import { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export function AppLayout(props: AppLayoutProps) {
  const { children, sidebar } = props;

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "240px",
      } as React.CSSProperties}>
      {sidebar}
      <SidebarInset>
        <main className="flex-1 overflow-y-auto bg-white p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

