import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateProfileApi } from "@/src/services/auth/api";

export async function PATCH(request: Request) {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  let body: { firstName?: string; lastName?: string; avatarUrl?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  try {
    const profile = await updateProfileApi(token, {
      firstName: body.firstName,
      lastName: body.lastName,
      avatarUrl: body.avatarUrl,
    });
    return NextResponse.json(profile);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
