"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { FileText, ArrowRight, Zap, LayoutGrid, Download } from "lucide-react";
import { motion } from "framer-motion";
import { InView } from "../components/home/InView";
import { LandingNav } from "../components/home/LandingNav";
import { HeroSection } from "../components/home/HeroSection";
import { LandingFooter } from "../components/home/LandingFooter";
import { fadeUp } from "../components/home/animations";

/* ─── Marquee (infinite scroll) ─── */
function Marquee() {
  const items = ["Classic", "Modern", "Creative", "Compact", "Executive", "Sidebar", "Export PDF", "Photo profil", "Compétences", "Langues"];
  return (
    <div className="relative overflow-hidden bg-background py-5 border-y border-border">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="flex w-max min-w-max shrink-0 animate-marquee">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-3 mx-6">
            <span className="text-primary text-xs">✦</span>
            <span className="text-sm font-semibold tracking-wide text-muted-foreground/60 uppercase">{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── App mockup ─── */
function AppMockup() {
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

/* ─── How it works ─── */
function StepIllustration1() {
  return (
    <div className="relative w-full h-44 flex items-center justify-center">
      {/* CV template mockup */}
      <div className="w-24 bg-white rounded-lg shadow-md border border-[hsl(238,50%,90%)] overflow-hidden relative z-10">
        <div className="h-2 bg-[hsl(238,66%,55%)]" />
        <div className="p-2 space-y-1.5">
          <div className="h-1 w-10 rounded-full bg-[hsl(238,66%,55%)]/30" />
          <div className="h-0.5 w-full rounded-full bg-gray-200" />
          <div className="h-0.5 w-4/5 rounded-full bg-gray-200" />
          <div className="h-px bg-gray-100 my-1" />
          <div className="h-0.5 w-full rounded-full bg-gray-200" />
          <div className="h-0.5 w-3/4 rounded-full bg-gray-200" />
          <div className="h-0.5 w-2/3 rounded-full bg-gray-200" />
        </div>
      </div>
      {/* Badge */}
      <div className="absolute top-3 left-6 w-8 h-8 rounded-lg bg-[hsl(238,66%,55%)] flex items-center justify-center shadow-lg z-20">
        <LayoutGrid className="h-3.5 w-3.5 text-white" />
      </div>
    </div>
  );
}

function StepIllustration2() {
  return (
    <div className="relative w-full h-44 flex items-center justify-center">
      <div className="w-32 bg-white rounded-lg shadow-md border border-[hsl(238,50%,90%)] overflow-hidden">
        <div className="border-b border-gray-100 px-2 py-1.5 flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-red-300" />
          <div className="w-1 h-1 rounded-full bg-yellow-300" />
          <div className="w-1 h-1 rounded-full bg-green-300" />
        </div>
        <div className="p-2 space-y-1.5">
          <div className="h-0.5 w-full rounded-full bg-[hsl(238,66%,55%)]/20" />
          <div className="h-0.5 w-full rounded-full bg-[hsl(238,66%,55%)]/20" />
          <div className="h-0.5 w-3/4 rounded-full bg-[hsl(238,66%,55%)]/20" />
          <div className="h-3 w-full rounded bg-[hsl(238,66%,55%)]/5 mt-1" />
          <div className="h-0.5 w-full rounded-full bg-[hsl(238,66%,55%)]/20" />
          <div className="h-0.5 w-5/6 rounded-full bg-[hsl(238,66%,55%)]/20" />
        </div>
      </div>
      {/* AI badge */}
      <div className="absolute top-2 right-8 bg-white rounded-full shadow-lg border border-[hsl(238,50%,90%)] px-2.5 py-1 flex items-center gap-1.5 z-20">
        <Zap className="h-3 w-3 text-[hsl(238,66%,55%)]" />
        <span className="text-[9px] font-semibold text-gray-700">Aperçu live</span>
      </div>
    </div>
  );
}

function StepIllustration3() {
  return (
    <div className="relative w-full h-44 flex items-center justify-center">
      <div className="space-y-2">
        {/* Size selector */}
        <div className="flex gap-1 bg-white rounded-lg shadow-md border border-[hsl(238,50%,90%)] p-1">
          {["XS", "S", "M", "L"].map((s, i) => (
            <div key={s} className={`px-2 py-1 rounded text-[9px] font-bold ${i === 2 ? "bg-[hsl(238,66%,55%)] text-white" : "text-gray-400"}`}>
              {s}
            </div>
          ))}
        </div>
        {/* Color palette */}
        <div className="flex gap-1 bg-white rounded-lg shadow-md border border-[hsl(238,50%,90%)] p-1.5">
          {["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899"].map((c) => (
            <div key={c} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
          ))}
        </div>
        {/* Format bar */}
        <div className="flex gap-1 bg-white rounded-lg shadow-md border border-[hsl(238,50%,90%)] p-1.5">
          {["B", "I", "U"].map((f) => (
            <div key={f} className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-[hsl(238,66%,55%)] bg-[hsl(238,66%,55%)]/10">
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepIllustration4() {
  return (
    <div className="relative w-full h-44 flex items-center justify-center">
      <div className="w-24 bg-white rounded-lg shadow-md border border-[hsl(238,50%,90%)] overflow-hidden">
        <div className="p-2 space-y-1">
          <div className="h-1 w-8 rounded-full bg-[hsl(238,66%,55%)]/30" />
          <div className="h-0.5 w-full rounded-full bg-gray-200" />
          <div className="h-0.5 w-4/5 rounded-full bg-gray-200" />
          <div className="h-px bg-gray-100" />
          <div className="h-0.5 w-full rounded-full bg-gray-200" />
          <div className="h-0.5 w-3/4 rounded-full bg-gray-200" />
        </div>
      </div>
      {/* Download badges */}
      <div className="absolute top-2 right-6 w-8 h-8 rounded-lg bg-[hsl(235,40%,14%)] flex items-center justify-center shadow-lg z-20">
        <Download className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="absolute bottom-6 left-8 bg-white rounded-md shadow-lg border border-[hsl(238,50%,90%)] px-2 py-1 flex items-center gap-1.5">
        <span className="text-[9px] font-bold text-gray-500">PDF</span>
        <div className="h-1.5 w-10 rounded-full bg-emerald-400" />
        <svg className="w-2.5 h-2.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  );
}

const stepsData = [
  { illustration: <StepIllustration1 />, title: "Choisissez un modèle\napprouvé par les recruteurs." },
  { illustration: <StepIllustration2 />, title: "Complétez votre CV\navec aperçu en temps réel." },
  { illustration: <StepIllustration3 />, title: "Personnalisez le design\nselon vos goûts." },
  { illustration: <StepIllustration4 />, title: "Téléchargez votre CV et\ncommencez à postuler." },
];

function HowItWorks() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Dark background matching hero */}
      <div className="absolute inset-0 bg-[hsl(235,40%,14%)]" />

      <InView className="max-w-7xl mx-auto relative">
        <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tighter text-center mb-16 text-white">
          Créer votre CV en <span className="text-[hsl(238,66%,70%)]">4 étapes</span>
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stepsData.map(({ illustration, title }, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group"
            >
              {/* Illustration card */}
              <div className="rounded-2xl bg-[hsl(238,50%,95%)] p-4 mb-5 overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
                {illustration}
              </div>
              {/* Title */}
              <p className="text-sm font-semibold text-white/80 leading-relaxed whitespace-pre-line text-center">
                {title}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div variants={fadeUp} className="flex justify-center mt-14">
          <Button size="lg" className="h-14 px-10 rounded-xl text-base font-semibold gap-2" asChild>
            <Link href="/auth?mode=register">
              Créer mon CV en ligne
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </InView>
    </section>
  );
}

/* ─── CTA Section ─── */
function CTASection() {
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden bg-muted/30">
      <div className="relative max-w-4xl mx-auto text-center">
        <InView>
          <motion.span variants={fadeUp} className="text-xs font-medium tracking-widest uppercase text-primary">
            Prêt à commencer ?
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[1.05] mt-6">
            Votre prochain<br />
            <span className="text-primary">poste vous attend.</span>
          </motion.h2>
          <motion.div variants={fadeUp} className="flex justify-center mt-10">
            <Button size="lg" className="h-14 px-10 rounded-xl text-base font-semibold gap-2" asChild>
              <Link href="/auth?mode=register">
                Créer mon CV gratuitement
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
          <motion.p variants={fadeUp} className="text-sm text-muted-foreground mt-5">
            Aucune carte bancaire requise.
          </motion.p>
        </InView>
      </div>
    </section>
  );
}
/* ─── Page ─── */
const Home = () => (
  <div className="min-h-screen bg-background text-foreground">
    <LandingNav />
    <HeroSection />
    <Marquee />
    <AppMockup />
    <HowItWorks />
    <CTASection />
    <LandingFooter />
  </div>
);

export default Home;
