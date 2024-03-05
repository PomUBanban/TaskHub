import { Adapter, AdapterSession } from "next-auth/adapters";

/** @return { import("next-auth/adapters").Adapter } */

/** @todo implement method they are not implemented */

export default function PrismaAdapter(client: any, options = {}): Adapter {
  return {
    async createUser(user): Promise<any> {
      const existingUser = await client.users.findUnique({
        where: { email_address: user.email },
      } as any);
      if (existingUser) {
        return existingUser;
      }
      let image;
      if (user.image) {
        image = await client.images.create({
          data: {
            raw_image: user.image,
          },
        });
      }
      return client.users.create({
        data: {
          email_address: user.email,
          first_name: user.name,
          profile_picture: {
            connect: { id: image.id },
          },
        },
      } as any);
    },

    async getUser(id) {
      const existingUser = await client.users.findUnique({
        where: { id: parseInt(id) },
      } as any);
      if (existingUser) {
        return existingUser;
      }
      return null;
    },

    async getUserByEmail(email) {
      const existingUser = await client.users.findUnique({
        where: { email_address: email },
      } as any);
      if (existingUser) {
        return existingUser;
      }
      return null;
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account = await client.account.findUnique({
        where: {
          providerId_providerAccountId: {
            providerId: provider,
            providerAccountId,
          },
        },
      } as any);
      if (!account) return null;
      return client.users.findUnique({
        where: { id: account.userId },
      } as any);
    },

    async updateUser(user) {
      throw new Error("Method not implemented.");
    },

    async deleteUser(userId) {
      await client.users.delete({
        where: { id: parseInt(userId) },
      } as any);
    },

    async linkAccount(account) {
      await client.account.create({
        data: {
          userId: account.userId,
          providerType: account.type,
          providerId: account.provider,
          providerAccountId: account.providerAccountId,
          accessToken: account.access_token,
        },
      } as any);
      return account;
    },

    async unlinkAccount({ providerAccountId, provider }) {
      await client.account.delete({
        where: {
          providerId_providerAccountId: {
            providerId: provider,
            providerAccountId,
          },
        },
      } as any);
    },

    async createSession(adapterSession: AdapterSession) {
      await client.sessions.create({
        data: {
          ...adapterSession,
        },
      } as any);
      return adapterSession;
    },

    async getSessionAndUser(sessionToken) {
      const session = await client.sessions.findUnique({
        where: { sessionToken: sessionToken },
      } as any);
      if (!session) return null;
      const user = await client.users.findUnique({
        where: { id: parseInt(session.userId) },
      } as any);
      if (!user) return null;
      return { session, user };
    },

    async updateSession(session) {
      const existingSession = await client.sessions.findUnique({
        where: { sessionToken: session.sessionToken },
      } as any);
      if (!existingSession) return null;

      return client.sessions.update({
        where: { sessionToken: session.sessionToken },
        data: {
          id: existingSession.id,
          ...session,
        },
      } as any);
    },

    async deleteSession(sessionToken) {
      const existingSession = await client.sessions.findUnique({
        where: { sessionToken: sessionToken },
      } as any);
      if (!existingSession) return null;
      return client.sessions.delete({
        where: { sessionToken: sessionToken },
      } as any);
    },

    async createVerificationToken({ identifier, expires, token }) {
      throw new Error("Method not implemented.");
    },

    async useVerificationToken({ identifier, token }) {
      throw new Error("Method not implemented.");
    },
  };
}
