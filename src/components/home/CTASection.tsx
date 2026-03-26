"use client";

import { motion } from "framer-motion";
import { InView } from "./InView";
import { fadeUp } from "@/src/lib/animations";
import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
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
                <Link href={"/auth/register"}>
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