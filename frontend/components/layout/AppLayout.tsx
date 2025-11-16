"use client";

import { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

interface AppLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  title: string;
}

export function AppLayout(props: AppLayoutProps) {
  const { children, sidebar, title } = props;

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "240px",
      } as React.CSSProperties}>
      {sidebar}
      <SidebarInset>
        {/* Header with toggle button - shows on mobile */}
        <header className="flex h-16 shrink-0 bg-white items-center gap-2 border-b px-4 sm:hidden">
          <SidebarTrigger className="-ml-1" />
          <p className="text-2xl font-semibold">{title}</p>
        </header>
        <main className="flex-1 overflow-y-auto bg-[#FBFBFB]  lg:p-10 p-6">
          {children}
        </main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}

