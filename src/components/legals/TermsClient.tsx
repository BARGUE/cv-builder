"use client";

import { useTranslations } from "next-intl";
import { Header } from "@/src/components/home/Header";
import { Footer } from "@/src/components/home/Footer";
import { motion } from "framer-motion";
import { fadeUp } from "@/src/lib/animations";
import { InView } from "@/src/components/home/InView";
import { FileText, ShieldCheck, CreditCard, Scale, BookOpen, UserCheck, AlertTriangle, Gavel, Globe } from "lucide-react";
import type { ElementType } from "react";

const sectionIcons: ElementType[] = [BookOpen, FileText, UserCheck, CreditCard, AlertTriangle, ShieldCheck, Scale, Gavel, Globe];

export default function TermsClient() {
    const t = useTranslations("legal.terms");

    const sections = (t.raw("sections") as Array<{
        title: string;
        content: string;
    }>).map((section, i) => ({
        ...section,
        icon: sectionIcons[i],
    }));

    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Hero */}
            <section className="relative pt-28 pb-16 px-6 bg-[hsl(235,40%,14%)] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(238,66%,55%,0.12),transparent_60%)]" />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="max-w-4xl mx-auto text-center relative z-10"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        {t("heroTitle")} <span className="text-gradient">{t("heroTitleHighlight")}</span>
                    </h1>
                    <p className="text-lg text-white/60 max-w-xl mx-auto">
                        {t("heroSubtitle")}
                    </p>
                </motion.div>
            </section>

            {/* Content blocks */}
            <section className="py-16 px-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    {sections.map((section, i) => (
                        <InView key={i}>
                            <motion.div
                                variants={fadeUp}
                                className="rounded-2xl border border-border bg-card p-6 md:p-8 hover:shadow-md transition-shadow group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <section.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground mb-2">{section.title}</h2>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </InView>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <InView>
                <motion.section variants={fadeUp} className="py-12 px-6">
                    <div className="max-w-3xl mx-auto rounded-2xl bg-[hsl(235,40%,14%)] p-8 md:p-12 text-center">
                        <h3 className="text-xl font-bold text-white mb-2">{t("ctaTitle")}</h3>
                        <p className="text-white/60 text-sm mb-6">{t("ctaDescription")}</p>
                        <a href="/contact" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
                            {t("ctaButton")}
                        </a>
                    </div>
                </motion.section>
            </InView>

            <Footer />
        </div>
    );
}
