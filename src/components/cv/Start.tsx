"use client";

import { PenLine, ChevronRight, FileInput, Sparkles, ArrowLeft, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

const CVStart = () => {
  const router = useRouter();

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
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au dashboard
        </button>
      </header>

      {/* Content */}
      <div className="flex flex-col items-center justify-center px-6 py-28">
        <h1 className="text-3xl font-black tracking-tight mb-12 text-center">
          Comment souhaitez-vous commencer votre CV ?
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl w-full">
          {/* Option 1: From scratch */}
          <button
            onClick={() => router.push("/cv/new")}
            className="group relative rounded-2xl border border-border bg-card p-6 text-left hover:shadow-lg hover:border-primary/20 transition-all duration-200 flex items-center gap-5"
          >
            {/* Icon block */}
            <div className="h-20 w-20 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
              <PenLine className="h-8 w-8 text-primary/60" />
            </div>
            {/* Text */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base tracking-tight mb-1">
                Créer un nouveau<br />CV à partir de zéro
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Guide étape par étape pour créer un CV au top.
              </p>
            </div>
            {/* Chevron */}
            <div className="h-10 w-10 rounded-xl border border-border flex items-center justify-center shrink-0 group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors">
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </button>

          {/* Option 2: Import */}
          <button onClick={() => router.push("/cv/import")} className="group relative rounded-2xl border border-border bg-card p-6 text-left hover:shadow-lg hover:border-primary/20 transition-all duration-200 flex items-center gap-5">
            {/* Badge */}
            <div className="absolute -top-3 right-5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-[hsl(235,40%,14%)] text-white px-3.5 py-1.5 rounded-full">
                <Sparkles className="h-3 w-3" />
                90 % plus rapide
              </span>
            </div>
            {/* Icon block */}
            <div className="h-20 w-20 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
              <FileInput className="h-8 w-8 text-primary/60" />
            </div>
            {/* Text */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base tracking-tight mb-1">
                Importer mon CV<br />existant
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Profitez des conseils d'experts pour améliorer votre CV.
              </p>
            </div>
            {/* Chevron */}
            <div className="h-10 w-10 rounded-xl border border-border flex items-center justify-center shrink-0 group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors">
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVStart;