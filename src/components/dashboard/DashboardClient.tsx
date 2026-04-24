"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import {
  Plus,
  Trash2,
  Clock,
  PanelLeftClose,
  PanelLeftOpen,
  CheckCircle,
  Download,
  ArrowRight,
} from "lucide-react";
import { Sidebar } from "@/src/components/layout/Sidebar";
import CVPreview from "@/src/components/cv/Preview";
import { CVListItem, CVData } from "@/src/types/cv";
import { dashboardDownloadPdf } from "@/src/lib/pdf";
import { myToast } from "@/src/components/ui/toast";
import { useTranslations } from "next-intl";
import { logoutAction } from "@/src/app/[locale]/actions/auth";
import { deleteCvAction } from "@/src/app/[locale]/actions/cv";
import { DashboardClientProps } from "@/src/types/dashboard";

const CV_API = "/api/cv";

export function DashboardClient({ user, initialCvs }: DashboardClientProps) {
  const router = useRouter();
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cvToDownload, setCvToDownload] = useState<CVData | null>(null);
  const [downloadingCvId, setDownloadingCvId] = useState<string | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logoutAction();
  };

  const deleteCV = async (id: string) => {
    const result = await deleteCvAction(id);
    if (!result.success) {
      myToast.error(result.error);
      return;
    }
    myToast.success(t("toastDeleted"));
    router.refresh();
  };

  const handleDownloadPdf = (e: React.MouseEvent, cv: CVListItem) => {
    dashboardDownloadPdf(e, {
      cv,
      apiBaseUrl: CV_API,
      getNode: () => pdfContainerRef.current ?? null,
      isDownloading: downloadingCvId !== null,
      onStart: () => setDownloadingCvId(cv.id),
      onCvLoaded: setCvToDownload,
      onSuccess: () => myToast.success(t("toastPdfOk")),
      onError: (msg: string) => myToast.error(msg),
      onFinish: () => {
        setCvToDownload(null);
        setDownloadingCvId(null);
      },
      renderDelayMs: 400,
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        activeRoute="dashboard"
        user={user}
        onLogout={handleLogout}
      />

      {/* Main */}
      <main
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-56" : "ml-16"}`}
      >
        {/* Header */}
        <header className="bg-background px-8 lg:px-12 pt-10 pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="h-9 w-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                {sidebarOpen ? (
                  <PanelLeftClose className="h-4 w-4" />
                ) : (
                  <PanelLeftOpen className="h-4 w-4" />
                )}
              </Button>
              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  {t("pageTitle")}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {t("pageSubtitle")}
                </p>
              </div>
            </div>
            {initialCvs.length !== 0 && (
              <Button
                className="h-12 px-6 rounded-xl text-sm font-semibold gap-2"
                onClick={() => router.push("/cv/start")}
              >
                <Plus className="h-4 w-4" />
                {t("newCv")}
              </Button>
            )}
          </div>
        </header>

        {/* Tabs */}
        <div className="border-b border-border bg-background px-8 lg:px-12">
          <div className="flex gap-8">
            <Button type="button" variant="ghost" className="py-3 text-sm font-semibold hover:bg-transparent text-foreground border-b-2 border-primary rounded-none h-auto">
              {t("tabCvs")}
            </Button>
            <Button type="button" variant="ghost" className="py-3 text-sm font-medium hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors rounded-none h-auto">
              {t("tabCoverLetters")}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 lg:px-12 py-10">
          {initialCvs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <div className="mb-8">
                <div className="relative w-36 h-32 mx-auto">
                  <div className="absolute left-2 top-2 w-22 h-26 rounded-xl bg-primary/5 border border-primary/10 rotate-[-8deg]" />
                  <div className="absolute right-2 top-0 w-22 h-26 rounded-xl bg-primary/8 border border-primary/15 rotate-[5deg]" />
                  <div className="absolute left-1/2 -translate-x-1/2 top-1 w-22 h-26 rounded-xl bg-card border border-border shadow-sm flex flex-col items-center justify-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/15" />
                    <div className="w-12 h-1.5 rounded-full bg-muted" />
                    <div className="w-14 h-1 rounded-full bg-muted" />
                    <div className="w-10 h-1 rounded-full bg-muted" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-black tracking-tight mb-2">
                {t("emptyTitle")}
              </h3>
              <p className="text-muted-foreground text-sm mb-8 max-w-xs">
                {t("emptyDescription")}
              </p>
              <Button
                className="h-12 px-8 rounded-xl text-sm font-semibold gap-2"
                onClick={() => router.push("/cv/start")}
              >
                <Plus className="h-4 w-4" />
                {t("createFirstCv")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-5">
              {initialCvs.map((cv) => (
                <div
                  key={cv.id}
                  className="h-full w-full min-w-[200px] max-w-[300px] flex-shrink-0 rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:border-primary/20 cursor-pointer transition-all duration-200 group flex flex-col min-h-0"
                  onClick={() => router.push(`/cv/${cv.id}`)}
                >
                  <div className="flex items-center justify-between mb-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold px-2.5 py-1 bg-muted rounded-lg">
                        {cv.template}
                      </span>
                      {cv.completed && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-[#ecfdf5] px-2.5 py-1 rounded-lg">
                          <CheckCircle className="h-3 w-3" />
                          {t("completed")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {cv.completed && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/10"
                          onClick={(e) => handleDownloadPdf(e, cv)}
                          disabled={downloadingCvId === cv.id}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCV(cv.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0 flex flex-col">
                    <h3 className="font-bold text-sm tracking-tight mb-0.5 line-clamp-2" title={cv.title}>
                      {cv.title}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {cv.fullName || tCommon("noName")}
                    </p>
                    {cv.jobTitle && (
                      <p className="text-xs text-muted-foreground/60 mt-0.5 truncate">
                        {cv.jobTitle}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground mt-3 pt-3 border-t border-border shrink-0">
                    <Clock className="h-3 w-3" />
                    <p className="text-xs">
                      {new Date(cv.updatedAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Hidden PDF container for dashboard download */}
      {cvToDownload && (
        <div
          style={{
            position: "fixed",
            left: "-9999px",
            top: 0,
            width: "595px",
          }}
        >
          <div
            ref={pdfContainerRef}
            style={{ width: "595px", fontFamily: "Inter, sans-serif" }}
          >
            <CVPreview data={cvToDownload} forPdf />
          </div>
        </div>
      )}
    </div>
  );
}
