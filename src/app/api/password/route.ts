import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updatePasswordApi } from "@/src/services/auth/api";

export async function PATCH(request: Request) {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  let body: { newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const newPassword = body.newPassword;
  if (typeof newPassword !== "string" || newPassword.length < 6) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins 6 caractères." },
      { status: 400 },
    );
  }

  try {
    await updatePasswordApi(token, newPassword);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
