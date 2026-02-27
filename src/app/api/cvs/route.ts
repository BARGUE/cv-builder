import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createCvApi, listCvsApi, mapCVDataToApiPayload } from "@/src/services/cv/api";

export async function GET() {
    const token = (await cookies()).get("access_token")?.value;
    if (!token) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    const list = await listCvsApi(token);
    return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
    const token = (await cookies()).get("access_token")?.value;
    if (!token) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    const body = await req.json();
    const payload = mapCVDataToApiPayload(body);
    const cv = await createCvApi(payload, token);
    if (!cv) {
        return NextResponse.json({ error: "Erreur lors de la création" }, { status: 400 });
    }
    return NextResponse.json(cv);
}
