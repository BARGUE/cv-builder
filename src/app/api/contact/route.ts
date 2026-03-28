import { NextRequest, NextResponse } from "next/server";

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
            let errMsg = "Erreur lors de l'envoi";
            try {
                const j = (await res.json()) as { message?: unknown };
                if (typeof j?.message === "string") errMsg = j.message;
                else if (Array.isArray(j?.message) && j.message[0])
                    errMsg = String(j.message[0]);
            } catch {
                /* ignore */
            }
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
