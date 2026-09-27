"use client";
import "client-only";

import type { RESTGetAPICurrentUserGuildsResult } from "discord-api-types/v10";

import NextImage from "next/image";
import { usePathname } from "next/navigation";

import Images from "@/app/config/images";

import GuildButton from "./GuildButton";

export default function GuildScrollContainer({
  guilds,
}: React.PropsWithChildren<{ guilds: RESTGetAPICurrentUserGuildsResult }>) {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");

  const [, , guildId] = pathnameParts;
  if (!guildId) throw new Error("guildId not found");

  const guildComponents = [];

  for (const guild of guilds) {
    let guildIcon;

    if (guild.icon === null) {
      let guildAcronym;

      const mainCharacters = /\b./g.exec(guild.name);

      if (mainCharacters) {
        guildAcronym = mainCharacters.slice(0, 3).join("");
      } else {
        guildAcronym = guild.name.slice(0, 1);
      }

      guildIcon = (
        <p className="bg-surface group-hover:bg-accent flex size-full items-center justify-center text-xl font-bold transition-colors">
          {guildAcronym}
        </p>
      );
    } else {
      guildIcon = (
        <NextImage
          fill
          alt={guild.name}
          loading="lazy"
          sizes="(max-width: 512px) 100vw, 512px"
          src={Images.Guild.IconUrl(guild)}
        />
      );
    }

    guildComponents.push(
      <GuildButton
        key={guild.id}
        active={guild.id === guildId}
        guildId={guild.id}
        guildName={guild.name}
      >
        {guildIcon}
      </GuildButton>
    );
  }

  return (
    <div className="scrollbar-hidden mr-5 flex shrink-0 flex-col items-center justify-start gap-y-4 overflow-y-auto py-5">
      {guildComponents}
    </div>
  );
}
