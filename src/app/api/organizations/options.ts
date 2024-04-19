import prisma from "@/lib/prisma";
import PrismaAdapter from "@/lib/PrismaAdapter";

import CredentialProvider from "next-auth/providers/credentials";

export const options = {
    providers: [
        CredentialProvider({
        name: "Credentials",
        credentials: {
            username: { label: "Username", type: "text" },
            password: { label: "Password", type: "password" },
        },
        authorize: async (credentials) => {
            const user = await prisma.user.findFirst({
            where: {
                username: credentials?.username,
                password: credentials?.password,
            },
            });
            if (user) {
            return Promise.resolve(user);
            } else {
            return Promise.resolve(null);
            }
        },
        }),
    ],
    adapter: PrismaAdapter(prisma),
};

export default options;