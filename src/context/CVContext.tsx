"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { CVData, defaultCVData } from "@/src/types/cv";
import type { MeResponse } from "@/src/services/auth/types";
import toast from "react-hot-toast";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { ApiCvListItem } from "@/src/services/cv/api";

const CV_API = "/api/cvs";
const ME_API = "/api/me";

interface CVContextValue {
    user: MeResponse | null;
    userLoading: boolean;
    refetchUser: () => Promise<void>;
    handleUnauthorized: () => void;
    cvs: ApiCvListItem[];
    cvsLoading: boolean;
    deleteCV: (id: string) => Promise<boolean>;
    cvToDownload: CVData | null;
    downloadingCvId: string | null;
    dashboardDownloadPDF: (e: React.MouseEvent, cv: ApiCvListItem, getNode?: () => HTMLElement | null) => Promise<void>;
    setCurrentCvId: (id: string | undefined) => void;
    cvData: CVData;
    setCVData: React.Dispatch<React.SetStateAction<CVData>>;
    cvDataLoading: boolean;
    loadCV: (id: string | undefined, initialData?: CVData | null) => void;
    saving: boolean;
    downloading: boolean;
    saveCV: (data: CVData, targetId?: string) => Promise<CVData | null>;
    downloadPDF: (node: HTMLElement | null, options?: { title?: string }) => Promise<void>;
}

const CVContext = createContext<CVContextValue | null>(null);

interface CVProviderProps {
    children: ReactNode;
    initialUser?: MeResponse | null;
    initialCvs?: ApiCvListItem[];
    skipClientAuthRefetch?: boolean;
}

