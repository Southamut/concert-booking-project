"use client";

import { ReactNode } from "react";
import { AppLayout } from "./AppLayout";
import { UserSidebar } from "./sidebar/UserSidebar";

interface UserLayoutProps {
  children: ReactNode;
}

export function UserLayout(props: UserLayoutProps) {
  const { children } = props;

  return <AppLayout sidebar={<UserSidebar />} title="User">{children}</AppLayout>;
}

