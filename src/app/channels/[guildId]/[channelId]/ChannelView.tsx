"use server";

import "server-only";

import type {
  RESTGetAPIChannelMessagesResult,
  RESTGetAPIChannelResult,
} from "discord-api-types/v10";

import { REST } from "@discordjs/rest";
import { Input, Separator } from "@heroui/react";
import { Routes } from "discord-api-types/rest";
import { cacheLife } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import Hash from "@/app/ui/svg/Hash";

import Loading from "./loading";
import MessageScrollContainer from "./MessageScrollContainer";

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
  const [, , , channelId] = pathnameParts;
  if (!channelId) throw new Error("guildId not found");

  if (!/^\d+$/.test(channelId)) return <Loading />;

  const channelResponse = await getChannelInfo(token, channelId);
  const messagesResponse = await getChannelMessages(token, channelId);

  if (!channelResponse.success) return <Loading />;
  if (!messagesResponse.success) return <Loading />;

  return (
    <div className="bg-surface border-separator-secondary relative flex min-h-0 min-w-0 grow flex-col border-t">
      <div className="flex h-16 w-full shrink-0 flex-row items-center justify-start gap-x-2 pl-6">
        <Hash className="text-muted size-6" />
        <h2 className="text-lg font-bold">{channelResponse.data.name}</h2>
      </div>

      <Separator variant="secondary" />

      <MessageScrollContainer messages={messagesResponse.data} />

      <Input
        disabled
        className="m-4 h-18 shrink-0 pl-8"
        placeholder={`Message #${channelResponse.data.name}`}
        variant="secondary"
      />
    </div>
  );
}

export async function getChannelInfo(token: string, channelId: string) {
  "use cache";
  cacheLife("hours");

  const rest = new REST({ version: "10" }).setToken(token);

  try {
    const response = (await rest.get(
      Routes.channel(channelId)
    )) as RESTGetAPIChannelResult;

    return { success: true, data: response } as const;
  } catch (error) {
    return { success: false, error: error as Error } as const;
  }
}

export async function getChannelMessages(token: string, channelId: string) {
  "use cache";
  cacheLife("minutes");

  const rest = new REST({ version: "10" }).setToken(token);

  try {
    const searchParams = new URLSearchParams();
    searchParams.set("limit", "100");

    const response = (await rest.get(Routes.channelMessages(channelId), {
      query: searchParams,
    })) as RESTGetAPIChannelMessagesResult;

    return { success: true, data: response } as const;
  } catch (error) {
    return { success: false, error: error as Error } as const;
  }
}
