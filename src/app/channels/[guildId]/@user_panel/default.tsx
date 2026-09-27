import { Suspense } from "react";

import Loading from "./loading";
import UserPanel from "./UserPanel";

export default function Default() {
  return (
    <Suspense fallback={<Loading />}>
      <UserPanel />
    </Suspense>
  );
}
