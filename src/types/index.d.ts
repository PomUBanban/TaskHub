import { JWT } from "next-auth/jwt";

declare module "TaskHub" {}

export interface Images {
  id: number;
  raw_image: string;
}

export interface User {
  id: number;
  email_address: string;
  first_name: string;
  name: ?string;
  password: ?string;
  profile_picture_id: number | -1;
  phone_number: ?string;
  role: "ADMIN" | "USER";
}

export interface Session {
  user: User;
  token: JWT;
}
