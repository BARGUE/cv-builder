import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/** GET /auth/logout : supprime le token et redirige vers la page d'accueil. */
export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.set("access_token", "", { path: "/", maxAge: 0 });
  const url = new URL("/", req.url);
  return NextResponse.redirect(url);
}
