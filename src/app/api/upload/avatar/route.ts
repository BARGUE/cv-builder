import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getMe, isSessionExpiredError } from "@/src/services/auth/api";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function getExtension(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "jpg";
}

export async function POST(request: Request) {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  let user;
  try {
    user = await getMe(token);
  } catch (e) {
    if (isSessionExpiredError(e)) {
      return NextResponse.json({ error: "Session expirée" }, { status: 401 });
    }
    throw e;
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "L'image ne doit pas dépasser 2 Mo." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Type d'image non autorisé." }, { status: 400 });
  }

  const ext = getExtension(file.type);
  const dir = path.join(process.cwd(), "public", "uploads", "avatars");
  await mkdir(dir, { recursive: true });
  const filename = `${user.id}-${Date.now()}.${ext}`;
  const filepath = path.join(dir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  const url = `/uploads/avatars/${filename}`;
  return NextResponse.json({ url });
}
