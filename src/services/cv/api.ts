import { ApiError, apiRequest } from "@/src/services/http";
import { normalizeCVData, type CVData, type CVListItem } from "@/src/types/cv";

function toListItem(item: CVData): CVListItem {
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

function toSavePayload(data: CVData) {
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

/** Retourne null si le CV n'existe pas (ou n'appartient pas à l'utilisateur). */
export async function getCvApi(cvId: string, token: string): Promise<CVData | null> {
    try {
        return normalizeCVData(await apiRequest<CVData>(`/cvs/${encodeURIComponent(cvId)}`, { token }));
    } catch (e) {
        if (e instanceof ApiError && (e.status === 404 || e.status === 403 || e.status === 400)) return null;
        throw e;
    }
}

export async function createCvApi(payload: CVData, token: string): Promise<CVData> {
    const cv = await apiRequest<CVData>("/cvs", {
        method: "POST",
        token,
        body: toSavePayload(payload),
        fallbackError: "Erreur lors de la création",
    });
    return normalizeCVData(cv);
}

export async function updateCvApi(cvId: string, payload: CVData, token: string): Promise<CVData> {
    const cv = await apiRequest<CVData>(`/cvs/${encodeURIComponent(cvId)}`, {
        method: "PATCH",
        token,
        body: toSavePayload(payload),
        fallbackError: "Erreur lors de la mise à jour",
    });
    return normalizeCVData(cv);
}

export async function listCvsApi(token: string): Promise<CVListItem[]> {
    const data = await apiRequest<CVData[]>("/cvs", { token });
    return (Array.isArray(data) ? data : [])
        .map(toListItem)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function deleteCvApi(cvId: string, token: string): Promise<void> {
    await apiRequest<void>(`/cvs/${encodeURIComponent(cvId)}`, {
        method: "DELETE",
        token,
        fallbackError: "Erreur lors de la suppression",
    });
}
