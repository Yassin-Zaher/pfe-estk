import React from "react";
import { LiveCursorProps } from "../../../types/type";
import Cursor from "./Cursor";
import { COLORS } from "../../../constants";
import { useOthers } from "../../../liveblocks.config";

const LiveCursors = () => {
  const others = useOthers();

  return others.map(({ connectionId, presence, info }) => {
    if (presence == null || !presence?.cursor) {
      return null;
    }
    return (
      <Cursor
        key={connectionId}
        color={COLORS[Number(connectionId) % COLORS.length]}
        x={presence.cursor.x}
        y={presence.cursor.y}
        message={presence.message}
        name={info.name}
      />
    );
  });
};

export default LiveCursors;
