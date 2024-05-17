import { User as U } from "next-auth";

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

export interface Boards {
  id: number;
  name: string;
  organization_id: number;
  icon_id: number;
  background_id: number;
  organization: Organizations;
  icon: Images;
  background: Images;
}
