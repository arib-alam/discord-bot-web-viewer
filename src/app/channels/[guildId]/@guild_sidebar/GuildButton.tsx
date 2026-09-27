"use client";
import "client-only";

import { Button, Tooltip } from "@heroui/react";
import { useRouter } from "next/navigation";

import { cn } from "@/app/ui/components/cn";

export default function GuildButton({
  active,
  guildId,
  guildName,
  children,
}: React.PropsWithChildren<{
  active: boolean;
  guildId: string;
  guildName: string;
}>) {
  const router = useRouter();

  return (
    <div className="group flex flex-row items-center">
      <div
        className={cn(
          "mr-3 w-2 rounded-r-md bg-white transition-all",
          active ? "h-full" : "h-0 group-hover:h-1/2"
        )}
      />

      <Tooltip closeDelay={0} delay={50}>
        <Button
          className="relative size-14 shrink-0 overflow-hidden rounded-2xl p-0 transition-all hover:rounded-xl"
          variant="ghost"
          onClick={() => router.push(`/channels/${guildId}/home`)}
        >
          {children}
        </Button>

        <Tooltip.Content
          showArrow
          className="p-4"
          offset={12}
          placement="right"
        >
          <Tooltip.Arrow />
          <p className="text-lg font-bold"> {guildName}</p>
        </Tooltip.Content>
      </Tooltip>
    </div>
  );
}
