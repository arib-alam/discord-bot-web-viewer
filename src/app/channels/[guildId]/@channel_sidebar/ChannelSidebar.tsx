"use server";

import "server-only";

import type { RESTGetAPIGuildChannelsResult } from "discord-api-types/rest";
import type { RESTGetAPIGuildResult } from "discord-api-types/v10";

import { REST } from "@discordjs/rest";
import { Separator } from "@heroui/react";
import { Routes } from "discord-api-types/rest";
import { cacheLife } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import ChannelScrollContainer from "./ChannelScrollContainer";
import Loading from "./loading";

export default async function ChannelSidebar() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("discord_bot_token");
  if (!tokenCookie) return redirect("/login");
  const token = tokenCookie.value;

  const headersList = await headers();
  const xUrlHrefHeader = headersList.get("x-url-href");
  if (!xUrlHrefHeader) throw new Error("x-url-href header not found");
  const url = new URL(xUrlHrefHeader);

  const pathname = url.pathname;
  const pathnameParts = pathname.split("/");
  const [, , guildId] = pathnameParts;
  if (!guildId) throw new Error("guildId not found");

  if (!/^\d+$/.test(guildId)) return <Loading />;

  const guildResponse = await getGuildInfo(token, guildId);
  const channelsResponse = await getGuildChannels(token, guildId);

  if (!guildResponse.success) return <Loading />;
  if (!channelsResponse.success) return <Loading />;

  return (
    <div className="bg-background border-separator relative flex min-w-0 grow flex-col justify-start rounded-tl-2xl border-t border-l">
      <h1 className="flex h-16 shrink-0 flex-row items-center justify-start truncate pl-4 text-xl font-semibold">
        {guildResponse.data.name}
      </h1>
      <Separator />
      <ChannelScrollContainer channels={channelsResponse.data} />;
    </div>
  );
}

async function getGuildInfo(token: string, guildId: string) {
  "use cache";
  cacheLife("hours");

  const rest = new REST({ version: "10" }).setToken(token);

  try {
    const response = (await rest.get(
      Routes.guild(guildId)
    )) as RESTGetAPIGuildResult;

    return { success: true, data: response } as const;
  } catch (error) {
    return { success: false, error: error as Error } as const;
  }
}

async function getGuildChannels(token: string, guildId: string) {
  "use cache";
  cacheLife("minutes");

  const rest = new REST({ version: "10" }).setToken(token);

  try {
    const response = (await rest.get(
      Routes.guildChannels(guildId)
    )) as RESTGetAPIGuildChannelsResult;

    return { success: true, data: response } as const;
  } catch (error) {
    return { success: false, error: error as Error } as const;
  }
}
