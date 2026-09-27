import { Skeleton } from "@heroui/react";

export default function Loading() {
  const skeletonChannels = [];

  skeletonChannels.push(
    <div key={-1} className="w-full px-10">
      <Skeleton className="mt-4 mb-6 h-10 w-full rounded-lg" />
    </div>
  );

  for (let i = 0; i < 30; i++) {
    skeletonChannels.push(
      <div key={i} className="w-full px-6">
        <Skeleton className="my-2 h-8 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="scrollbar-hidden flex min-w-0 grow flex-col justify-start overflow-hidden rounded-tl-4xl">
      <div className="flex flex-col justify-start">{skeletonChannels}</div>
    </div>
  );
}
