import type { NextRequest } from "next/server";

import Negotiator from "negotiator";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

function getLocale(request: NextRequest) {
  const headersObject: Record<string, string> = {};

  for (const [key, value] of request.headers.entries()) {
    headersObject[key] = value;
  }

  const languages = new Negotiator({ headers: headersObject }).languages();

  if (languages.length === 1 && languages[0] === "*") {
    languages.splice(0, 1);
  }

  return Intl.DateTimeFormat.supportedLocalesOf(languages)[0] ?? "en";
}

export async function proxy(request: NextRequest) {
  const cookies = request.cookies;
  if (
    !cookies.has("discord_bot_token") &&
    request.nextUrl.pathname !== "/login"
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url-href", request.nextUrl.href);
  requestHeaders.set("x-locale", getLocale(request));

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  return response;
}
