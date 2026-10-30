"use client";

import { useRef, useState } from "react";
import { ArrowLeft, FileText, Upload } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ScanningAnimation from "./ScanningAnimation";
import DoneConfirmation from "./DoneConfirmation";
import { myToast } from "@/src/components/ui/toast";
import { useTranslations } from "next-intl";
import type { CVData } from "@/src/types/cv";
import type { ImportCVProps, ImportPhase } from "@/src/components/cv/types";
import { createCvAction } from "@/src/app/[locale]/actions/cv";
import { AuthModal } from "@/src/components/auth/AuthModal";

class SessionError extends Error {}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ImportCV = ({ isAuthenticated: initialIsAuthenticated }: ImportCVProps) => {
  const router = useRouter();
  const t = useTranslations("cvImport");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<ImportPhase>("upload");
  const [importDone, setImportDone] = useState(false);
  const [savedCvId, setSavedCvId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError(t("errors.unsupportedFormat"));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(t("errors.tooLarge"));
      return;
    }
    setError(null);
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const active = e.type === "dragenter" || e.type === "dragover";
    setDragActive(active);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    setError(null);
    setImportDone(false);
    setSavedCvId(null);
    setPhase("scanning");
    setImporting(true);
    try {
      const body = new FormData();
      body.append("file", selectedFile);
      const importRes = await fetch("/api/cv/import", { method: "POST", body });
      if (!importRes.ok) {
        if (importRes.status === 401) throw new SessionError();
        const statusMessages: Record<number, string> = {
          413: t("errors.tooLarge"),
          415: t("errors.unsupportedFormat"),
        };
        throw new Error(statusMessages[importRes.status] ?? t("errors.analysisFailed"));
      }
      const data = (await importRes.json()) as CVData;
      setImportDone(true);

      const saveResult = await createCvAction(data);
      if (!saveResult.success) {
        if (saveResult.code === "UNAUTHORIZED") throw new SessionError();
        throw new Error(saveResult.error);
      }
      setSavedCvId(saveResult.data.id ?? null);
      setPhase("done");
    } catch (err) {
      setPhase("upload");
      if (err instanceof SessionError) {
        myToast.error(t("errors.sessionExpired"));
        setIsAuthenticated(false);
        setShowAuthModal(true);
        return;
      }
      const message = err instanceof Error ? err.message : t("errors.importFailed");
      setError(message);
      myToast.error(message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={() => router.push("/dashboard")} className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[hsl(235,40%,14%)] flex items-center justify-center">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="font-black text-sm tracking-tight">CVBuilder</span>
        </Button>
        {phase === "upload" && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/cv/start")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Button>
        )}
      </header>

      <div className="flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-20">
        <div className="bg-card rounded-2xl border border-border p-5 sm:p-10 max-w-xl w-full">
          <AnimatePresence mode="wait">
            {phase === "upload" && (
              <motion.div key="upload" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                <h1 className="text-2xl font-black tracking-tight text-center mb-2">
                  {t("title")}
                </h1>
                <p className="text-sm text-muted-foreground text-center mb-8">
                  {t("subtitle")}
                </p>

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 sm:p-10 flex flex-col items-center justify-center gap-3 transition-colors ${dragActive
                    ? "border-primary bg-primary/5"
                    : selectedFile
                      ? "border-primary/40 bg-primary/5"
                      : "border-border bg-muted/30"
                    }`}
                >
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Upload className="h-7 w-7 text-primary/70" />
                  </div>
                  {selectedFile ? (
                    <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-foreground">{t("dropTitle")}</p>
                      <p className="text-xs text-muted-foreground">{t("formatsHint")}</p>
                    </>
                  )}
                  <input ref={fileInputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileChange} />
                </div>

                <div className="flex flex-col items-center gap-4 mt-8">
                  {error && (
                    <p className="text-sm text-destructive text-center">{error}</p>
                  )}
                  {selectedFile && (
                    <Button
                      disabled={importing}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isAuthenticated) {
                          setShowAuthModal(true);
                          return;
                        }
                        handleImport();
                      }}
                      className="rounded-xl px-8 w-full sm:w-auto"
                    >
                      {t("importButton")}
                    </Button>
                  )}
                </div>
              </motion.div>
            )}

            {phase === "scanning" && (
              <motion.div key="scanning" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <ScanningAnimation importDone={importDone} />
              </motion.div>
            )}

            {phase === "done" && (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <DoneConfirmation
                  fileName={selectedFile?.name || ""}
                  onContinue={() => router.push(savedCvId ? `/cv/${savedCvId}` : "/cv/new")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setIsAuthenticated(true);
          setShowAuthModal(false);
          handleImport();
        }}
        context="import"
      />
    </div>
  );
};

export default ImportCV;
