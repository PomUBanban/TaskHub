import prisma from "@/lib/prisma";
import { options } from "@/app/api/auth/[...nextauth]/option";
import { getServerSession } from "next-auth";


/**
 * Récupère la liste des utilisateurs dans la base de données.
 * @returns Réponse HTTP avec la liste des utilisateurs
 */
export async function GET() {
    // Fetch users
    const users = await prisma.users.findMany({
        include: {
            owned_organization: true,
            organizationsMemberships: {
                include: {
                    organization: true,
                },
            },
        },
    });

    // Rename all organizationsMemberships to organizations
    users.forEach((user) => {
        user.organizations = []
        user.organizationsMemberships.forEach((membership) => {
            user.organizations.push(membership.organization);
        });

        delete user.organizationsMemberships;
        delete user.password;
    });

    return new Response(JSON.stringify(users), {
        headers: { "content-type": "application/json" },
    });
}
