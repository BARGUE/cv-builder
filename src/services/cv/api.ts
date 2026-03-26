import type { CVData, CVListItem } from "@/src/types/cv";

const AUTH_API_URL = process.env.AUTH_API_URL;

function getBaseUrl(): string {
    if (!AUTH_API_URL) {
        throw new Error("Configuration serveur manquante (AUTH_API_URL)");
    }
    return AUTH_API_URL.replace(/\/$/, "");
}

function mapApiItemToCVListItem(item: CVData): CVListItem {
    return {
        id: item.id ?? "",
        title: item.title ?? "",
        template: item.template ?? "",
        fullName: item.fullName ?? "",
        jobTitle: item.jobTitle ?? "",
        updatedAt: item.updatedAt ?? new Date().toISOString(),
        currentStep: item.currentStep ?? 1,
        completed: item.completed ?? false,
    };
}

export function buildSavePayload(data: CVData): Record<string, unknown> {
    return {
        title: data.title || "Mon CV",
        template: data.template,
        accentColor: data.accentColor,
        photoUrl: data.photoUrl || null,
        fullName: data.fullName,
        jobTitle: data.jobTitle,
        email: data.email,
        phone: data.phone,
        location: data.location,
        summary: data.summary,
        experiences: data.experiences,
        education: data.education,
        skills: data.skills,
        languages: data.languages,
        currentStep: data.currentStep ?? 1,
        completed: data.completed ?? false,
    };
}

export async function getCvApi(cvId: string, accessToken: string): Promise<CVData | null> {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cvs/${cvId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
    });
    if (!res.ok) return null;
    const api = (await res.json()) as CVData;
    return api;
}

export async function createCvApi(
    payload: CVData,
    accessToken: string
): Promise<CVData | null> {
    const baseUrl = getBaseUrl();
    const body = buildSavePayload(payload);
    const res = await fetch(`${baseUrl}/cvs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const msg =
            (errBody as { error?: string }).error ??
            (errBody as { message?: string }).message ??
            "Erreur lors de la création";
        throw new Error(msg);
    }
    const api = (await res.json()) as CVData;
    return api;
}

export async function updateCvApi(
    cvId: string,
    payload: CVData,
    accessToken: string
): Promise<CVData | null> {
    const baseUrl = getBaseUrl();
    const body = buildSavePayload(payload);
    const res = await fetch(`${baseUrl}/cvs/${cvId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const msg =
            (errBody as { error?: string }).error ??
            (errBody as { message?: string }).message ??
            "Erreur lors de la mise à jour";
        throw new Error(msg);
    }
    const api = (await res.json()) as CVData;
    return api;
}

export async function listCvsApi(accessToken: string): Promise<CVListItem[]> {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cvs`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((item: CVData) => mapApiItemToCVListItem(item)).sort((a: CVListItem, b: CVListItem) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function deleteCvApi(cvId: string, accessToken: string): Promise<boolean> {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cvs/${cvId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.ok;
}