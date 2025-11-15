"use client";

import { ReactNode } from "react";
import { AppLayout } from "./AppLayout";
import { AdminSidebar } from "./sidebar/AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout(props: AdminLayoutProps) {
  const { children } = props;

  return <AppLayout sidebar={<AdminSidebar />}>{children}</AppLayout>;
}

