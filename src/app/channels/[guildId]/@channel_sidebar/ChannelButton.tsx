"use client";
import "client-only";

import { Button, type ButtonRootProps } from "@heroui/react";
import { useRouter } from "next/navigation";

import { cn } from "@/app/ui/components/cn";

interface ChannelButtonProps extends ButtonRootProps {
  active: boolean;
  guildId: string;
  channelId: string;
  children?: React.ReactNode;
}

export default function ChannelButton({
  active,
  guildId,
  channelId,
  children,
  ...props
}: ChannelButtonProps) {
  const router = useRouter();

  return (
    <div key={channelId} className="w-full px-3">
      <Button
        {...props}
        className={cn(
          "group hover:bg-default-hover/80 flex h-fit w-full shrink-0 grow flex-row justify-start gap-3 rounded-xl p-0 px-3 py-2",
          active && "bg-default-hover hover:bg-default-hover"
        )}
        variant="ghost"
        onClick={() => router.push(`/channels/${guildId}/${channelId}`)}
      >
        {children}
      </Button>
    </div>
  );
}
