import { Skeleton } from "@heroui/react";

export default function Loading() {
  return (
    <div className="bg-surface m-4 flex h-18 w-full flex-row items-center justify-between rounded-xl p-4">
      <div className="flex flex-row items-center gap-x-4">
        <Skeleton className="size-12 rounded-full" />

        <div className="flex flex-col items-start gap-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-2 w-24" />
        </div>
      </div>

      <Skeleton className="aspect-square h-full" />
    </div>
  );
}
