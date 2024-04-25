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

export interface Organizations extends Orgs {
  id: number;
  name: string;
  owner_id: number;
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
    raw_image: string;
  };
};
