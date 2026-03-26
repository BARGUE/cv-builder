import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCvApi } from "@/src/services/cv/api";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const { id } = await params;
  const cv = await getCvApi(id, token);
  if (!cv) {
    return NextResponse.json({ error: "CV introuvable" }, { status: 404 });
  }
  return NextResponse.json(cv);
}
