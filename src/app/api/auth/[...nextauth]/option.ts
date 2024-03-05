import prisma from "@/lib/prisma";
import PrismaAdapter from "@/lib/PrismaAdapter";
import type { NextAuthOptions, Session, User } from "next-auth";

import CredentialProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";

export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET as string,
  providers: [
    CredentialProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
      },
      async authorize(credentials: any): Promise<any> {
        const user = await prisma.users.findFirst({
          where: { email_address: credentials.email },
        });
        if (user && user.password === credentials.password) {
          return user;
        } else {
          return null;
        }
      },
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],

  callbacks: {
    async session({ session, user }: { session: Session; user?: User }) {
      if (user) {
        session.user = user;
      }
      return session;
    },
    redirect({ baseUrl }) {
      return baseUrl;
    },
  },

  adapter: PrismaAdapter(prisma),
};
