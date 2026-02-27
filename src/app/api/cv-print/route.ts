import { NextRequest, NextResponse } from "next/server";
import { buildCvPrintHtml } from "@/src/lib/cv-print-html";
import type { CVData } from "@/src/types/cv";

const PRINT_SECRET_HEADER = "x-print-secret";

function mapBodyToCVData(body: {
    cv?: {
        fullName?: string;
        jobTitle?: string;
        email?: string;
        phone?: string;
        location?: string;
        summary?: string;
        template?: string;
        accentColor?: string;
        photoUrl?: string | null;
        experiences?: unknown;
        education?: unknown;
        skills?: unknown;
        languages?: unknown;
    };
}): CVData {
    const c = body.cv ?? {};
    return {
        title: "CV",
        template: (c.template as CVData["template"]) ?? "classic",
        accent_color: c.accentColor ?? "#4F46E5",
        photo_url: c.photoUrl ?? "",
        full_name: c.fullName ?? "",
        job_title: c.jobTitle ?? "",
        email: c.email ?? "",
        phone: c.phone ?? "",
        location: c.location ?? "",
        summary: c.summary ?? "",
        experiences: (c.experiences as CVData["experiences"]) ?? [],
        education: (c.education as CVData["education"]) ?? [],
        skills: (c.skills as CVData["skills"]) ?? [],
        languages: (c.languages as CVData["languages"]) ?? [],
    };
}

export async function POST(req: NextRequest) {
    const secret = req.headers.get(PRINT_SECRET_HEADER);
    const expected = process.env.PRINT_SECRET;
    if (!expected || secret !== expected) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    let body: { cv?: unknown };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const cvData = mapBodyToCVData(body as { cv?: Record<string, unknown> });
    const html = buildCvPrintHtml(cvData);
    const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body>${html}</body></html>`;
    return new NextResponse(fullHtml, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
    });
}
