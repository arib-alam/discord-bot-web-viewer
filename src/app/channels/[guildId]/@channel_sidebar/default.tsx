import { Suspense } from "react";

import ChannelSidebar from "./ChannelSidebar";
import Loading from "./loading";

export default function Default() {
  return (
    <Suspense fallback={<Loading />}>
      <ChannelSidebar />
    </Suspense>
  );
}
