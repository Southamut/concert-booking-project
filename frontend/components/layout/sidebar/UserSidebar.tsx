"use client";

import { RefreshCw, LogOut } from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function UserSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="pt-10 pb-0 px-0">
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-[40px] font-semibold text-black">User</h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="p-0">
          <SidebarMenu>
            <SidebarMenuItem className="p-2">
              <SidebarMenuButton
                asChild
                tooltip="Switch to Admin"
                className="w-full h-full pl-2! pr-0 py-6! hover:bg-[#EAF5F9]">
                <Link href="/admin/home">
                  <div className="flex items-center gap-[10px]">
                    <RefreshCw className="h-6 w-6" />
                    <span className="text-2xl text-black font-normal">Switch to Admin</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="pb-10 px-0">
        <SidebarMenu>
          <SidebarMenuItem className="p-2">
            <SidebarMenuButton tooltip="Logout" className="w-full h-full px-2! py-6! hover:bg-[#EAF5F9]">
              <div className="flex items-center gap-[10px]">
                <LogOut className="h-6 w-6" />
                <span className="text-2xl text-black font-normal">Logout</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

