"use client";

import { motion } from "framer-motion";
import { InView } from "./InView";
import { fadeUp } from "@/src/lib/animations";
import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { StepIllustration } from "./StepIllustration";

const stepsData = [
  { illustration: <StepIllustration id={1} />, title: "Choisissez un modèle\napprouvé par les recruteurs." },
  { illustration: <StepIllustration id={2} />, title: "Complétez votre CV\navec aperçu en temps réel." },
  { illustration: <StepIllustration id={3} />, title: "Personnalisez le design\nselon vos goûts." },
  { illustration: <StepIllustration id={4} />, title: "Téléchargez votre CV et\ncommencez à postuler." },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
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
              <div className="rounded-2xl bg-[hsl(238,50%,95%)] p-4 mb-5 overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
                {illustration}
              </div>
              <p className="text-sm font-semibold text-white/80 leading-relaxed whitespace-pre-line text-center">
                {title}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} className="flex justify-center mt-14">
          <Button size="lg" className="h-14 px-10 rounded-xl text-base font-semibold gap-2" asChild>
            <Link href="/auth/register">
              Créer mon CV en ligne
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </InView>
    </section>
  );
}