import type { Metadata } from "next";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";``

import ChannelView, { getChannelInfo } from "./ChannelView";
import Loading from "./loading";

export async function generateMetadata(
  props: PageProps<"/channels/[guildId]/[channelId]">
): Promise<Metadata> {
  const { channelId } = await props.params;

  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("discord_bot_token");
  if (!tokenCookie) return redirect("/login");
  const token = tokenCookie.value;

  const channelResponse = await getChannelInfo(token, channelId);

  if (!channelResponse.success) {
    return { title: { absolute: "Invalid Channel" } };
  } else {
    return { title: { absolute: `#${channelResponse.data.name}` } };
  }
}

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <ChannelView />
    </Suspense>
  );
}
