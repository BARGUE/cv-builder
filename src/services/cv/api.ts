import type { CVData } from "@/src/types/cv";

const AUTH_API_URL = process.env.AUTH_API_URL;

function getBaseUrl(): string {
    if (!AUTH_API_URL) {
        throw new Error("Configuration serveur manquante (AUTH_API_URL)");
    }
    return AUTH_API_URL.replace(/\/$/, "");
}

export interface ApiCv {
    id: string;
    userId: string;
    title: string;
    template: string;
    accentColor?: string;
    photoUrl?: string | null;
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    experiences: unknown;
    education: unknown;
    skills: unknown;
    languages: unknown;
    updatedAt?: string;
    currentStep?: number;
    completed?: boolean;
}

export interface ApiCvListItem {
    id: string;
    title: string;
    template: string;
    fullName: string;
    jobTitle: string;
    updatedAt: string;
    currentStep?: number;
    completed?: boolean;
}

function mapApiCvToCVData(api: ApiCv): CVData {
    return {
        id: api.id,
        user_id: api.userId,
        title: api.title,
        template: api.template as CVData["template"],
        accent_color: api.accentColor ?? "#4F46E5",
        photo_url: api.photoUrl ?? "",
        full_name: api.fullName ?? "",
        job_title: api.jobTitle ?? "",
        email: api.email ?? "",
        phone: api.phone ?? "",
        location: api.location ?? "",
        summary: api.summary ?? "",
        experiences: (api.experiences as CVData["experiences"]) ?? [],
        education: (api.education as CVData["education"]) ?? [],
        skills: (api.skills as CVData["skills"]) ?? [],
        languages: (api.languages as CVData["languages"]) ?? [],
        current_step: api.currentStep ?? 1,
        completed: api.completed ?? false,
    };
}

export function mapCVDataToApiPayload(data: CVData) {
    return {
        title: data.title,
        template: data.template,
        accentColor: data.accent_color,
        photoUrl: data.photo_url || null,
        fullName: data.full_name,
        jobTitle: data.job_title,
        email: data.email,
        phone: data.phone,
        location: data.location,
        summary: data.summary,
        experiences: data.experiences,
        education: data.education,
        skills: data.skills,
        languages: data.languages,
        currentStep: data.current_step ?? 1,
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
    const api = (await res.json()) as ApiCv;
    return mapApiCvToCVData(api);
}

export async function createCvApi(
    payload: ReturnType<typeof mapCVDataToApiPayload>,
    accessToken: string
): Promise<CVData | null> {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cvs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const api = (await res.json()) as ApiCv;
    return mapApiCvToCVData(api);
}

export async function updateCvApi(
    cvId: string,
    payload: ReturnType<typeof mapCVDataToApiPayload>,
    accessToken: string
): Promise<CVData | null> {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cvs/${cvId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const api = (await res.json()) as ApiCv;
    return mapApiCvToCVData(api);
}

function mapApiItemToCVListItem(api: ApiCvListItem | ApiCv): ApiCvListItem {
    const item = api as ApiCvListItem & { fullName?: string; jobTitle?: string; updatedAt?: string; currentStep?: number; completed?: boolean };
    return {
        id: item.id,
        title: item.title,
        template: item.template,
        fullName: item.fullName ?? (api as ApiCv).fullName ?? "",
        jobTitle: item.jobTitle ?? (api as ApiCv).jobTitle ?? "",
        updatedAt: item.updatedAt ?? (api as ApiCv).updatedAt ?? new Date().toISOString(),
        currentStep: item.currentStep ?? (api as ApiCv).currentStep,
        completed: item.completed ?? (api as ApiCv).completed,
    };
}

export async function listCvsApi(accessToken: string): Promise<ApiCvListItem[]> {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cvs`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as ApiCvListItem[] | ApiCv[];
    const list = Array.isArray(data) ? data : [];
    return list.map(mapApiItemToCVListItem).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function deleteCvApi(cvId: string, accessToken: string): Promise<boolean> {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cvs/${cvId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.ok;
}
