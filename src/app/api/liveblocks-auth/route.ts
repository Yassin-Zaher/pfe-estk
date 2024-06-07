"use server";

import { getBoard } from "@/app/board/actions";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { NextResponse, type NextRequest } from "next/server";

const liveblocks = new Liveblocks({
  secret: process.env.NEXT_PUBLIC_LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(req: NextRequest) {
  const authorization = auth();
  const user = await currentUser();

  if (!authorization || !user)
    return new NextResponse("Unauthorized.", { status: 403 });

  const { room } = await req.json();
  const board = await getBoard({ id: room });

  if (board?.orgId !== authorization.orgId)
    return new NextResponse("Unauthorized.", { status: 403 });

  const userInfo = {
    name: user.firstName || "Teammate",
    picture: user.imageUrl,
  };

  const session = liveblocks.prepareSession(user.id, {
    userInfo,
  });

  if (room) {
    session.allow(room, session.FULL_ACCESS);

    const { status, body } = await session.authorize();
    return new Response(body, { status });
  }
}
