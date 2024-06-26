import prisma from "@/lib/prisma";
import PrismaAdapter from "@/lib/PrismaAdapter";
import { User as U } from "@/types";
import type { NextAuthOptions, Session, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";

export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET as string,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_ID as string,
      clientSecret: process.env.DISCORD_SECRET as string,
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],

  callbacks: {
    async session({ session, user }: { session: Session; user?: User }) {
      const user1 = user as unknown as U;
      if (user1) {
        const img = await prisma.images.findFirst({
          where: { id: user1.profile_picture_id },
        });
        user1.image_url = img?.raw_image ?? "";
        session.user = user1;
      }
      return session;
    },
    redirect({ baseUrl }) {
      return baseUrl;
    },
  },

  adapter: PrismaAdapter(prisma),
};
