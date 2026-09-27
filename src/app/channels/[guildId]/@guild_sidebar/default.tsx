import { Suspense } from "react";

import GuildSidebar from "./GuildSidebar";
import Loading from "./loading";

export default function Default() {
  return (
    <Suspense fallback={<Loading />}>
      <GuildSidebar />
    </Suspense>
  );
}
