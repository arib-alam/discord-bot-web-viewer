"use client";

import "client-only";
import type { RESTGetAPIChannelMessagesResult } from "discord-api-types/v10";

import { usePathname } from "next/navigation";

import MessageSegment from "./MessageSegment";

export default function MessageScrollContainer({
  messages,
}: React.PropsWithChildren<{ messages: RESTGetAPIChannelMessagesResult }>) {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");

  const [, , guildId] = pathnameParts;
  if (!guildId) throw new Error("guildId not found");

  const messageComponents = [];
  let lastMessage;

  for (const message of [...messages].reverse()) {
    messageComponents.push(
      <MessageSegment
        key={message.id}
        hideAuthor={lastMessage?.author?.id === message.author.id}
        message={message}
      />
    );

    lastMessage = message;
  }

  return (
    <main className="hover:scrollbar-thumb-segment flex min-h-0 grow scrollbar-track-transparent flex-col overflow-y-auto py-6 transition-all">
      {messageComponents}
    </main>
  );
}
