import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { motion } from "framer-motion";
import heroPerson from "@/public/assets/hero-person.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const, delay: i * 0.1 },
  }),
};

/* ─── Floating CV preview card ─── */
function FloatingCVCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="absolute -right-4 top-8 md:right-0 md:top-12 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-20"
    >
      {/* Mini CV header */}
      <div className="bg-[hsl(238,66%,55%)] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-bold text-white">EM</div>
          <div>
            <div className="text-[10px] font-semibold text-white">Elsa Monet</div>
            <div className="text-[8px] text-white/60">Conseillère de vente</div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 space-y-2">
        <div>
          <div className="text-[8px] font-semibold text-[hsl(238,66%,55%)] mb-1">Expérience professionnelle</div>
          <div className="space-y-0.5">
            <div className="h-1 w-full rounded-full bg-gray-100" />
            <div className="h-1 w-4/5 rounded-full bg-gray-100" />
            <div className="h-1 w-3/5 rounded-full bg-gray-100" />
          </div>
        </div>
        <div className="h-px bg-gray-100" />
        <div>
          <div className="text-[8px] font-semibold text-[hsl(238,66%,55%)] mb-1">Diplômes et formations</div>
          <div className="space-y-0.5">
            <div className="h-1 w-full rounded-full bg-gray-100" />
            <div className="h-1 w-5/6 rounded-full bg-gray-100" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Color palette floating card ─── */
function FloatingPalette() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="absolute left-0 bottom-1/3 md:left-4 md:bottom-1/3 bg-white rounded-lg shadow-xl border border-gray-100 px-3 py-2.5 z-20"
    >
      <div className="text-[9px] font-medium text-gray-500 mb-1.5">Compétences</div>
      <div className="flex gap-1.5 mb-2">
        {["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"].map((c) => (
          <div
            key={c}
            className="w-4 h-4 rounded-md cursor-pointer"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-[8px] text-gray-400">
        <span className="font-medium">B</span>
        <span className="italic">I</span>
        <span className="underline">U</span>
        <span>S</span>
      </div>
    </motion.div>
  );
}

/* ─── Download floating card ─── */
function FloatingDownload() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
      className="absolute bottom-8 right-4 md:bottom-12 md:right-8 bg-white rounded-lg shadow-xl border border-gray-100 px-4 py-2.5 z-20 flex items-center gap-2"
    >
      <Download className="h-3.5 w-3.5 text-[hsl(238,66%,55%)]" />
      <span className="text-xs font-medium text-gray-700">Importer mon CV</span>
    </motion.div>
  );
}

/* ─── Content pre-filled floating card ─── */
function FloatingContentCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="absolute top-2 right-12 md:top-4 md:right-16 bg-white rounded-lg shadow-xl border border-gray-100 px-3 py-2 z-30"
    >
      <div className="text-[9px] font-semibold text-gray-700 mb-1">Contenu pré-rédigé</div>
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="h-2 w-16 rounded-full bg-emerald-100" />
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16">
      {/* Dark background */}
      <div className="absolute inset-0 bg-[hsl(235,40%,14%)]" />
      {/* Diagonal accent */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full"
        style={{
          background: "linear-gradient(160deg, hsl(238 50% 20%) 0%, hsl(235 40% 14%) 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: text content */}
          <div className="space-y-7">
            {/* Social proof */}
            <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[hsl(235,40%,14%)] bg-[hsl(238,50%,30%)] flex items-center justify-center text-[10px] font-bold text-white/70"
                  >
                    {["A", "M", "S"][i]}
                  </div>
                ))}
              </div>
              <span className="text-sm text-white/60">
                <span className="text-[hsl(238,66%,70%)] font-semibold">+1 000</span> d'utilisateurs satisfaits
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight leading-[1.1] text-white"
            >
              Créez un CV en ligne
              <br />
              en toute simplicité
            </motion.h1>

            {/* Subtitle */}
            <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUp} className="text-base text-white/50 max-w-md leading-relaxed">
              Créez un CV en quelques minutes grâce à nos modèles approuvés par les recruteurs. 6 templates professionnels, aperçu temps réel.
            </motion.p>

            {/* CTAs */}
            <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-wrap items-center gap-4 pt-1">
              <Button size="lg" className="h-14 px-10 rounded-xl text-base font-semibold gap-2" asChild>
                <Link href="/auth?mode=register">
                  Créer mon CV
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 rounded-xl text-base font-medium border-white/15 text-white hover:bg-white/10 hover:text-white bg-transparent"
                asChild
              >
                <Link href="/auth?mode=login">J'ai déjà un compte</Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-wrap gap-8 pt-3">
              {[
                { val: "100%", label: "gratuit" },
                { val: "6", label: "templates" },
                { val: "5 min", label: "pour créer" },
              ].map(({ val, label }) => (
                <div key={label} className="text-sm">
                  <span className="font-bold text-white">{val}</span>{" "}
                  <span className="text-white/40">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: photo + floating cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center"
          >
            {/* Photo */}
            <div className="relative w-72 md:w-80 lg:w-[340px]">
              <img
                src={heroPerson.src}
                alt="Utilisatrice créant son CV"
                className="w-full rounded-2xl object-cover shadow-2xl"
                style={{ aspectRatio: "3/4" }}
              />
              {/* Overlay gradient on photo */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[hsl(235,40%,14%)]/30 to-transparent" />
            </div>

            {/* Floating cards */}
            <FloatingCVCard />
            <FloatingPalette />
            <FloatingContentCard />
            <FloatingDownload />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
