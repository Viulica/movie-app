"use client";

import * as React from "react";

import { NavUserSidebar } from "@/components/nav-user-sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Spinner } from "./ui/spinner";
import { usePathname } from "next/navigation";
import { navigationLinks } from "@/lib/navigation";

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white px-4 py-2">
          Filmovi
        </h1>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="">
          {navigationLinks.map((item) => (
            <SidebarMenuItem key={item.title} className={"mx-1"}>
              <Link href={item.url}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={"px-2 cursor-pointer"}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <NavUserSidebar />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
