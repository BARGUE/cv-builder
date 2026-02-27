"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { FileText, ArrowRight, ArrowUpRight, Palette, Zap, Shield, UserPlus, PenLine, LayoutGrid, Download } from "lucide-react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";

/* ─── Animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

function InView({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── Nav ─── */
function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
            <FileText className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight">CVBuilder</span>
        </Link>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm" asChild>
            <Link href="/auth/login">Connexion</Link>
          </Button>
          <Button size="sm" className="rounded-full px-5 text-sm" asChild>
            <Link href="/auth/login">Commencer →</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero ─── */
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Grid bg */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Blob */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1], x: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div style={{ y, opacity }} className="relative max-w-7xl mx-auto px-6 pt-28 pb-20">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          {/* Tag */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-primary mb-10">
              <span className="h-px w-6 bg-primary inline-block" />
              Gratuit · Sans engagement
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 className="text-[clamp(3rem,9vw,8rem)] font-black tracking-tighter leading-[0.9] text-foreground" variants={stagger}>
            <motion.span variants={fadeUp} className="block">Votre CV,</motion.span>
            <motion.span variants={fadeUp} className="block">
              <span className="text-primary">sans</span> effort.
            </motion.span>
          </motion.h1>

          {/* Sub + CTA */}
          <div className="mt-12 flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
            <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-xs leading-relaxed">
              6 templates pros, aperçu temps réel, export PDF. Prêt en 5 minutes.
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center gap-4">
              <Button size="lg" className="h-14 px-8 rounded-full text-base font-semibold" asChild>
                <Link href="/auth/register">
                  Créer mon CV
                  <motion.span
                    className="ml-2 inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Link>
              </Button>
              <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
                J&apos;ai déjà un compte
              </Link>
            </motion.div>
          </div>

          {/* Stat chips */}
          <motion.div variants={fadeUp} className="mt-16 flex flex-wrap gap-3">
            {[
              { val: "6", label: "templates" },
              { val: "100%", label: "gratuit" },
              { val: "5 min", label: "pour créer" },
            ].map(({ val, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
                <span className="font-bold text-primary">{val}</span>
                <span className="text-muted-foreground">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-[10px] tracking-widest uppercase text-muted-foreground">Scroll</span>
        <motion.div
          className="w-px h-8 bg-border origin-top"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

/* ─── Marquee ─── */
function Marquee() {
  const items = ["Classic", "Modern", "Creative", "Compact", "Executive", "Sidebar", "Export PDF", "Photo profil", "Compétences", "Langues"];
  return (
    <div className="border-y border-border py-4 overflow-hidden bg-muted/20">
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-sm font-medium text-muted-foreground flex items-center gap-3">
            <span className="text-primary">✦</span>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── App mockup ─── */
function AppMockup() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <InView>
        <motion.div variants={fadeUp} className="text-center mb-4">
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">L&apos;éditeur</span>
        </motion.div>
        <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tighter text-center mb-16">
          Tout en un seul endroit.
        </motion.h2>

        <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
          {/* Window chrome */}
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

          {/* App interior */}
          <div className="grid grid-cols-5 min-h-[320px] md:min-h-[400px]">
            {/* Left panel */}
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

            {/* Right panel (preview) */}
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

/* ─── Features ─── */
const feats = [
  { icon: Palette, num: "01", title: "6 templates\nprofessionnels", desc: "Classic, Modern, Creative, Compact, Executive, Sidebar — chaque style est entièrement personnalisable." },
  { icon: Zap, num: "02", title: "Aperçu\ntemps réel", desc: "Chaque modification est reflétée instantanément dans la prévisualisation. Pas d'attente." },
  { icon: Shield, num: "03", title: "Couleurs &\nbrand personnel", desc: "Choisissez une couleur d'accent pour que votre CV soit unique et mémorable." },
];

function Features() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <InView>
        <motion.div variants={fadeUp} className="flex items-center justify-between mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
            Ce qui fait<br />
            <span className="text-primary">la différence.</span>
          </h2>
          <span className="hidden md:block text-xs tracking-widest uppercase text-muted-foreground">Fonctionnalités</span>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
          {feats.map(({ icon: Icon, num, title, desc }) => (
            <motion.div
              key={num}
              variants={fadeUp}
              className="bg-card p-8 space-y-6 group hover:bg-primary/[0.02] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-mono text-muted-foreground/40">{num}</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight whitespace-pre-line">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              <div className="h-px w-0 group-hover:w-full bg-primary transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </InView>
    </section>
  );
}

/* ─── How it works ─── */
const steps = [
  { num: "1", icon: UserPlus, title: "Créez un compte", desc: "Inscription gratuite en 30 secondes." },
  { num: "2", icon: PenLine, title: "Remplissez vos infos", desc: "Guidé section par section, avec aperçu live." },
  { num: "3", icon: LayoutGrid, title: "Choisissez un template", desc: "6 designs + palette de couleurs." },
  { num: "4", icon: Download, title: "Exportez en PDF", desc: "Téléchargement direct, prêt à envoyer." },
];

function HowItWorks() {
  return (
    <section className="border-t border-border bg-muted/20 py-24 px-6">
      <InView className="max-w-7xl mx-auto">
        <motion.div variants={fadeUp} className="mb-16">
          <span className="text-xs tracking-widest uppercase text-muted-foreground">Processus</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mt-2">4 étapes.</h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map(({ num, title, desc, icon: Icon }) => (
            <motion.div
              key={num}
              variants={fadeUp}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative group rounded-2xl border border-border bg-card p-7 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 overflow-hidden"
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.06) 0%, transparent 70%)" }} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors duration-300">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-mono font-bold text-primary/40 group-hover:text-primary/70 transition-colors">0{num}</span>
                </div>
                <h3 className="font-bold text-base mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>

              {/* Bottom accent bar */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          ))}
        </div>
      </InView>
    </section>
  );
}

/* ─── CTA ─── */
function CTA() {
  return (
    <section className="relative overflow-hidden py-32 px-6">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: `radial-gradient(circle at 60% 50%, hsl(var(--primary)) 0%, transparent 60%)` }}
      />
      <InView className="max-w-3xl mx-auto text-center relative">
        <motion.p variants={fadeUp} className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
          Prêt à commencer ?
        </motion.p>
        <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-10">
          Votre prochain<br />
          <span className="text-primary">poste vous attend.</span>
        </motion.h2>
        <motion.div variants={fadeUp}>
          <Button size="lg" className="h-16 px-12 rounded-full text-lg font-bold group gap-3" asChild>
            <Link href="/auth/register">
              Créer mon CV gratuitement
              <ArrowUpRight className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">Aucune carte bancaire requise.</p>
        </motion.div>
      </InView>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-primary flex items-center justify-center">
            <FileText className="h-2.5 w-2.5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">CVBuilder</span>
        </div>
        <p>© {new Date().getFullYear()} CVBuilder. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

/* ─── Page ─── */
const Home = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Nav />
    <Hero />
    <Marquee />
    <AppMockup />
    <Features />
    <HowItWorks />
    <CTA />
    <Footer />
  </div>
);

export default Home;
