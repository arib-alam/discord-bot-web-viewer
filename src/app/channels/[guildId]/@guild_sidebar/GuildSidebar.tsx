"use server";

import "server-only";

import type { RESTGetAPICurrentUserGuildsResult } from "discord-api-types/rest";

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/rest";
import { cacheLife } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import GuildScrollContainer from "./GuildScrollContainer";
import Loading from "./loading";

export default async function GuildSidebar() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("discord_bot_token");
  if (!tokenCookie) return redirect("/login");
  const token = tokenCookie.value;

  const response = await getUserGuilds(token);

  if (!response.success) return <Loading />;

  return <GuildScrollContainer guilds={response.data} />;
}

async function getUserGuilds(token: string) {
  "use cache";
  cacheLife("minutes");

  const rest = new REST({ version: "10" }).setToken(token);

  try {
    const guildsBatch = [];
    let after: string | undefined;

    for (let i = 0; i < 1; i++) {
      const searchParams = new URLSearchParams();
      searchParams.set("limit", "200");
      if (after) searchParams.set("after", after);

      const response = (await rest.get(Routes.userGuilds(), {
        query: searchParams,
      })) as RESTGetAPICurrentUserGuildsResult;

      guildsBatch.push(...response);

      if (response.length !== 200) break;

      after = response[response.length - 1].id;
    }

    return { success: true, data: guildsBatch } as const;
  } catch (error) {
    return { success: false, error: error as Error } as const;
  }
}
