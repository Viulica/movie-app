"use client";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { StarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";

export default function Watched() {
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
        <StarIcon className="h-12 w-12 text-gray-400" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>Gledano</EmptyTitle>
        <EmptyDescription>
          Ovdje će se prikazivati vaše recenzije i ocjene filmova koje ste
          gledali.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
