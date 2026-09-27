export default function Layout({
  children,
  channel_sidebar,
  guild_sidebar,
  user_panel,
}: LayoutProps<"/channels/[guildId]">) {
  return (
    <div className="flex h-dvh w-dvw flex-col">
      <div className="h-12 w-full shrink-0 bg-transparent" />

      <div className="flex min-h-0 grow flex-row">
        <div className="flex w-96 flex-col">
          <div className="relative flex min-h-0 grow flex-row">
            {guild_sidebar}
            {channel_sidebar}

            <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-6 w-24 bg-linear-to-b to-transparent" />
            <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-linear-to-t to-transparent" />
          </div>

          {user_panel}
        </div>

        {children}
      </div>
    </div>
  );
}
