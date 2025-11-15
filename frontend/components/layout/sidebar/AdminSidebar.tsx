"use client";

import { Home, History, RefreshCw, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="pt-10 pb-0 px-0 bg-white">
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-[40px] font-semibold text-black">Admin</h1>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup className="p-0">
          <SidebarMenu className="gap-0">
            <SidebarMenuItem className="p-2">
              <SidebarMenuButton
                asChild
                isActive={pathname === "/admin/home"}
                tooltip="Home"
                className="w-full h-full px-2! py-6! hover:bg-[#EAF5F9] data-[active=true]:bg-[#EAF5F9]"
              >
                <Link href="/admin/home">
                  <div className="flex items-center gap-[10px]">
                    <Home className="h-6 w-6" />
                    <span className="text-2xl text-black font-normal">Home</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="p-2">
              <SidebarMenuButton
                asChild
                isActive={pathname === "/admin/history"}
                tooltip="History"
                className="w-full h-full px-2! py-6! hover:bg-[#EAF5F9] data-[active=true]:bg-[#EAF5F9]"
              >
                <Link href="/admin/history">
                  <div className="flex items-center gap-[10px]">
                    <History className="h-6 w-6" />
                    <span className="text-2xl text-black font-normal">History</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="p-0">
          <SidebarMenu>
            <SidebarMenuItem className="p-2">
              <SidebarMenuButton
                asChild
                tooltip="Switch to User"
                className="w-full h-full px-2! py-6! hover:bg-[#EAF5F9]"
              >
                <Link href="/user/booking">
                  <div className="flex items-center gap-[10px]">
                    <RefreshCw className="h-6 w-6" />
                    <span className="text-2xl text-black font-normal">Switch to user</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="pb-10 px-0 bg-white">
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

