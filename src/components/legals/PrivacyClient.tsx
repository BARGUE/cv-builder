"use client";

import { useTranslations } from "next-intl";
import { Header } from "@/src/components/home/Header";
import { Footer } from "@/src/components/home/Footer";
import { motion } from "framer-motion";
import { fadeUp } from "@/src/lib/animations";
import { InView } from "@/src/components/home/InView";
import { Shield, Database, Target, Clock, Users, Lock, UserCheck, Cookie, Mail, Eye, FileCheck, Download, XCircle } from "lucide-react";
import type { ElementType } from "react";

const sectionIcons: ElementType[] = [Database, Target, FileCheck, Clock, Users, Lock, UserCheck, Cookie, Mail];
const rightIcons: ElementType[] = [Eye, FileCheck, XCircle, Download, Shield];
const trustBarIcons: ElementType[] = [Lock, Shield, XCircle];

export default function PrivacyClient() {
    const t = useTranslations("legal.privacy");

    const sections = (t.raw("sections") as Array<{
        title: string;
        content: string;
        list?: string[];
        rights?: Array<{ label: string; desc: string }>;
    }>).map((section, i) => ({
        ...section,
        icon: sectionIcons[i],
        rights: section.rights?.map((right, j) => ({
            ...right,
            icon: rightIcons[j],
        })),
    }));

    const trustBar = (t.raw("trustBar") as Array<{ label: string; desc: string }>).map((item, i) => ({
        ...item,
        icon: trustBarIcons[i],
    }));

    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Hero */}
            <section className="relative pt-28 pb-16 px-6 bg-[hsl(235,40%,14%)] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(238,66%,55%,0.12),transparent_60%)]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
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

            {/* Trust bar */}
            <InView>
                <motion.div variants={fadeUp} className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
                    <div className="rounded-2xl border border-border bg-card p-6 grid sm:grid-cols-3 gap-6 shadow-sm">
                        {trustBar.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <item.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </InView>

            {/* Content sections */}
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
                                    <div className="flex-1">
                                        <h2 className="text-lg font-bold text-foreground mb-2">{section.title}</h2>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>

                                        {section.list && (
                                            <ul className="mt-3 space-y-2">
                                                {section.list.map((item, j) => (
                                                    <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {section.rights && (
                                            <div className="mt-4 grid sm:grid-cols-2 gap-3">
                                                {section.rights.map((right, j) => (
                                                    <div key={j} className="flex items-start gap-3 rounded-xl bg-muted/50 p-3">
                                                        <right.icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground">{right.label}</p>
                                                            <p className="text-xs text-muted-foreground">{right.desc}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
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
                        <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
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
