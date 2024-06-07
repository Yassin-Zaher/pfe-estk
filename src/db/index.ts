import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

declare global {
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }

  prisma = global.cachedPrisma;
}

export async function syncUser(clerkUserId) {
  let user = await prisma.user.findUnique({
    where: { id: clerkUserId },
  });

  if (!user) {
    const clerkUser = await currentUser();

    // Create a new user in the local database
    user = await prisma.user.create({
      data: {
        id: clerkUserId,
        email: clerkUser.emailAddresses[0].emailAddress,
        password: "login",
      },
    });
  }

  return user;
}

export const db = prisma;
