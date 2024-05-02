// route.tsx
import prisma from "@/lib/prisma";
import { options } from "@/app/api/auth/[...nextauth]/option";
import { getServerSession } from "next-auth";
import { Session } from "@/types";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, { params }: Params) {
  const { id } = params;
  let org = await prisma.organizations.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      owner: {
        select: {
          id: true,
          first_name: true,
          name: true,
          email_address: true,
          profile_picture: true,
        },
      },
      // Include OrganizationsMemberships as 'members'
      OrganizationsMemberships: {
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              name: true,
              email_address: true,
              profile_picture: true,
            },
          },
        },
      },
      logo: true,
    },
  });

  if (!org) {
    return new Response("Organization not found", { status: 404 });
  } else
    return new Response(JSON.stringify(publicOrg(org)), {
      headers: { "content-type": "application/json" },
    });
}

/**
 * Met à jour une organisation dans la base de données.
 * @param request Requête HTTP
 * @param params Paramètres de la requête
 * @returns Réponse HTTP avec les données mises à jour de l'organisation
 */
export async function PUT(request: Request, { params }: Params) {
  let session = (await getServerSession(options)) as unknown as Session | null;
  const requestData = await request.json();
  const { id } = params;

  const currentOrg = await prisma.organizations.findUnique({
    where: {
      id: parseInt(id as string),
    },
  });

  try {
    // Vérifier si l'organisation existe
    if (!currentOrg) {
      return new Response("Organization not found", { status: 404 });
    }

    // Vérifier si l'utilisateur est autorisé à effectuer la mise à jour
    if (requestData.owner_id && currentOrg.owner_id !== session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Mettre à jour les données de l'organisation
    const newOrgData = {
      name: requestData.name ? requestData.name : currentOrg.name,
      owner_id: requestData.owner_id
        ? parseInt(requestData.owner_id)
        : currentOrg.owner_id,
      logo_id: requestData.logo_id
        ? parseInt(requestData.logo_id)
        : currentOrg.logo_id,
    };

    let data = await prisma.organizations.update({
      where: {
        id: parseInt(id as string),
      },
      data: {
        name: newOrgData.name,
        logo: newOrgData.logo_id
          ? {
              connect: {
                id: newOrgData.logo_id,
              },
            }
          : {
              create: {
                raw_image: requestData.logo,
              },
            },
        owner: {
          connect: {
            id: newOrgData.owner_id,
          },
        },
      },
    });

    if (data)
      return new Response(JSON.stringify(publicOrg(data)), {
        headers: { "content-type": "application/json" },
      });
  } catch (error) {
    console.error("Error updating organization:", error);
    return new Response("Error updating organization", { status: 500 });
  }
}

/**
 * Supprime une organisation de la base de données.
 * @param request Requête HTTP
 * @param params Paramètres de la requête
 * @returns Réponse HTTP avec les données de l'organisation supprimée
 */
export async function DELETE(request: Request, { params }: Params) {
  const { id } = params;
  const org = await prisma.organizations.findUnique({
    where: {
      id: parseInt(id as string),
    },
  });
  const session = (await getServerSession(
    options,
  )) as unknown as Session | null;

  try {
    // Vérifier si l'organisation existe
    if (!org) {
      return new Response("Organization not found", { status: 404 });
    }
    // Vérifier si l'utilisateur est autorisé à effectuer la suppression
    if (org.owner_id != session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }
    // Supprimer l'organisation
    const data = await prisma.organizations.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    return new Response(JSON.stringify(data), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting organization:", error);
    return new Response("Error deleting organization", { status: 500 });
  }
}

function publicOrg(org: any) {
  if (!org) {
    return null;
  }

  return {
    id: org.id,
    name: org.name,
    owner: org.owner,
    logo: org.logo,
    members: org.OrganizationsMemberships.map((member: any) =>
      publicUser(member.user),
    ),
  };
}

function publicUser(user: any) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    first_name: user.first_name,
    name: user.name,
    email_address: user.email_address,
    profile_picture: user.profile_picture,
  };
}
