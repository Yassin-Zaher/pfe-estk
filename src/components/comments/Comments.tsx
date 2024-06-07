"use client";

import { ClientSideSuspense } from "@liveblocks/react";
import { CommentsOverlay } from "./CommentsOverlay";

export const Comments = () => (
  <ClientSideSuspense fallback={null}>
    {() => <CommentsOverlay />}
  </ClientSideSuspense>
);
