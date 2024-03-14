// route.tsx

import prisma from "@/lib/prisma";
import { options } from "@/app/api/auth/[...nextauth]/option";
import { getServerSession } from "next-auth";

type Params = {
  params: {
    id: string;
  };
};



/**
 * Met à jour une organisation dans la base de données.
 * @param request Requête HTTP
 * @param params Paramètres de la requête
 * @returns Réponse HTTP avec les données mises à jour de l'organisation
 */
export async function PUT(request: Request, { params }: Params) {
  const session = await getServerSession(options);
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

    const data = await prisma.organizations.update({
      where: {
        id: parseInt(id as string),
      },
      data: {
        name: newOrgData.name,
        logo: {
          connect: {
            id: newOrgData.logo_id,
          },
        },
        owner: {
          connect: {
            id: newOrgData.owner_id,
          },
        },
      },
    });

    return new Response(JSON.stringify(data), {
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
  const session = await getServerSession(options);

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
