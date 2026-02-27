"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Plus, FileText, LogOut, Trash2, Clock, User, PanelLeftClose, PanelLeftOpen, CheckCircle, Download } from "lucide-react";
import { useCVContext } from "@/src/context/CVContext";
import CVPreview from "@/src/components/cv/Preview";

export function DashboardClient() {
    const router = useRouter();
    const { user, userLoading, cvs, cvsLoading, deleteCV, downloading, cvToDownload, downloadingCvId, dashboardDownloadPDF } = useCVContext();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pdfContainerRef = useRef<HTMLDivElement>(null);

    const handleDeleteCV = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        const ok = await deleteCV(id);
        if (ok) router.refresh();
    };

    const handleLogout = async () => {
        await fetch("/api/logout", { method: "POST" });
        router.push("/");
        router.refresh();
    };

    if (userLoading || cvsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center animate-pulse">
                        <FileText className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex">
            <aside className={`${sidebarOpen ? 'w-48' : 'w-14'} bg-primary flex flex-col fixed inset-y-0 left-0 z-20 transition-all duration-300`}>
                <div className={`px-3 py-5 ${sidebarOpen ? 'px-4' : 'px-3'}`}>
                    <Link href="/dashboard" className="flex items-center gap-2 text-primary-foreground">
                        <div className="h-7 w-7 rounded bg-primary-foreground/20 flex items-center justify-center shrink-0">
                            <FileText className="h-4 w-4" />
                        </div>
                        {sidebarOpen && <span className="font-semibold text-sm">CVBuilder</span>}
                    </Link>
                </div>

                <nav className="flex-1 px-2 space-y-1">
                    <Link
                        href="/dashboard"
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium bg-primary-foreground/15 text-primary-foreground ${!sidebarOpen ? 'justify-center px-0' : ''}`}
                    >
                        <FileText className="h-4 w-4 shrink-0" />
                        {sidebarOpen && "Documents"}
                    </Link>
                </nav>

                <div className="px-2 pb-4 flex flex-col gap-2">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors w-full ${!sidebarOpen ? 'justify-center px-0' : ''}`}
                    >
                        <LogOut className="h-4 w-4 shrink-0" />
                        {sidebarOpen && "Déconnexion"}
                    </button>
                    <Link
                        href="/account"
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors w-full ${!sidebarOpen ? 'justify-center px-0' : ''}`}
                    >
                        {userLoading && !user ? (
                            <div className="h-6 w-6 rounded-full bg-primary-foreground/20 animate-pulse shrink-0" />
                        ) : user?.profile?.avatarUrl ? (
                            <img
                                src={user.profile.avatarUrl}
                                alt=""
                                className="h-4 w-4 rounded-full object-cover shrink-0 bg-primary-foreground/20"
                            />
                        ) : (
                            <div className="h-6 w-6 rounded-full bg-primary-foreground/20 flex items-center justify-center shrink-0">
                                <User className="h-3.5 w-3.5 text-primary-foreground/70" />
                            </div>
                        )}
                        {sidebarOpen && (
                            <span className="text-sm text-primary-foreground/60 truncate">
                                {userLoading && !user ? "Chargement…" : user?.email ?? ""}
                            </span>
                        )}
                    </Link>
                </div>
            </aside>

            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-48' : 'ml-14'}`}>
                <header className="border-b border-border bg-card px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                            {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                        </button>
                        <div className="h-5 w-px bg-border" />
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <h1 className="text-xl font-bold">Documents</h1>
                    </div>
                    <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => { router.push("/cv/start"); router.refresh(); }}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Créer
                    </Button>
                </header>

                <div className="border-b border-border bg-card px-8">
                    <div className="flex gap-6">
                        <button className="py-3 text-sm font-medium text-primary border-b-2 border-primary">CVs</button>
                        <button className="py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Lettres de motivation</button>
                    </div>
                </div>

                <div className="px-8 py-8">
                    {cvsLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        </div>
                    ) : cvs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="mb-6">
                                <div className="relative w-32 h-28 mx-auto">
                                    <div className="absolute left-2 top-2 w-20 h-24 rounded-lg bg-primary/10 border border-primary/20 rotate-[-8deg]" />
                                    <div className="absolute right-2 top-0 w-20 h-24 rounded-lg bg-primary/15 border border-primary/25 rotate-[5deg]" />
                                    <div className="absolute left-1/2 -translate-x-1/2 top-1 w-20 h-24 rounded-lg bg-card border border-border shadow-sm flex flex-col items-center justify-center gap-1.5">
                                        <div className="w-6 h-6 rounded-full bg-primary/20" />
                                        <div className="w-10 h-1.5 rounded bg-muted" />
                                        <div className="w-12 h-1 rounded bg-muted" />
                                        <div className="w-8 h-1 rounded bg-muted" />
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold mb-1">Vous n'avez pas encore de CV.</h3>
                            <p className="text-muted-foreground text-sm mb-6">
                                Créez votre premier CV en cliquant le bouton ci-dessous :
                            </p>
                            <Button
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                                onClick={() => router.push("/cv/start")}
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Créer un nouveau CV
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {cvs.map((cv) => (
                                <div
                                    key={cv.id}
                                    className="rounded-xl border border-border bg-card p-5 hover:shadow-md cursor-pointer transition-shadow group"
                                    onClick={() => router.push(`/cv/${cv.id}`)}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium px-2 py-0.5 bg-muted rounded">
                                                {cv.template}
                                            </span>
                                            {cv.completed && (
                                                <span className="text-xs font-medium px-2 py-0.5 bg-green-500/15 text-green-700 dark:text-green-400 rounded inline-flex items-center gap-1">
                                                    <CheckCircle className="h-3 w-3" />
                                                    Terminé
                                                </span>
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                                            onClick={(e) => handleDeleteCV(e, cv.id)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                    <h3 className="font-semibold text-sm mb-0.5">{cv.title}</h3>
                                    <p className="text-xs text-muted-foreground">{cv.fullName || "Sans nom"}</p>
                                    {cv.jobTitle && <p className="text-xs text-muted-foreground/70">{cv.jobTitle}</p>}
                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                                        {cv.completed && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-7 text-xs gap-1"
                                                onClick={(e) => dashboardDownloadPDF(e, cv, () => pdfContainerRef.current ?? null)}
                                                disabled={downloading || !!downloadingCvId}
                                            >
                                                {downloadingCvId === cv.id ? (
                                                    <>
                                                        <span className="animate-spin inline-block h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
                                                        Génération…
                                                    </>
                                                ) : (
                                                    <>
                                                        <Download className="h-3 w-3" />
                                                        Télécharger PDF
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                        <div className="flex items-center gap-1.5 text-muted-foreground flex-1 min-w-0">
                                            <Clock className="h-3 w-3 shrink-0" />
                                            <p className="text-xs">
                                                {new Date(cv.updatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {cvToDownload && (
                <div style={{ position: "fixed", left: "-9999px", top: 0, width: "595px" }}>
                    <div ref={pdfContainerRef} style={{ width: "595px", fontFamily: "Inter, sans-serif" }}>
                        <CVPreview data={cvToDownload} forPdf />
                    </div>
                </div>
            )}
        </div>
    );
}
