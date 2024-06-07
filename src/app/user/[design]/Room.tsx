"use client";

import { ReactNode } from "react";
import { RoomProvider } from "../../../../liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import { LiveMap } from "@liveblocks/client";
import CanvasLoader from "@/components/CanvasLoader";

export function Room({
  roomId,
  children,
}: {
  roomId: string;
  children: ReactNode;
}) {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{ cursor: null, cursorColor: null, editingText: null }}
      initialStorage={{
        canvasObjects: new LiveMap(),
      }}
    >
      <ClientSideSuspense fallback={<CanvasLoader />}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
