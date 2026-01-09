import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function DashboardHeader({ user }) {
  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Filmovi
        </h1>
        <div className="flex items-center gap-3">
          {user?.image && (
            <img
              src={user.image}
              alt={user.name}
              className="h-8 w-8 rounded-full"
            />
          )}
          <div className="hidden sm:block text-right">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email}
            </div>
          </div>
          <Button onClick={() => signOut()} variant="outline">
            Odjavi se
          </Button>
        </div>
      </div>
    </header>
  );
}
