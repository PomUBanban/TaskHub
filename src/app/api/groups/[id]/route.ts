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
  let grp = await prisma.groups.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      chief: {
        select: {
          id: true,
          first_name: true,
          name: true,
          email_address: true,
          profile_picture: true,
        },
      },
      // @ts-ignore
      // Include GroupsMemberships as 'members'
      GroupsMemberships: {
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
      organization: true,
    },
  });

  if (!grp) {
    return new Response("Group not found", { status: 404 });
  } else return new Response(JSON.stringify(publicGrp(grp)), {
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
  const session = await getServerSession(options) as unknown as Session;
  const requestData = await request.json();
  const { id } = params;

  const currentGrp = await prisma.groups.findUnique({
    where: {
      id: parseInt(id as string),
    },
  });

  try {
    // Vérifier si l'organisation existe
    if (!currentGrp) {
      return new Response("Group not found", { status: 404 });
    }

    // Vérifier si l'utilisateur est autorisé à effectuer la mise à jour
    if (requestData.chief_id && currentGrp.chief_id !== session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Mettre à jour les données de l'organisation
    const newGrpData = {
      name: requestData.name ? requestData.name : currentGrp.name,
      chief_id: requestData.chief_id
        ? parseInt(requestData.chief_id)
        : currentGrp.chief_id,
      organization_id: requestData.organization_id
        ? parseInt(requestData.organization_id)
        : currentGrp.organization_id,
    };

    let data = await prisma.groups.update({
      where: {
        id: parseInt(id as string),
      },
      data: {
        name: newGrpData.name,
        organization: {
              connect: {
                id: newGrpData.organization_id,
              },
            },
        chief: {
          connect: {
            id: newGrpData.chief_id,
          },
        },
      },
    });
    
    if (data) return new Response(JSON.stringify(publicGrp(data)), {
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
  const grp = await prisma.groups.findUnique({
    where: {
      id: parseInt(id as string),
    },
  });
  const session = (await getServerSession(options)) as unknown as Session;

  try {
    // Vérifier si l'organisation existe
    if (!grp) {
      return new Response("Group not found", { status: 404 });
    }
    // Vérifier si l'utilisateur est autorisé à effectuer la suppression
    if (grp.chief_id != session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }
    // Supprimer l'organisation
    const data = await prisma.groups.delete({
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

function publicGrp(grp: any) {
  if (!grp) {
    return null;
  }

  return {
    id: grp.id,
    name: grp.name,
    chief: grp.chief,
    organization: grp.organization,
    members: grp.GroupsMemberships.map((member: any) =>
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
