"use client";

import { ReactNode } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export function AppLayout(props: AppLayoutProps) {
  const { children, sidebar } = props;

  return (
    <SidebarProvider>
      {sidebar}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <main className="flex-1 overflow-y-auto bg-white p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

