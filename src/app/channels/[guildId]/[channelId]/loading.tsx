import { Skeleton } from "@heroui/react";

export default function Loading() {
  const skeletonMessages = [];

  for (let i = 0; i < 6; i++) {
    skeletonMessages.push(
      <div key={i} className="mt-6 flex flex-col py-1 pt-2 pr-12 pl-6">
        <div className="flex flex-row items-start justify-start gap-6">
          <Skeleton className="relative size-14 shrink-0 overflow-hidden rounded-full" />

          <div className="min-w-0">
            <Skeleton className="h-4 w-48 rounded-lg" />
            <Skeleton className="mt-2 h-2 w-32 rounded-lg" />
            <Skeleton className="mt-2 h-2 w-42 rounded-lg" />
            <Skeleton className="mt-2 h-2 w-52 rounded-lg" />
            <Skeleton className="mt-2 h-2 w-38 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface relative flex min-h-0 min-w-0 grow flex-col">
      <Skeleton className="m-4 h-8 w-96 shrink-0 flex-row" />

      <div className="scrollbar-hidden mb-24 flex min-h-0 grow flex-col justify-end">
        {skeletonMessages}
      </div>

      <div className="bg-surface z-50 m-4 h-18 shrink-0 pl-8" />
    </div>
  );
}
