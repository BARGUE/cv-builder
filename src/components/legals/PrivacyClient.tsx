"use client";

import { Header } from "@/src/components/home/Header";
import { Footer } from "@/src/components/home/Footer";
import { motion } from "framer-motion";
import { fadeUp } from "@/src/lib/animations";
import { InView } from "@/src/components/home/InView";
import { Shield, Database, Target, Clock, Users, Lock, UserCheck, Cookie, Mail, Eye, FileCheck, Download, XCircle } from "lucide-react";

const sections = [
    {
        icon: Database,
        title: "1. Collecte des données",
        content: "Dans le cadre de l'utilisation de CVBuilder, nous collectons les données personnelles suivantes : nom, prénom, adresse email, numéro de téléphone, adresse postale, informations professionnelles et académiques saisies dans les CV.",
    },
    {
        icon: Target,
        title: "2. Finalités du traitement",
        content: "Les données collectées sont utilisées pour :",
        list: [
            "La création et la gestion de votre compte utilisateur",
            "La génération et le stockage de vos CV",
            "L'amélioration de nos services et de l'expérience utilisateur",
            "L'envoi de communications relatives au service",
        ],
    },
    {
        icon: FileCheck,
        title: "3. Base légale",
        content: "Le traitement de vos données repose sur l'exécution du contrat (fourniture du service) et, le cas échéant, sur votre consentement pour les communications marketing.",
    },
    {
        icon: Clock,
        title: "4. Durée de conservation",
        content: "Vos données personnelles sont conservées pendant toute la durée de votre inscription et pendant une durée de 3 ans après la dernière activité sur votre compte. Au-delà, vos données seront supprimées ou anonymisées.",
    },
    {
        icon: Users,
        title: "5. Partage des données",
        content: "Vos données ne sont pas vendues à des tiers. Elles peuvent être partagées avec nos sous-traitants techniques (hébergement, infrastructure) dans le strict cadre de la fourniture du service, et conformément au RGPD.",
    },
    {
        icon: Lock,
        title: "6. Sécurité",
        content: "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction. Les données sont chiffrées en transit et au repos.",
    },
    {
        icon: UserCheck,
        title: "7. Vos droits",
        content: "Conformément au RGPD, vous disposez des droits suivants :",
        rights: [
            { icon: Eye, label: "Droit d'accès", desc: "Obtenir une copie de vos données personnelles" },
            { icon: FileCheck, label: "Droit de rectification", desc: "Corriger vos données inexactes" },
            { icon: XCircle, label: "Droit à l'effacement", desc: "Demander la suppression de vos données" },
            { icon: Download, label: "Droit à la portabilité", desc: "Recevoir vos données dans un format structuré" },
            { icon: Shield, label: "Droit d'opposition", desc: "Vous opposer au traitement de vos données" },
        ],
    },
    {
        icon: Cookie,
        title: "8. Cookies",
        content: "CVBuilder utilise des cookies strictement nécessaires au fonctionnement du service (authentification, préférences). Aucun cookie publicitaire n'est utilisé sans votre consentement explicite.",
    },
    {
        icon: Mail,
        title: "9. Contact",
        content: "Pour toute question relative à la protection de vos données, vous pouvez nous écrire à contact@cvbuilder.fr ou via notre page de contact.",
    },
];

export default function PrivacyClient() {
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
                        Politique de <span className="text-gradient">confidentialité</span>
                    </h1>
                    <p className="text-lg text-white/60 max-w-xl mx-auto">
                        Dernière mise à jour : 12 mars 2026 — Vos données sont notre priorité.
                    </p>
                </motion.div>
            </section>

            {/* Trust bar */}
            <InView>
                <motion.div variants={fadeUp} className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
                    <div className="rounded-2xl border border-border bg-card p-6 grid sm:grid-cols-3 gap-6 shadow-sm">
                        {[
                            { icon: Lock, label: "Chiffrement", desc: "AES-256 en transit et au repos" },
                            { icon: Shield, label: "Conformité RGPD", desc: "Conforme aux normes européennes" },
                            { icon: XCircle, label: "Pas de revente", desc: "Vos données ne sont jamais vendues" },
                        ].map((item, i) => (
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
                        <h3 className="text-xl font-bold text-white mb-2">Exercez vos droits</h3>
                        <p className="text-white/60 text-sm mb-6">Contactez notre délégué à la protection des données pour toute demande liée à vos droits RGPD.</p>
                        <a href="/contact" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
                            Nous contacter
                        </a>
                    </div>
                </motion.section>
            </InView>

            <Footer />
        </div>
    );
}
