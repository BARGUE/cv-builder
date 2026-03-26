"use client";

import { motion } from "framer-motion";
import { InView } from "./InView";
import { fadeUp } from "@/src/lib/animations";
import { FileText } from "lucide-react";

export function AppMockup() {
    return (
      <section className="max-w-7xl mx-auto px-6 py-24">
        <InView>
          <motion.div variants={fadeUp} className="text-center mb-4">
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">L'éditeur</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tighter text-center mb-16">
            Tout en un seul endroit.
          </motion.h2>
  
          <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/40">
              <div className="flex gap-1.5">
                {["bg-red-400", "bg-yellow-400", "bg-green-400"].map((c, i) => (
                  <div key={i} className={`w-3 h-3 rounded-full ${c} opacity-80`} />
                ))}
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-background rounded-md px-6 py-1 text-xs text-muted-foreground border border-border font-mono">
                  cvbuilder.app/cv/edit
                </div>
              </div>
            </div>
  
            <div className="grid grid-cols-5 min-h-[320px] md:min-h-[400px]">
              <div className="col-span-2 border-r border-border p-6 space-y-5 bg-background">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center">
                    <FileText className="h-3 w-3 text-primary" />
                  </div>
                  <div className="h-2.5 w-24 rounded-full bg-foreground/10" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-16 rounded-full bg-muted-foreground/20" />
                  <div className="h-8 rounded-lg border border-border bg-muted/50 w-3/4" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-12 rounded-full bg-muted-foreground/20" />
                  <div className="h-8 rounded-lg border border-border bg-muted/50 w-full" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-14 rounded-full bg-muted-foreground/20" />
                  <div className="h-8 rounded-lg border border-border bg-muted/50 w-2/3" />
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {["React", "TypeScript", "Node.js"].map((s) => (
                    <div key={s} className="px-2.5 py-1 rounded-full bg-primary/10 text-xs text-primary font-medium">{s}</div>
                  ))}
                </div>
              </div>
  
              <div className="col-span-3 p-8 flex items-center justify-center bg-muted/10">
                <div className="w-full max-w-sm bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-primary p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-28 rounded-full bg-white/40" />
                      <div className="h-2 w-20 rounded-full bg-white/25" />
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="space-y-1.5">
                      <div className="h-2 w-16 rounded-full bg-primary/30" />
                      <div className="h-1.5 w-full rounded-full bg-muted-foreground/10" />
                      <div className="h-1.5 w-4/5 rounded-full bg-muted-foreground/10" />
                    </div>
                    <div className="h-px bg-border" />
                    <div className="space-y-1.5">
                      <div className="h-2 w-20 rounded-full bg-primary/30" />
                      <div className="h-1.5 w-full rounded-full bg-muted-foreground/10" />
                      <div className="h-1.5 w-5/6 rounded-full bg-muted-foreground/10" />
                      <div className="h-1.5 w-3/4 rounded-full bg-muted-foreground/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </InView>
      </section>
    );
  }