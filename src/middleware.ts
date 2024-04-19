import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/option";
import { getServerSession } from "next-auth";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest, response: NextResponse) {
  /*  const session = await getServerSession(options);
    console.log(session);*/
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
