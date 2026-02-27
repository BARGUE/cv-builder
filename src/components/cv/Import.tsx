"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowLeft, FileText, Upload, ChevronLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";

const ImportCV = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setSelectedFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <header className="border-b border-border bg-background px-6 lg:px-12 h-16 flex items-center justify-between">
        <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[hsl(235,40%,14%)] flex items-center justify-center">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="font-black text-sm tracking-tight">CVBuilder</span>
        </button>
        <button
          onClick={() => router.push("/cv/start")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>
      </header>

      {/* Content */}
      <div className="flex flex-col items-center justify-center px-6 py-20">
        <div className="bg-card rounded-2xl border border-border p-10 max-w-xl w-full">
          <h1 className="text-2xl font-black tracking-tight text-center mb-2">
            Importer votre CV existant
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Profitez des conseils d'experts pour améliorer votre CV.
          </p>

          {/* Drop zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center gap-3 transition-colors ${
              dragActive
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
                <p className="text-sm font-semibold text-foreground">
                  Glissez-déposez un fichier ici
                </p>
                <p className="text-xs text-muted-foreground">
                  Format accepté : PDF, DOCX
                </p>
              </>
            )}

            <Button variant="default" size="sm" className="rounded-xl mt-1">
              Parcourir
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => router.push("/cv/start")}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Retour
            </button>
            <Button
              disabled={!selectedFile}
              className="rounded-xl px-8"
            >
              Importer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportCV;
