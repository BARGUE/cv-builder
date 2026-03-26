"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroPerson from "@/public/assets/hero-person.jpg";
import { fadeUp } from "@/src/lib/animations";
import { FloatingCard } from "./FloatingCard";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16">
      <div className="absolute inset-0 bg-[hsl(235,40%,14%)]" />
      <div
        className="absolute top-0 right-0 w-1/2 h-full"
        style={{
          background: "linear-gradient(160deg, hsl(238 50% 20%) 0%, hsl(235 40% 14%) 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-7">
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

            <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUp} className="text-base text-white/50 max-w-md leading-relaxed">
              Créez un CV en quelques minutes grâce à nos modèles approuvés par les recruteurs. 6 templates professionnels, aperçu temps réel.
            </motion.p>

            <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-wrap items-center gap-4 pt-1">
              <Button size="lg" className="h-14 px-10 rounded-xl text-base font-semibold gap-2" asChild>
                <Link href="/auth/register">
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
                <Link href="/auth/login">J'ai déjà un compte</Link>
              </Button>
            </motion.div>

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

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative w-72 md:w-80 lg:w-[340px]">
              <img
                src={heroPerson.src}
                alt="Utilisatrice créant son CV"
                className="w-full rounded-2xl object-cover shadow-2xl"
                style={{ aspectRatio: "3/4" }}
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[hsl(235,40%,14%)]/30 to-transparent" />
            </div>

            <FloatingCard id="cv" />
            <FloatingCard id="palette" />
            <FloatingCard id="download" />
            <FloatingCard id="content" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
