"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ScanningAnimationProps } from "@/src/components/cv/types";

const ScanningAnimation = ({ importDone }: ScanningAnimationProps) => {
    const t = useTranslations("cvImport");

    return (
        <div className="flex flex-col items-center justify-center py-6">
            <h1 className="text-2xl font-black tracking-tight text-center mb-2">
                {t("scanningTitle")}
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-8">
                {t("scanningSubtitle")}
            </p>

            <div className="relative w-64 bg-muted/60 rounded-xl p-6 overflow-hidden shadow-sm border border-border">
                <div className="space-y-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted-foreground/10" />
                        <div className="flex-1 space-y-2">
                            <div className="h-2.5 w-3/4 rounded-full bg-muted-foreground/12" />
                            <div className="h-2 w-1/2 rounded-full bg-muted-foreground/8" />
                        </div>
                    </div>
                    {[0.85, 0.7, 0.9].map((w, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded bg-muted-foreground/10 shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-2.5 rounded-full bg-muted-foreground/12" style={{ width: `${w * 100}%` }} />
                                <div className="h-2 rounded-full bg-muted-foreground/8" style={{ width: `${w * 70}%` }} />
                                <div className="h-2 rounded-full bg-muted-foreground/8" style={{ width: `${w * 55}%` }} />
                            </div>
                        </div>
                    ))}
                </div>

                <motion.div
                    className="absolute left-0 right-0 h-0.5 bg-primary/60 shadow-[0_0_8px_2px_hsl(var(--primary)/0.3)]"
                    initial={{ top: 0 }}
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <div className="flex flex-col gap-2 mt-6 w-64">
                <div className="flex items-center gap-2 text-sm">
                    {importDone ? (
                        <Check className="h-4 w-4 text-green-600 shrink-0" />
                    ) : (
                        <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                    )}
                    <span className={importDone ? "text-muted-foreground" : "font-medium"}>
                        {importDone ? t("analysisDone") : t("analysisInProgress")}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ScanningAnimation;
