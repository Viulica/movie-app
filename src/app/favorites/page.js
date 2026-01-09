"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { HeartIcon } from "lucide-react";

export default function Favorites() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <Empty>
      <EmptyMedia>
        <HeartIcon className="h-12 w-12 text-gray-400" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>Omiljeni</EmptyTitle>
        <EmptyDescription>
          Ovdje će se prikazivati vaši omiljeni filmovi koje ste lajkali.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