export function CVProvider({ children, initialUser = null, initialCvs, skipClientAuthRefetch = false }: CVProviderProps) {
    const router = useRouter();
    const [user, setUser] = useState<MeResponse | null>(initialUser ?? null);
    const [userLoading, setUserLoading] = useState(initialUser == null && !skipClientAuthRefetch);
    const [cvData, setCVData] = useState<CVData>(defaultCVData);
    const [currentCvId, setCurrentCvId] = useState<string | undefined>(undefined);
    const [cvDataLoading, setCvDataLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [cvs, setCvs] = useState<ApiCvListItem[]>(initialCvs ?? []);
    const [cvsLoading, setCvsLoading] = useState(initialCvs === undefined);
    const [cvToDownload, setCvToDownload] = useState<CVData | null>(null);
    const [downloadingCvId, setDownloadingCvId] = useState<string | null>(null);
    const userRef = useRef(user);
    userRef.current = user;

    const handleUnauthorized = useCallback(() => {
        setUser(null);
        setCvs([]);
        router.push("/");
    }, [router]);

    const refetchCvs = useCallback(async () => {
        if (userRef.current == null) {
            setCvs([]);
            setCvsLoading(false);
            return;
        }
        setCvsLoading(true);
        try {
            const res = await fetch(CV_API, { credentials: "include", cache: "no-store" });
            if (res.ok) {
                const data = (await res.json()) as ApiCvListItem[];
                setCvs(data ?? []);
            } else {
                if (res.status === 401) handleUnauthorized();
                else setCvs([]);
            }
        } catch {
            setCvs([]);
        } finally {
            setCvsLoading(false);
        }
    }, [handleUnauthorized]);

    const refetchUser = useCallback(async () => {
        if (userRef.current == null) setUserLoading(true);
        try {
            const res = await fetch(ME_API, { credentials: "include", cache: "no-store" });
            if (res.ok) {
                const data = (await res.json()) as MeResponse;
                setUser(data);
            } else {
                setUser(null);
                if (res.status === 401) handleUnauthorized();
            }
        } catch {
            setUser(null);
        } finally {
            setUserLoading(false);
        }
    }, [handleUnauthorized]);

    const loadRequestIdRef = useRef(0);
    const loadCV = useCallback((id: string | undefined, initialData?: CVData | null) => {
        const requestId = ++loadRequestIdRef.current;
        if (!id || id === "new") {
            setCurrentCvId(undefined);
            setCVData(defaultCVData);
            setCvDataLoading(false);
            return;
        }
        if (userRef.current == null) {
            setCvDataLoading(false);
            return;
        }
        setCurrentCvId(id);
        if (initialData != null && initialData.id === id) {
            setCVData(initialData);
            setCvDataLoading(false);
            return;
        }
        setCvDataLoading(true);
        fetch(`${CV_API}/${id}`, { credentials: "include", cache: "no-store" })
            .then((res) => {
                if (requestId !== loadRequestIdRef.current) return null;
                if (res.status === 401) {
                    handleUnauthorized();
                    return null;
                }
                if (!res.ok) return null;
                return res.json();
            })
            .then((data: CVData | null) => {
                if (requestId !== loadRequestIdRef.current || data == null) return;
                setCVData(data);
            })
            .finally(() => {
                if (requestId === loadRequestIdRef.current) setCvDataLoading(false);
            });
    }, [setCurrentCvId, setCVData, handleUnauthorized]);

    const downloadPDF = useCallback(async (node: HTMLElement | null, options?: { title?: string }) => {
        if (!node) return;
        setDownloading(true);
        try {
            await document.fonts.ready;
            const restores = new Map<HTMLElement, { color?: string; backgroundColor?: string }>();
            node.querySelectorAll("*").forEach((el) => {
                const style = window.getComputedStyle(el as Element);
                const htmlEl = el as HTMLElement;
                const prev = restores.get(htmlEl) ?? {};
                if (style.color.includes("lab") || style.color.includes("oklch")) {
                    restores.set(htmlEl, { ...prev, color: htmlEl.style.color || undefined });
                    htmlEl.style.color = "#000000";
                }
                if (style.backgroundColor.includes("lab") || style.backgroundColor.includes("oklch")) {
                    restores.set(htmlEl, { ...restores.get(htmlEl), backgroundColor: htmlEl.style.backgroundColor || undefined });
                    htmlEl.style.backgroundColor = "#ffffff";
                }
            });
            const imgData = await toPng(node, {
                backgroundColor: "#ffffff",
                pixelRatio: 2,
                cacheBust: true,
            });
            restores.forEach((props, el) => {
                if (props.color !== undefined) el.style.color = props.color;
                else el.style.removeProperty("color");
                if (props.backgroundColor !== undefined) el.style.backgroundColor = props.backgroundColor;
                else el.style.removeProperty("background-color");
            });
            const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            const fileName = options?.title ?? cvData.title ?? "CV";
            pdf.save(`${fileName}.pdf`);
            toast.success("PDF téléchargé !");
        } catch (err) {
            console.error("PDF generation error:", err);
            toast.error("Erreur lors de la génération du PDF");
        } finally {
            setDownloading(false);
        }
    }, [cvData.title]);

    const dashboardDownloadPDF = useCallback(async (e: React.MouseEvent, cv: ApiCvListItem, getNode?: () => HTMLElement | null) => {
        e.preventDefault();
        e.stopPropagation();
        if (downloadingCvId) return;
        setDownloadingCvId(cv.id);
        try {
            const res = await fetch(`${CV_API}/${cv.id}`, { credentials: "include", cache: "no-store" });
            if (!res.ok) {
                toast.error("Impossible de charger le CV");
                setDownloadingCvId(null);
                if (res.status === 401) handleUnauthorized();
                return;
            }
            const data = (await res.json()) as CVData;
            setCvToDownload(data);
            if (getNode) {
                setTimeout(() => {
                    const el = getNode();
                    if (el) {
                        downloadPDF(el, { title: data.title || "CV" }).finally(() => {
                            setCvToDownload(null);
                            setDownloadingCvId(null);
                        });
                    } else {
                        setCvToDownload(null);
                        setDownloadingCvId(null);
                    }
                }, 400);
            }
        } catch {
            toast.error("Erreur lors du chargement du CV");
            setDownloadingCvId(null);
        }
    }, [downloadingCvId, downloadPDF, handleUnauthorized]);

    const saveCV = useCallback(async (data: CVData, targetId?: string): Promise<CVData | null> => {
        setSaving(true);
        try {
            const payload = {
                title: data.title || "Mon CV",
                template: data.template,
                accent_color: data.accent_color,
                photo_url: data.photo_url || null,
                full_name: data.full_name,
                job_title: data.job_title,
                email: data.email,
                phone: data.phone,
                location: data.location,
                summary: data.summary,
                experiences: data.experiences,
                education: data.education,
                skills: data.skills,
                languages: data.languages,
                current_step: data.current_step ?? 1,
                completed: data.completed ?? false,
            };

            const cvIdToUse = targetId ?? currentCvId;

            if (cvIdToUse) {
                const res = await fetch(`${CV_API}/${cvIdToUse}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(payload),
                });
                if (res.status === 401) {
                    handleUnauthorized();
                    return null;
                }
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error((err as { error?: string }).error ?? "Erreur lors de la sauvegarde");
                }
                const updated = (await res.json()) as CVData;
                setCVData(updated);
                if (!targetId) setCurrentCvId(cvIdToUse);
                refetchCvs();
                toast.success("CV sauvegardé !");
                return updated;
            } else {
                const res = await fetch(CV_API, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(payload),
                });
                if (res.status === 401) {
                    handleUnauthorized();
                    return null;
                }
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error((err as { error?: string }).error ?? "Erreur lors de la création");
                }
                const newCV = (await res.json()) as CVData;
                if (newCV?.id) setCurrentCvId(newCV.id);
                setCVData(newCV);
                refetchCvs();
                toast.success("CV sauvegardé !");
                return newCV;
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Erreur inconnue";
            toast.error(message);
            return null;
        } finally {
            setSaving(false);
        }
    }, [currentCvId, refetchCvs, handleUnauthorized]);

    const deleteCV = useCallback(async (id: string): Promise<boolean> => {
        const res = await fetch(`${CV_API}/${id}`, { method: "DELETE", credentials: "include" });
        if (res.status === 401) {
            handleUnauthorized();
            return false;
        }
        if (res.ok) {
            setCvs((prev) => prev.filter((cv) => cv.id !== id));
            return true;
        }
        return false;
    }, [handleUnauthorized]);

    useEffect(() => {
        if (initialUser != null) {
            setUser(initialUser);
            setUserLoading(false);
        }
        if (skipClientAuthRefetch) setUserLoading(false);
        if (initialCvs !== undefined) {
            setCvs(initialCvs);
            setCvsLoading(false);
        }
    }, [initialUser, initialCvs, skipClientAuthRefetch]);

    useEffect(() => {
        if (!skipClientAuthRefetch && initialUser == null) refetchUser();
    }, [refetchUser, initialUser, skipClientAuthRefetch]);

    const value: CVContextValue = {
        user,
        userLoading,
        refetchUser,
        handleUnauthorized,
        cvs,
        cvsLoading,
        deleteCV,
        cvToDownload,
        downloadingCvId,
        dashboardDownloadPDF,
        setCurrentCvId,
        cvData,
        setCVData,
        cvDataLoading,
        loadCV,
        saving,
        downloading,
        saveCV,
        downloadPDF,
    };

    return <CVContext.Provider value={value}>{children}</CVContext.Provider>;
}

export function useCVContext(): CVContextValue {
    const ctx = useContext(CVContext);
    if (!ctx) {
        throw new Error("useCVContext doit être utilisé à l'intérieur de CVProvider");
    }
    return ctx;
}