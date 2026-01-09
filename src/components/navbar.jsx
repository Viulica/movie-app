"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { NavUserNavbar } from "@/components/nav-user-navbar";
import { navigationLinks } from "@/lib/navigation";

export function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-2 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Filmovi
          </h1>

          <nav className="hidden md:flex items-center gap-4">
            {navigationLinks.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center gap-1"
              >
                <item.icon className="size-4 mr-1" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <NavUserNavbar />
        </div>
      </div>
    </header>
  );
}
