import { db } from "@/db";
import NextAuth, { User, NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jhonDoe@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        const user = await db.user.findFirst({
          where: {
            email: email,
          },
        });

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!user || !isPasswordValid) {
          return null;
        }
        return { id: user.id, username: user.username, email: user.email };
      },
    }),
  ],
  secret: "fwt+mP&2^39UKGBk/hkJ4H~:Fy@_^,WNKTtPgXw$QyLCT6~p<M+afBY7W",
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
