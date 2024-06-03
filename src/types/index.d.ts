import { User as U } from "next-auth";
import { Organizations as Orgs } from "@prisma/client";

declare module "TaskHub" {}

export interface Images {
  id: number;
  raw_image: string;
}

export interface User extends U {
  id: number;
  email_address: string;
  first_name: string;
  name: ?string;
  password: ?string;
  profile_picture_id: number | -1;
  phone_number: ?string;
  image_url: string;
  role: "ADMIN" | "USER";
  first_connection: boolean;
}

export interface Session {
  user: User;
}



// model Groups {
//   id              Int    @id @default(autoincrement())
//   organization_id Int    @unique
//   chief_id        Int    @unique
//   name            String

//   chief             Users               @relation(fields: [chief_id], references: [id])
//   organization      Organizations       @relation(fields: [organization_id], references: [id])
//   GroupsMemberships GroupsMemberships[]
// }

export interface Groups {
  id: number;
  name: string;
  chief_id: number;
  organization_id: number;
  chief: {
    id: number;
    first_name: string;
    name: string;
    email_address: string;
    phone_number: string;
    profile_picture: {
      raw_image: string;
    };
  };
  GroupsMemberships?: {
    id: number;
    first_name: string;
    name: string;
    email_address: string;
    phone_number: string;
    profile_picture: {
      raw_image: string;
    };
  }[];
  organization: {
    id: number;
    name: string;
    owner: {
      id: number;
      first_name: string;
      name: string;
      email_address: string;
      phone_number: string;
      profile_picture: {
        raw_image: string;
      };
    };
    logo: {
      id: number;
      raw_image: string;
    };
  };
};

export type PublicGroups = {
  id: number;
  name: string;
  chief: {
    id: number;
    first_name: string;
    name: string;
    email_address: string;
    phone_number: string;
    profile_picture: {
      raw_image: string;
    };
  };
  members: {
    id: number;
    first_name: string;
    name: string;
    email_address: string;
    phone_number: string;
    profile_picture: {
      raw_image: string;
    };
  }[];
  organization: {
    id: number;
    name: string;
    owner: {
      id: number;
      first_name: string;
      name: string;
      email_address: string;
      phone_number: string;
      profile_picture: {
        raw_image: string;
      };
    };
    logo: {
      id: number;
      raw_image: string;
    };
  };
};


export interface Organizations extends Orgs {
  id: number;
  name: string;
  organisation_id: number;
  owner: {
    id: number;
    first_name: string;
    name: string;
    email_address: string;
    phone_number: string;
    profile_picture: {
      raw_image: string;
    };
  };
  OrganizationsMemberships?: {
    id: number;
    first_name: string;
    name: string;
    email_address: string;
    phone_number: string;
    profile_picture: {
      raw_image: string;
    };
  }[];
  logo_id: number;
  logo: {
    id: number;
    raw_image: string;
  };
};


export type PublicOrganizations = {
  id: number;
  name: string;
  owner: {
    id: number;
    first_name: string;
    name: string;
    email_address: string;
    phone_number: string;
    profile_picture: {
      raw_image: string;
    };
  };
  members: {
    id: number;
    first_name: string;
    name: string;
    email_address: string;
    phone_number: string;
    profile_picture: {
      raw_image: string;
    };
  }[];
  logo: {
    id: number;
    raw_image: string;
  };
};