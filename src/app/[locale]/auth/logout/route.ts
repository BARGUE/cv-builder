import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/src/lib/auth";

/** GET /[locale]/auth/logout : supprime le token et redirige vers l'accueil de la locale. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await clearSessionCookie();
  return NextResponse.redirect(new URL(`/${locale}`, req.url));
}
