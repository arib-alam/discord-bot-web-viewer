"use server";

import "server-only";

import { Link } from "@heroui/react";
import { cookies } from "next/headers";
import NextImage from "next/image";
import { redirect } from "next/navigation";

import LogOut from "@/app/ui/svg/LogOut";

export default async function UserPanel() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("discord_bot_user");
  if (!userCookie) return redirect("/login");
  const user = JSON.parse(userCookie.value);

  return (
    <div className="p-4">
      <div className="bg-surface flex h-18 w-full flex-row items-center justify-between rounded-xl p-4">
        <div className="flex flex-row items-center gap-x-4">
          <div className="relative size-12 overflow-hidden rounded-full">
            <NextImage
              fill
              alt={user.username}
              loading="eager"
              sizes="(max-width: 512px) 100vw, 512px"
              src={user.profilePicture}
            />
          </div>
          <div className="flex flex-col items-start">
            <p className="text-md truncate font-semibold">
              {" "}
              {user.displayName}
            </p>
            <p className="text-muted truncate text-xs tracking-wide">
              @{user.username}
            </p>
          </div>
        </div>

        <Link
          className="group hover:bg-foreground/10 aspect-square h-full scale-100 rounded-xl p-2 transition-all active:scale-95"
          href="/logout"
        >
          <LogOut className="text-muted group-hover:text-danger/80" />
        </Link>
      </div>
    </div>
  );
}
