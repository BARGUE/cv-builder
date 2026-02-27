import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getMe } from "@/src/services/auth/api";

export async function GET() {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const user = await getMe(token);
    if (!user) {
      return NextResponse.json(
        { error: "Token invalide ou expiré" },
        { status: 401 }
      );
    }
    return NextResponse.json(user);
  } catch (err) {
    console.error("[GET /api/me]", err);
    return NextResponse.json(
      { error: "Erreur serveur (API auth indisponible)" },
      { status: 503 }
    );
  }
}
