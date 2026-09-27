"use client";

import "client-only";
import type { RESTGetAPIGuildChannelsResult } from "discord-api-types/v10";

import { cn } from "@heroui/react";
import { ChannelType } from "discord-api-types/v10";
import { usePathname } from "next/navigation";

import AnnotationQuestion from "@/app/ui/svg/AnnotationQuestion";
import Announcement from "@/app/ui/svg/Announcement";
import Hash from "@/app/ui/svg/Hash";
import MessageChatCircle from "@/app/ui/svg/MessageChatCircle";
import Signal from "@/app/ui/svg/Signal";
import VolumeMax from "@/app/ui/svg/VolumeMax";

import ChannelButton from "./ChannelButton";

export default function ChannelScrollContainer({
  channels,
}: React.PropsWithChildren<{
  channels: RESTGetAPIGuildChannelsResult;
}>) {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");

  const [, , guildId, channelId] = pathnameParts;
  if (!guildId) throw new Error("guildId not found");

  const channelComponents = [];

  for (const channel of channels) {
    // Channel categories
    if (channel.type === ChannelType.GuildCategory) {
      channelComponents.push(
        <p
          key={channel.id}
          className="text-muted group-hover:text-foreground text-md mt-6 mb-2 truncate px-5 font-semibold tracking-wide"
        >
          {channel.name}
        </p>
      );
    }

    // Viewable channel options
    else if (
      channel.type === ChannelType.GuildText ||
      channel.type === ChannelType.GuildAnnouncement
    ) {
      let icon;

      if (channel.type === ChannelType.GuildText) {
        icon = (
          <Hash
            className={cn(
              "text-muted aspect-square size-6",
              channel.id === channelId && "text-foreground"
            )}
          />
        );
      } else if (channel.type === ChannelType.GuildAnnouncement) {
        icon = (
          <Announcement
            className={cn(
              "text-muted aspect-square size-6",
              channel.id === channelId && "text-foreground"
            )}
          />
        );
      }

      channelComponents.push(
        <ChannelButton
          key={channel.id}
          active={channel.id === channelId}
          channelId={channel.id}
          guildId={guildId}
        >
          {icon}
          <p
            className={cn(
              "text-muted group-hover:text-foreground truncate text-lg font-semibold tracking-wide",
              channel.id === channelId && "text-foreground"
            )}
          >
            {channel.name}
          </p>
        </ChannelButton>
      );
    }

    // Disabled channel options
    else if (
      channel.type === ChannelType.GuildVoice ||
      channel.type === ChannelType.GuildForum ||
      channel.type === ChannelType.GuildMedia ||
      channel.type === ChannelType.GuildStageVoice
    ) {
      let icon;

      if (channel.type === ChannelType.GuildVoice) {
        icon = (
          <VolumeMax
            className={cn(
              "text-muted aspect-square size-6",
              channel.id === channelId && "text-foreground"
            )}
          />
        );
      } else if (
        channel.type === ChannelType.GuildForum ||
        channel.type === ChannelType.GuildMedia
      ) {
        icon = (
          <MessageChatCircle
            className={cn(
              "text-muted aspect-square size-6",
              channel.id === channelId && "text-foreground"
            )}
          />
        );
      } else if (channel.type === ChannelType.GuildStageVoice) {
        icon = (
          <Signal
            className={cn(
              "text-muted aspect-square size-6",
              channel.id === channelId && "text-foreground"
            )}
          />
        );
      }

      channelComponents.push(
        <ChannelButton
          key={channel.id}
          isDisabled
          active={channel.id === channelId}
          channelId={channel.id}
          guildId={guildId}
        >
          {icon}
          <p
            className={cn(
              "text-muted group-hover:text-foreground truncate text-lg font-semibold tracking-wide",
              channel.id === channelId && "text-foreground"
            )}
          >
            {channel.name}
          </p>
        </ChannelButton>
      );
    }

    // Fallback case
    else {
      const icon = (
        <AnnotationQuestion
          className={cn(
            "text-muted aspect-square size-6",
            channel.id === channelId && "text-foreground"
          )}
        />
      );

      channelComponents.push(
        <ChannelButton
          key={channel.id}
          isDisabled
          active={channel.id === channelId}
          channelId={channel.id}
          guildId={guildId}
        >
          {icon}
          <p
            key={channelId}
            className={cn(
              "text-muted group-hover:text-foreground truncate text-lg font-semibold tracking-wide",
              channel.id === channelId && "text-foreground"
            )}
          >
            {channel.name}
          </p>
        </ChannelButton>
      );
    }
  }

  return (
    <div className="scrollbar-hidden flex flex-col justify-start overflow-y-auto">
      <div className="flex flex-col justify-start">{channelComponents}</div>
    </div>
  );
}
