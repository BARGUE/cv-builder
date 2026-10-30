import { NextRequest, NextResponse } from "next/server";
import { parseApiError } from "@/src/services/http";

const AUTH_API_URL = process.env.AUTH_API_URL;

export async function POST(req: NextRequest) {
    if (!AUTH_API_URL) {
        return NextResponse.json(
            { error: "Configuration serveur manquante (AUTH_API_URL)" },
            { status: 500 }
        );
    }

    let body: { name?: string; email?: string; subject?: string; message?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
    }

    const { name, email, subject, message } = body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
        return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const backendMessage = subject?.trim()
        ? `Sujet : ${subject.trim()}\n\n${message}`
        : message;

    const base = AUTH_API_URL.replace(/\/$/, "");

    try {
        const res = await fetch(`${base}/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name.trim(),
                email: email.trim(),
                message: backendMessage,
            }),
        });

        if (!res.ok) {
            const errMsg = parseApiError(await res.json().catch(() => null)) ?? "Erreur lors de l'envoi";
            return NextResponse.json({ error: errMsg }, { status: res.status });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { error: "Service temporairement indisponible" },
            { status: 502 }
        );
    }
}
