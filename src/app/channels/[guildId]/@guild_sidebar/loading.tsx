import { Skeleton } from "@heroui/react";

export default function Loading() {
  const skeletonGuilds = [];

  for (let i = 0; i < 30; i++) {
    skeletonGuilds.push(
      <Skeleton key={i} className="ml-5 size-14 shrink-0 rounded-2xl" />
    );
  }

  return (
    <div className="scrollbar-hidden mr-5 flex shrink-0 flex-col items-center justify-start gap-y-4 overflow-hidden py-5">
      {skeletonGuilds}
    </div>
  );
}
