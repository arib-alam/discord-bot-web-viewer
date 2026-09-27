import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete("discord_bot_token");
  cookieStore.delete("discord_bot_user");

  return redirect("/login");
}
