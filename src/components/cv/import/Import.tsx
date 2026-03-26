"use client";

import { useRef, useState } from "react";
import { ArrowLeft, FileText, Upload } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ScanningAnimation from "./ScanningAnimation";
import DoneConfirmation from "./DoneConfirmation";
import { myToast } from "@/src/components/ui/toast";
import type { CVData } from "@/src/types/cv";
import type { ImportPhase } from "@/src/components/cv/types";
import { createCvAction } from "@/src/app/actions/cv";

const ImportCV = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<ImportPhase>("upload");
  const [importDone, setImportDone] = useState(false);
  const [savedCvId, setSavedCvId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const handleFile = (file: File) => {
    if (file.type !== "application/pdf") {
      setError("PDF uniquement pour l'instant");
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
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(",")[1];
        const importRes = await fetch("/api/cv/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64, mimeType: "application/pdf" }),
        });
        if (!importRes.ok) {
          const err = await importRes.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error ?? "Erreur lors de l'analyse du CV.");
        }
        const data = (await importRes.json()) as CVData;
        setImportDone(true);

        const saveResult = await createCvAction(data);
        if (!saveResult.success) {
          if (saveResult.error === "Non authentifié") {
            myToast.error("Session expirée. Veuillez vous reconnecter.");
            router.push("/auth/login");
            setPhase("upload");
            return;
          }
          throw new Error(saveResult.error);
        }
        if (saveResult.data?.id) setSavedCvId(saveResult.data.id);
        setPhase("done");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur lors de l'import.";
        setError(message);
        myToast.error(message);
        setPhase("upload");
      } finally {
        setImporting(false);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background px-6 lg:px-12 h-16 flex items-center justify-between">
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
            Retour
          </Button>
        )}
      </header>

      <div className="flex flex-col items-center justify-center px-6 py-20">
        <div className="bg-card rounded-2xl border border-border p-10 max-w-xl w-full">
          <AnimatePresence mode="wait">
            {phase === "upload" && (
              <motion.div key="upload" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                <h1 className="text-2xl font-black tracking-tight text-center mb-2">
                  Importer votre CV existant
                </h1>
                <p className="text-sm text-muted-foreground text-center mb-8">
                  Profitez des conseils d'experts pour améliorer votre CV.
                </p>

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center gap-3 transition-colors ${dragActive
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
                      <p className="text-sm font-semibold text-foreground">Glissez-déposez un fichier ici</p>
                      <p className="text-xs text-muted-foreground">Format accepté : PDF, DOCX</p>
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
                        handleImport();
                      }}
                      className="rounded-xl px-8"
                    >
                      Importer
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
    </div>
  );
};

export default ImportCV;
