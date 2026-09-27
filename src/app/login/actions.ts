"use server";

import "server-only";

import type { APIUser, RESTGetAPIUserResult } from "discord-api-types/v10";

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { cacheLife } from "next/cache";
import { cookies } from "next/headers";

import Images from "../config/images";

export async function getUserMe(token: string) {
  "use cache";
  cacheLife("minutes");

  const rest = new REST({ version: "10" }).setToken(token);

  try {
    const response = (await rest.get(
      Routes.user("@me")
    )) as RESTGetAPIUserResult;
    return { success: true, data: response } as const;
  } catch (error) {
    return { success: false, error: error as Error } as const;
  }
}

export async function saveTokenCookie(token: string, user: APIUser) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "discord_bot_token",
    value: token,

    domain: process.env.COOKIE_DOMAIN,

    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });
  cookieStore.set({
    name: "discord_bot_user",
    value: JSON.stringify({
      username: user.username,
      displayName: user.global_name ?? user.username,
      profilePicture: Images.User.AvatarUrl(user),
    }),

    domain: process.env.COOKIE_DOMAIN,

    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });
}
