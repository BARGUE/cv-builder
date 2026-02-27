import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const AUTH_API_URL = process.env.AUTH_API_URL;

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const token = (await cookies()).get("access_token")?.value;
    if (!token) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    const { id } = await params;
    const baseUrl = (AUTH_API_URL ?? "").replace(/\/$/, "");
    if (!baseUrl) {
        return NextResponse.json(
            { error: "Configuration serveur manquante" },
            { status: 500 }
        );
    }
    const res = await fetch(`${baseUrl}/cvs/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
        if (res.status === 404) {
            return NextResponse.json({ error: "CV introuvable" }, { status: 404 });
        }
        if (res.status === 403) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }
        return NextResponse.json(
            { error: "Erreur lors du téléchargement" },
            { status: res.status }
        );
    }
    const blob = await res.blob();
    const filename = res.headers.get("content-disposition")?.match(/filename="?([^";]+)"?/)?.[1] ?? `cv-${id}.pdf`;
    return new NextResponse(blob, {
        status: 200,
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
    });
}
