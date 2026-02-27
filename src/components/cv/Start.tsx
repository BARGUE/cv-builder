"use client";

import { PenLine, ChevronRight, FileInput, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const CVStart = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-muted/40">
        {/* Top bar */}
        <header className="border-b border-border bg-card px-6 h-14 flex items-center">
          <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-primary flex items-center justify-center">
              <PenLine className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">CVBuilder</span>
          </button>
        </header>
  
        {/* Content */}
        <div className="flex flex-col items-center justify-center px-6 py-24">
          <h1 className="text-2xl font-bold mb-10">Comment souhaitez-vous commencer votre CV ?</h1>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl w-full">
            {/* Option 1: From scratch */}
            <button
              onClick={() => router.push("/cv/new")}
              className="group relative rounded-xl border border-border bg-card p-6 text-left hover:shadow-md hover:border-primary/30 transition-all flex items-center gap-5"
            >
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <PenLine className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1">Créer un nouveau CV à partir de zéro</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Guide étape par étape pour créer un CV au top.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </button>
  
            {/* Option 2: Import */}
            <div className="group relative rounded-xl border border-border bg-card p-6 text-left opacity-60 cursor-not-allowed flex items-center gap-5">
              <div className="absolute -top-3 right-4">
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary text-primary-foreground px-2.5 py-1 rounded-full">
                  <Sparkles className="h-3 w-3" />
                  Bientôt disponible
                </span>
              </div>
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FileInput className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1">Importer mon CV existant</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Profitez des conseils d'experts pour améliorer votre CV.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
            </div>
          </div>
        </div>
      </div>
    );
};

export default CVStart;