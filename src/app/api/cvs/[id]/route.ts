import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCvApi, updateCvApi, deleteCvApi, mapCVDataToApiPayload } from "@/src/services/cv/api";

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

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const token = (await cookies()).get("access_token")?.value;
    if (!token) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    const payload = mapCVDataToApiPayload(body);
    const cv = await updateCvApi(id, payload, token);
    if (!cv) {
        return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 400 });
    }
    return NextResponse.json(cv);
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const token = (await cookies()).get("access_token")?.value;
    if (!token) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    const { id } = await params;
    const ok = await deleteCvApi(id, token);
    if (!ok) {
        return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 400 });
    }
    return new NextResponse(null, { status: 204 });
}
